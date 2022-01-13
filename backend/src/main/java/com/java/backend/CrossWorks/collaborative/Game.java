package com.java.backend.CrossWorks.collaborative;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.java.backend.CrossWorks.models.*;

import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import java.util.UUID;

@MappedSuperclass
public class Game {
    @Id
    private final String gameId;
    @ManyToOne
    private Crossword crossword;
    private GameStatus status;

    public Game() {
        this(Datatype.GAME.prefix + UUID.randomUUID());
    }

    public Game(String gameId) {
        this.gameId = gameId;
        status = GameStatus.SETTINGS;
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

    @JsonIgnoreProperties("answers")
    public Crossword getCrossword() {
        return crossword;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void startGame() {
        status = GameStatus.STARTED;
    }

    public void pauseGame() {
        status = GameStatus.PAUSED;
    }

    public void unpauseGame() {
        status = GameStatus.STARTED;
    }

    public void markIncorrect() {
        status = GameStatus.INCORRECT;
    }

    public void loseGame() {
        status = GameStatus.LOST;
    }

    public void winGame() {
        status = GameStatus.WON;
    }

    public void returnToSettings() {
        status = GameStatus.SETTINGS;
    }

    public GridCell getCell(int x, int y) {
        return crossword.getAnswers().getCell(x, y);
    }

    public Grid getBoard() {
        if (crossword != null) {
            return crossword.getBoardProtected(status == GameStatus.LOST);
        } else {
            return null;
        }
    }
}
