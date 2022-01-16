package com.java.backend.CrossWorks.collaborative;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.java.backend.CrossWorks.exceptions.InvalidMove;
import com.java.backend.CrossWorks.models.*;
import com.java.backend.CrossWorks.service.HttpUtil;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.UUID;
import java.util.Vector;

@Entity
@Table(name = "COMPETITIVEGAME")
public class CompetitiveGame extends Game {
    @Column(columnDefinition = "LONGTEXT")
    private final Vector<Team> players;
    @Column(columnDefinition = "LONGTEXT")
    private Vector<TeamAnswers> answers;
    @Column(columnDefinition = "LONGTEXT")
    private Vector<TeamAnswers> maskedAnswers;

    private int winningTeam;

    public CompetitiveGame() {
        super(Datatype.COMPETITIVE_GAME.prefix + UUID.randomUUID());
        players = new Vector();
    }

    public boolean addPlayer(Player player) {
        if (this.getStatus() == GameStatus.SETTINGS) {
            if (!this.hasPlayer(player)) {
                Team newTeam = new Team();
                newTeam.add(player);
                players.addElement(newTeam);
            }
            return true;
        }
        return false;
    }

    public boolean removePlayer(Player player) {
        for (int i = 0; i < players.size(); i++) {
            if (players.get(i).contains(player)) {
                boolean removedPlayer = players.get(i).remove(player);
                if (removedPlayer && players.get(i).size() == 0 &&
                        this.getStatus() == GameStatus.SETTINGS) {
                    players.remove(i);
                }
                return removedPlayer;
            }
        }

        return false;
    }

    public boolean hasPlayer(Player player) {
        if (players == null) {
            return false;
        }

        return getTeamNumber(player) != -1;
    }

    @JsonIgnore
    public boolean hasPlayers() {
        if (players == null) {
            return false;
        }
        return players.size() != 0;
    }

    public boolean makeMove(Player player, int x, int y, char val) throws InvalidMove {
        int teamNumber = this.getTeamNumber(player);
        if (teamNumber == -1) {
            return false;
        }
        GridCell entry = GridCell.charValueOf(val);
        GridCell correctEntry = this.getCell(x, y);
        answers.get(teamNumber).makeMove(x, y, entry, correctEntry);

        if (correctEntry == entry) {
            maskedAnswers.get(teamNumber).makeMove(x, y, GridCell.CORRECT, GridCell.CORRECT);
        } else {
            maskedAnswers.get(teamNumber).makeMove(x, y, GridCell.INCORRECT, GridCell.CORRECT);
        }

        if (answers.get(teamNumber).isComplete()) {
            if (answers.get(teamNumber).isCorrect()) {
                this.winGame();
                setWinningTeam(teamNumber);
            } else {
                this.markIncorrect();
            }
            return true;
        }

        return false;
    }

    public void sendTeamAnswers(SimpMessagingTemplate simpMessagingTemplate) {
        int numTeams = this.getNumTeams();
        Grid[] unmaskedAnswers = this.getTeamAnswers();
        Grid[] maskedAnswers = this.getMaskedTeamAnswers();

        Grid[] temp = maskedAnswers.clone();

        for (int i = 0; i < numTeams; i++) {
            temp[i] = unmaskedAnswers[i];
            simpMessagingTemplate.convertAndSend(
                    "queue/game/" + this.getGameId() + "/" + i + "-team",
                    HttpUtil.createResponse(temp, "answersUpdate", null));
            temp[i] = maskedAnswers[i];
        }
        return;

    }

    public void setEmptyAnswers() {
        Crossword crossword = this.getCrossword();
        Grid answersGrid = new Grid(crossword.getSize());
        answersGrid.copyStructure(crossword.getBoard());
        int numCells = crossword.getNumNonBlock();

        answers = new Vector<>();
        maskedAnswers = new Vector<>();
        for (int i = 0; i < players.size(); i++) {
            answers.addElement(new TeamAnswers(new Grid(answersGrid), numCells));
            maskedAnswers.addElement(new TeamAnswers(new Grid(answersGrid), numCells));
        }
    }

    public void reset() {
        answers = null;
        maskedAnswers = null;
        winningTeam = -1;
    }

    public Vector<Vector<Player>> getPlayers() {
        if (players == null) {
            return new Vector<>();
        }
        Vector<Vector<Player>> playersObj = new Vector<Vector<Player>>();
        for (Team team : players) {
            playersObj.add(team.getPlayers());
        }
        return playersObj;
    }

    public int getNumTeams() {
        return players.size();
    }

    public int getTeamNumber(Player player) {
        for (int i = 0; i < players.size(); i++) {
            if (players.get(i).contains(player)) {
                return i;
            }
        }
        return -1;
    }

    public int getWinningTeam() {
        return winningTeam;
    }

    public void setWinningTeam(int winningTeam) {
        this.winningTeam = winningTeam;
    }

    public void switchTeam(Player player, int teamNumber) {
        int oldTeamNumber = getTeamNumber(player);
        if (oldTeamNumber == -1) {
            return;
        }

        players.get(oldTeamNumber).remove(player);
        players.get(teamNumber).add(player);
        if (players.get(oldTeamNumber).size() == 0) {
            players.remove(oldTeamNumber);
        }
    }

    public void newTeam(Player player) {
        this.removePlayer(player);
        this.addPlayer(player);
    }

    @JsonIgnore
    public Grid[] getTeamAnswers() {
        Grid[] teamAnswers = new Grid[this.getNumTeams()];
        for (int i = 0; i < this.getNumTeams(); i++) {
            teamAnswers[i] = answers.get(i).getAnswers();
        }
        return teamAnswers;
    }


    @JsonIgnore
    public Grid[] getMaskedTeamAnswers() {
        Grid[] teamAnswers = new Grid[this.getNumTeams()];
        for (int i = 0; i < this.getNumTeams(); i++) {
            teamAnswers[i] = maskedAnswers.get(i).getAnswers();
        }
        return teamAnswers;
    }

}
