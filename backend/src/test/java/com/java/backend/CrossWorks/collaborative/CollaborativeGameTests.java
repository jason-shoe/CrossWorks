package com.java.backend.CrossWorks.collaborative;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Vector;

@SpringBootTest
class CollaborativeGameTests {

    @Test
    void correctPlayers() {
        CollaborativeGame game = new CollaborativeGame();
        Player playerOne = new Player("sessionTwo");
        Player playerTwo = new Player("sessionOne");

        game.addPlayer(playerOne);
        game.addPlayer(playerTwo);

        Vector<Player> players = game.getPlayers();
        assert (playerOne.getPlayerId().equals(players.get(0).getPlayerId()));
        assert (playerTwo.getPlayerId().equals(players.get(1).getPlayerId()));
    }
}
