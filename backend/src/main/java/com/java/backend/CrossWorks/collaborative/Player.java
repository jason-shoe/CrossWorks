package com.java.backend.CrossWorks.collaborative;

import com.java.backend.CrossWorks.models.Datatype;

import java.util.UUID;

public class Player{
    private final String playerId;

    public Player() {
        playerId = Datatype.COLLABORATIVE_PLAYER.prefix + UUID.randomUUID().toString();
    }
    public String getPlayerId() {
        return playerId;
    }

}
