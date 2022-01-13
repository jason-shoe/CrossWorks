package com.java.backend.CrossWorks.models;

public enum Datatype {
    CROSSWORD("crossword-"),
    CROSSWORD_HINT("crossword_hint-"),
    TEAM_ANSWERS("team-answers-"),
    PLAYER("player-"),
    GAME("game-"),
    COLLABORATIVE_GAME("collaborative_game-"),
    COMPETITIVE_GAME("competitive_game-");

    public final String prefix;

    Datatype(String prefix) {
        this.prefix = prefix;
    }


}
