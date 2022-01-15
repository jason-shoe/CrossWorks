package com.java.backend.CrossWorks.collaborative;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.java.backend.CrossWorks.exceptions.InvalidMove;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.models.Datatype;
import com.java.backend.CrossWorks.models.Grid;
import com.java.backend.CrossWorks.models.GridCell;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.persistence.*;
import java.util.UUID;
import java.util.Vector;

@Entity
@Table(name = "COLLABORATIVEGAME")
public class CollaborativeGame extends Game {
    @Column(columnDefinition = "LONGTEXT")
    private final Vector<Player> players;
    @ManyToOne(cascade = {CascadeType.ALL})
    private TeamAnswers answers;

    public CollaborativeGame() {
        super(Datatype.COLLABORATIVE_GAME.prefix + UUID.randomUUID());
        players = new Vector();
    }

    public CollaborativeGame(Crossword crossword) {
        this();
        setCrossword(crossword);
    }

    public void setCrossword(Crossword crossword) {
        this.changeCrossword(crossword);

        Grid answersGrid = new Grid(crossword.getSize());
        answersGrid.copyStructure(crossword.getBoard());
        int numCells = crossword.getNumNonBlock();

        this.answers = new TeamAnswers(answersGrid, numCells);
    }

    public void addPlayer(Player player) {
        if (!players.contains(player)) {
            players.addElement(player);
        }
    }

    public boolean hasPlayer(Player player) {
        if (players == null) {
            return false;
        }
        for (Player arrayPlayer : players) {
            System.out.print(arrayPlayer.getPlayerId());
            if (arrayPlayer.getPlayerId().equals(player.getPlayerId())) {
                System.out.println();
                return true;
            }
        }
        System.out.println();
        return false;
    }

    public void removePlayer(Player player) {
        players.remove(player);
    }

    public void startGame() {
        System.out.println("Start game thing");
        super.startGame();
        answers.clear();
    }

    @JsonIgnore
    public boolean hasPlayers() {
        if (players == null) {
            return false;
        }
        return players.size() != 0;
    }

    public Vector<Player> getPlayers() {
        if (players == null) {
            return new Vector<>();
        }
        return players;
    }

    public void makeMove(Player player, int x, int y, char val) throws InvalidMove {
        answers.makeMove(x, y, GridCell.charValueOf(val), this.getCell(x, y));
        if (answers.isComplete()) {
            if (answers.isCorrect()) {
                this.winGame();
            } else {
                this.markIncorrect();
            }
        }
    }

    public Grid getTeamAnswers() {
        if (answers != null) {
            return answers.getAnswers();
        } else {
            return null;
        }
    }

    public void sendTeamAnswers(SimpMessagingTemplate simpMessagingTemplate) {
        return;
    }

}
