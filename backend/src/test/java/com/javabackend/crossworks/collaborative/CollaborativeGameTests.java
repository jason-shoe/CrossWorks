package src.test.java.com.javabackend.crossworks.collaborative;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import src.main.java.com.javabackend.crossworks.collaborative.CollaborativeGame;
import src.main.java.com.javabackend.crossworks.collaborative.CollaborativePlayer;

import java.util.Vector;

@SpringBootTest(classes=CollaborativeGame.class)
class CollaborativeGameTests {

    @Test
    void correctPlayerIds() {
        CollaborativeGame game = new CollaborativeGame();
        CollaborativePlayer playerOne = new CollaborativePlayer();
        CollaborativePlayer playerTwo = new CollaborativePlayer();

        game.addPlayer(playerOne);
        game.addPlayer(playerTwo);

        Vector<String> playerIds = game.getPlayerIds();
        assert(playerOne.getPlayerId().equals(playerIds.get(0)));
        assert(playerTwo.getPlayerId().equals(playerIds.get(1)));
    }
}
