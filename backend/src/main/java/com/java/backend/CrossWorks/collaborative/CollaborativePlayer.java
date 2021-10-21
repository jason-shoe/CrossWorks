package com.java.backend.CrossWorks.collaborative;

import java.util.UUID;

public class CollaborativePlayer {
    private final String playerId;

    public CollaborativePlayer() {
        playerId = UUID.randomUUID().toString();
    }
    public String getPlayerId() {
        return playerId;
    }

}
