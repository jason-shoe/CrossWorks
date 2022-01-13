package com.java.backend.CrossWorks.collaborative;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.java.backend.CrossWorks.exceptions.InvalidMove;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.models.Datatype;
import com.java.backend.CrossWorks.models.Grid;
import com.java.backend.CrossWorks.models.GridCell;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.UUID;
import java.util.Vector;

@Entity
@Table(name = "COMPETITIVEGAME")
public class CompetitiveGame extends Game {
    @Column(columnDefinition = "LONGTEXT")
    private Vector<Team> players;
    @Column(columnDefinition = "LONGTEXT")
    private Vector<TeamAnswers> answers;

    @ManyToOne
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
        if (this.hasPlayer(player)) {
            return;
        }

        Team newTeam = new Team();
        newTeam.add(player);
        players.addElement(newTeam);
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
        for (int i = 0; i < players.size(); i++) {
            answers.addElement(new TeamAnswers(answersGrid, numCells));
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
        answers.get(teamNumber).makeMove(x, y, GridCell.charValueOf(val), this.getCell(x, y));
        if (answers.get(teamNumber).isComplete()) {
            if (answers.get(teamNumber).isCorrect()) {
                this.winGame();
            } else {
                this.markIncorrect();
            }
        }
    }

}
