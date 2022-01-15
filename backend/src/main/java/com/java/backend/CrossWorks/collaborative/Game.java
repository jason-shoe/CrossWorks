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

    public abstract void setCrossword(Crossword crossword);

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

    public abstract boolean hasPlayers();

    public abstract void addPlayer(Player player);

    public abstract void removePlayer(Player player);

    public abstract boolean hasPlayer(Player player);

    public abstract void makeMove(Player player, int x, int y, char val) throws InvalidMove;

    public abstract void sendTeamAnswers(SimpMessagingTemplate simpMessagingTemplate);

}
