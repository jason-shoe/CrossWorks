package src.main.java.com.javabackend.crossworks.collaborative;

import src.main.java.com.javabackend.crossworks.models.Crossword;
import src.main.java.com.javabackend.crossworks.models.Grid;

import java.util.UUID;
import java.util.Vector;

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
