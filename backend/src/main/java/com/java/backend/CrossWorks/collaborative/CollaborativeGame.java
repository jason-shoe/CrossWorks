package com.java.backend.CrossWorks.collaborative;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.java.backend.CrossWorks.exceptions.InvalidMove;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.models.Datatype;
import com.java.backend.CrossWorks.models.Grid;
import com.java.backend.CrossWorks.models.GridCell;
import com.java.backend.CrossWorks.service.HttpUtil;
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

    public boolean addPlayer(Player player) {
        if (!players.contains(player)) {
            players.addElement(player);
        }

        return true;
    }

    public boolean removePlayer(Player player) {
        return players.remove(player);
    }

    public boolean hasPlayer(Player player) {
        if (players == null) {
            return false;
        }
        for (Player arrayPlayer : players) {
            if (arrayPlayer.getPlayerId().equals(player.getPlayerId())) {
                return true;
            }
        }
        return false;
    }

    @JsonIgnore
    public boolean hasPlayers() {
        if (players == null) {
            return false;
        }
        return players.size() != 0;
    }

    public boolean makeMove(Player player, int x, int y, char val) throws InvalidMove {
        answers.makeMove(x, y, GridCell.charValueOf(val), this.getCell(x, y));
        if (answers.isComplete()) {
            if (answers.isCorrect()) {
                this.winGame();
            } else {
                this.markIncorrect();
            }
            return true;
        }
        return false;
    }

    public void sendTeamAnswers(SimpMessagingTemplate simpMessagingTemplate) {
        if (answers != null) {
            Vector<Grid> answersVector = new Vector();
            answersVector.add(answers.getAnswers());
            simpMessagingTemplate.convertAndSend(
                    HttpUtil.getGameEndpoint(this.getGameId()),
                    HttpUtil.createResponse(answersVector, "answersUpdate", null));
        }
    }

    public void setEmptyAnswers() {
        Crossword crossword = this.getCrossword();
        Grid answersGrid = new Grid(crossword.getSize());
        answersGrid.copyStructure(crossword.getBoard());
        int numCells = crossword.getNumNonBlock();
        this.answers = new TeamAnswers(answersGrid, numCells);
    }

    public void reset() {
        answers = null;
    }

    public Vector<Player> getPlayers() {
        if (players == null) {
            return new Vector<>();
        }
        return players;
    }

}
