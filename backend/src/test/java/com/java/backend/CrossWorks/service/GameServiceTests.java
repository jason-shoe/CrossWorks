package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.CrossWorksApplication;
import com.java.backend.CrossWorks.collaborative.Game;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.Crossword;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {CrossWorksApplication.class})
class GameServiceTests {

    @Autowired
    GameService gameService;

    @Autowired
    PlayerService playerService;

    @Autowired
    CrosswordService crosswordService;

    @Test
    void crosswordIsNotNull() {
        assertThat(gameService).isNotNull();
    }

    @Test
    void deleteGameTest() throws InvalidParamException {
        Player player = playerService.addPlayer("Jason");
        Game game = gameService.createGame(player, true);
        assertThat(gameService.getAllGames().size()).isEqualTo(1);
        assertThat(game.hasPlayer(player)).isTrue();
        assertThat(game.getCrossword()).isNull();

        // adding crossword
        Crossword crossword = crosswordService.getFirst();
        game = gameService.setCrossword(crossword, game.getGameId());
        assertThat(game.getCrossword()).isNotNull();

        // leaving the game
        game = gameService.leaveGame(game.getGameId(), player);
        assertThat(gameService.getAllGames().size()).isEqualTo(0);
        assertThat(crosswordService.getDates().size()).isEqualTo(3);
    }
}
