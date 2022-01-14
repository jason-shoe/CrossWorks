package com.java.backend.CrossWorks.collaborative;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.java.backend.CrossWorks.exceptions.InvalidMove;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.models.Datatype;
import com.java.backend.CrossWorks.models.Grid;
import com.java.backend.CrossWorks.models.GridCell;

import javax.persistence.*;
import java.util.UUID;
import java.util.Vector;

@Entity
@Table(name = "COMPETITIVEGAME")
public class CompetitiveGame extends Game {
    @Column(columnDefinition = "LONGTEXT")
    private Vector<Team> players;
    @Column(columnDefinition = "LONGTEXT")
    private Vector<TeamAnswers> answers;
    @Column(columnDefinition = "LONGTEXT")
    private Vector<TeamAnswers> maskedAnswers;

    @ManyToOne(cascade = CascadeType.ALL)
    private Grid answersGrid;
    private int numCells;

    public CompetitiveGame() {
        super(Datatype.COMPETITIVE_GAME.prefix + UUID.randomUUID());
        players = new Vector();
    }

    public CompetitiveGame(Crossword crossword) {
        this();
        setCrossword(crossword);
    }

    public void detach() {
        super.detach();
        answers = null;
        maskedAnswers = null;
        players = null;
    }

    public void setCrossword(Crossword crossword) {
        this.changeCrossword(crossword);

        Grid answersGrid = new Grid(crossword.getSize());
        answersGrid.copyStructure(crossword.getBoard());
        int numCells = crossword.getNumNonBlock();
        this.answersGrid = answersGrid;
        this.numCells = numCells;
    }

    public void addPlayer(Player player) {
        System.out.println("trying to add a player");
        if (this.hasPlayer(player)) {
            return;
        }


        System.out.println("1");
        Team newTeam = new Team();
        System.out.println("2");
        newTeam.add(player);
        System.out.println("3");
        players.addElement(newTeam);
        System.out.println("4");
    }

    public void removePlayer(Player player) {
        for (int i = 0; i < players.size(); i++) {
            if (players.get(i).contains(player)) {
                players.get(i).remove(player);
                if (players.get(i).size() == 0) {
                    players.remove(i);
                }
                return;
            }
        }
    }


    public int getTeamNumber(Player player) {
        for (int i = 0; i < players.size(); i++) {
            if (players.get(i).contains(player)) {
                return i;
            }
        }
        return -1;
    }

    public int getNumTeams() {
        return players.size();
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


    public boolean hasPlayer(Player player) {
        if (players == null) {
            return false;
        }

        return getTeamNumber(player) != -1;
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

    public void startGame() {
        System.out.println("Start game thing");
        super.startGame();
        answers = new Vector<>();
        maskedAnswers = new Vector<>();
        for (int i = 0; i < players.size(); i++) {
            answers.addElement(new TeamAnswers(new Grid(answersGrid), numCells));
            maskedAnswers.addElement(new TeamAnswers(new Grid(answersGrid), numCells));
        }
    }

    @JsonIgnore
    public boolean hasPlayers() {
        if (players == null) {
            return false;
        }
        return players.size() != 0;
    }

    public Vector<Vector<String>> getPlayerIds() {
        if (players == null) {
            return new Vector<>();
        }
        Vector<Vector<String>> player_ids = new Vector<Vector<String>>();
        for (int i = 0; i < players.size(); i++) {
            player_ids.add(new Vector<String>());
            for (Player currPlayer : players.get(i).getPlayers()) {
                player_ids.get(i).add(currPlayer.getPlayerId());
            }
        }
        return player_ids;
    }

    public void makeMove(Player player, int x, int y, char val) throws InvalidMove {
        int teamNumber = this.getTeamNumber(player);
        if (teamNumber == -1) {
            return;
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
            } else {
                this.markIncorrect();
            }
        }
    }

}
