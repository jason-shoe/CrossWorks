package com.java.backend.CrossWorks.collaborative;

import java.util.Vector;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CollaborativeGameTests {

    @Test
    void correctPlayerIds() {
        CollaborativeGame game = new CollaborativeGame();
        Player playerOne = new Player("sessionTwo");
        Player playerTwo = new Player("sessionOne");

        game.addPlayer(playerOne);
        game.addPlayer(playerTwo);

        Vector<String> playerIds = game.getPlayerIds();
        assert(playerOne.getPlayerId().equals(playerIds.get(0)));
        assert(playerTwo.getPlayerId().equals(playerIds.get(1)));
    }
}
