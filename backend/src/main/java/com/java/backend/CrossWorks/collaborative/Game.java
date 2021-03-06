package com.java.backend.CrossWorks.collaborative;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.java.backend.CrossWorks.exceptions.InvalidMove;
import com.java.backend.CrossWorks.models.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Game {
    @Id
    @Column(name = "GAMEID")
    private final String gameId;
    @ManyToOne(cascade = {CascadeType.PERSIST})
    private Crossword crossword;
    private GameStatus status;

    public Game() {
        this(Datatype.GAME.prefix + UUID.randomUUID());
        this.reset();
    }

    public Game(String gameId) {
        this.gameId = gameId;
        this.reset();
        status = GameStatus.SETTINGS;
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

    public void setCrossword(Crossword crossword) {
        this.crossword = crossword;
    }


    public GameStatus getStatus() {
        return status;
    }

    public void startGame() {
        status = GameStatus.STARTED;
        this.setEmptyAnswers();
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
        this.reset();
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

    public abstract boolean addPlayer(Player player);

    public abstract boolean removePlayer(Player player);

    public abstract boolean hasPlayer(Player player);

    public abstract boolean hasPlayers();

    // returns whether or not a game update needs to be sent
    public abstract boolean makeMove(Player player, int x, int y, char val) throws InvalidMove;

    public abstract void sendTeamAnswers(SimpMessagingTemplate simpMessagingTemplate);

    public abstract void setEmptyAnswers();

    public abstract void reset();

}
