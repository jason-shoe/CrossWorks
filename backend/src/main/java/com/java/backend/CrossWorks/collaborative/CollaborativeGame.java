package com.java.backend.CrossWorks.collaborative;

import java.util.UUID;
import java.util.Vector;

import com.java.backend.CrossWorks.exceptions.InvalidMove;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.models.GameStatus;
import com.java.backend.CrossWorks.models.Grid;
import com.java.backend.CrossWorks.models.GridCell;

import javax.persistence.*;

@Entity
public class CollaborativeGame {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    private String gameId;
    private Vector<CollaborativePlayer> players;
    @ManyToOne(cascade = {CascadeType.ALL})
    private Crossword crossword;
    @ManyToOne(cascade = {CascadeType.ALL})
    private Grid answers;
    private GameStatus status;

    private int numFilled;
    private int numCorrect;
    private int numCells;

    protected CollaborativeGame() {}

    public CollaborativeGame(String gameId) {
        this.gameId = gameId;
        players = new Vector();
        status = GameStatus.NOT_STARTED;
        setCrossword("todo later");
    }

    public String getGameId() {
        return gameId;
    }

    public Long getId() {
        return id;
    }

    public void setCrossword(String crosswordId) {
        Crossword crossword = new Crossword(crosswordId, 10);
        answers = new Grid(crossword.getSize());
        answers.copyStructure(crossword.getBoard());

        numCells = crossword.getNumNumBlock();
        numFilled = 0;
        numCorrect = 0;

    }

    public void startGame() {
        status = GameStatus.IN_PROGRESS;
    }

    public void endGame() {
        status = GameStatus.FINISHED;
        System.out.println("Game is finished");
    }

    public Boolean checkFinished() {
        return numCorrect == numCells;
    }

    public void addPlayer(CollaborativePlayer player) {
        players.addElement(player);
    }

    public Vector<String> getPlayerIds() {
        Vector<String> player_ids = new Vector(players.size());
        for (int x = 0; x < players.size(); x++) {
            player_ids.add(x, players.get(x).getPlayerId());
        }
        return player_ids;
    }

    public void makeMove(CollaborativePlayer player, int x, int y, char val) throws InvalidMove {
        // mapping char -> GridCell
        GridCell gridCellVal = GridCell.EMPTY;
        for (GridCell cell: GridCell.values()) {
            if (cell.charValue == val) {
                gridCellVal = cell;
            }
        }

        GridCell currentValue = answers.getCell(x, y);
        if (currentValue == GridCell.BLOCK) {
            throw new InvalidMove("Tried filling a blocked cell");
        }

        if (currentValue != GridCell.EMPTY) {
            numFilled += 1;
        }

        answers.setCell(x, y, gridCellVal);
        if (crossword.checkCell(x, y, gridCellVal)) {
            numCorrect += 1;

            if (checkFinished()) {
                endGame();
            }
        }


    }

}
