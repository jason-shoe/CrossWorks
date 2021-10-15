package com.java.backend.CrossWorks.collaborative;

import java.util.UUID;
import java.util.Vector;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.models.Grid;

public class CollaborativeGame {
    private String gameId;
    private Vector<CollaborativePlayer> players;
    private Crossword crossword;
    private Grid answers;

    public CollaborativeGame() {
        gameId = UUID.randomUUID().toString();
        players = new Vector();
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
}
