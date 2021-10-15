package src.main.java.com.javabackend.crossworks.collaborative;

import java.util.UUID;

public class CollaborativePlayer {
    private String playerId;

    public CollaborativePlayer() {
        playerId = UUID.randomUUID().toString();
    }
    public String getPlayerId() {
        return playerId;
    }
}
