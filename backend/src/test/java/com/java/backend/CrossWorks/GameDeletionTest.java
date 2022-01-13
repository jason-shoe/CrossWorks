package com.java.backend.CrossWorks;

import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.service.CollaborativeGameService;
import com.java.backend.CrossWorks.service.CrosswordService;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class GameDeletionTest {
    private static final Logger log = LoggerFactory.getLogger(CrossWorksApplication.class);
    @Autowired
    private CollaborativeGameService gameService;
    @Autowired
    private CrosswordService crosswordService;

    @Test
    public void deletionWorks() throws InvalidParamException {
        System.out.println("Starting test");
        log.info("Starting Test");
        Player player = new Player("testPlayer");
        log.info("Creating Player: {}", player.getPlayerId());
        CollaborativeGame game = gameService.createGame(player);
        log.info("Creating Game: {}", game.getGameId());
        Crossword crossword = crosswordService.getFirst();
        log.info("Retrieved Crossword: {}", crossword.getCrosswordId());
        gameService.setCrossword(crossword, game.getGameId());
        log.info("Set Crossword");

        gameService.startGame(game.getGameId());
        log.info("Started Game");
        gameService.leaveGame(game.getGameId(), player);
        log.info("Left Game");

        assert (0 == gameService.getAllGames().size());
        assert (3 == gameService.getAllGames().size());
        assert (0 == 1);
        log.info("Finished Assertions");


    }
}
