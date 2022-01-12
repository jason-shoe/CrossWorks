package com.java.backend.CrossWorks.collaborative;

import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.models.Datatype;
import com.java.backend.CrossWorks.models.GameStatus;
import com.java.backend.CrossWorks.models.GridCell;

import javax.persistence.*;
import java.util.UUID;

@MappedSuperclass
public class Game {
    @Id
    private String gameId;
    @ManyToOne(cascade = {CascadeType.ALL})
    private Crossword crossword;
    private GameStatus status;

    public Game() {
        this(Datatype.GAME.prefix + UUID.randomUUID().toString());
    }

    public Game(String gameId) {
        this.gameId = gameId;
        status = GameStatus.NOT_STARTED;
    }

    public void changeCrossword(Crossword crossword) {
        this.crossword = crossword;
    }

    public String getGameId() {
        return gameId;
    }

    public String getCrosswordId() {
        if (crossword != null) {
            return crossword.getCrosswordId();
        }
        return "";
    }

    public void startGame() {
        status = GameStatus.IN_PROGRESS;
    }

    public void endGame() {
        status = GameStatus.FINISHED;
    }

    public GridCell getCell(int x, int y) {
        return crossword.getAnswers().getCell(x, y);
    }
}
