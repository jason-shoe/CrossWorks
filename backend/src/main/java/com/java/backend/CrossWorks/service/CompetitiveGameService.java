package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.CrossWorksApplication;
import com.java.backend.CrossWorks.collaborative.CompetitiveGame;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.models.GameStatus;
import com.java.backend.CrossWorks.storage.CompetitiveGameStorage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.Optional;
import java.util.Vector;
import java.util.function.Consumer;

// GameService is the interface between JPA and the Games
@Service
@Configurable
public class CompetitiveGameService {
    private static final Logger log = LoggerFactory.getLogger(CrossWorksApplication.class);
    @Autowired
    private CompetitiveGameStorage repo;

    public Vector<CompetitiveGame> getAllGames() {
        Vector<CompetitiveGame> games = new Vector();
        Iterable<CompetitiveGame> allGames = repo.findAll();
        allGames.forEach(new Consumer<CompetitiveGame>() {
            @Override
            public void accept(CompetitiveGame game) {
                games.add(game);
            }
        });
        return games;
    }

    public void deleteAllGames() {
        repo.deleteAll();
    }

    public CompetitiveGame createGame(Player player) {
        log.info("Creating Competitive Game: {}", player.getPlayerId());
        CompetitiveGame game = new CompetitiveGame();
        game.addPlayer(player);

        repo.save(game);
        return game;
    }

    public CompetitiveGame removeAndCreate(Player player) {
        Iterator<CompetitiveGame> gamesIterator = repo.findAll().iterator();
        while (gamesIterator.hasNext()) {
            CompetitiveGame currentGame = gamesIterator.next();
            // deletes user from all other games it was in
            if (currentGame.hasPlayer(player)) {
                currentGame.removePlayer(player);
                if (!currentGame.hasPlayers()) {
                    repo.delete(currentGame);
                }
            }
        }
        return createGame(player);
    }

    public CompetitiveGame performAction(Consumer<CompetitiveGame> action, String gameId,
                                         String errorMsg) throws InvalidParamException {
        Optional<CompetitiveGame> val = repo.findById(gameId);
        if (val.isPresent()) {
            CompetitiveGame currentGame = val.get();
            action.accept(currentGame);
            repo.save(currentGame);
            return currentGame;
        }
        throw new InvalidParamException(errorMsg);

    }

    public CompetitiveGame connectToGame(Player newPlayer, String gameId)
            throws InvalidParamException {
        Consumer<CompetitiveGame> action = (game) -> {
            game.addPlayer(newPlayer);
        };
        return performAction(action, gameId, "Game ID doesn't exist in connectToGame");
    }

    public CompetitiveGame setCrossword(Crossword crossword, String gameId)
            throws InvalidParamException {
        Consumer<CompetitiveGame> action = (game) -> {
            game.setCrossword(crossword);
        };
        return performAction(action, gameId, "Game ID doesn't exist in setCrossword");
    }

    public CompetitiveGame newTeam(Player newPlayer, String gameId)
            throws InvalidParamException {
        Consumer<CompetitiveGame> action = (game) -> {
            game.newTeam(newPlayer);
        };
        return performAction(action, gameId, "Game ID doesn't exist in newTeam");
    }

    public CompetitiveGame switchTeam(Player newPlayer, int teamNumber, String gameId)
            throws InvalidParamException {
        Consumer<CompetitiveGame> action = (game) -> {
            game.switchTeam(newPlayer, teamNumber);
        };
        return performAction(action, gameId, "Game ID doesn't exist in connectToGame");
    }

    public CompetitiveGame startGame(String gameId) throws InvalidParamException {
        Consumer<CompetitiveGame> action = (game) -> {
            game.startGame();
        };
        return performAction(action, gameId, "Game ID doesn't exist in startGame");
    }

    public CompetitiveGame unpauseGame(String gameId) throws InvalidParamException {
        Consumer<CompetitiveGame> action = (game) -> {
            if (game.getStatus() == GameStatus.PAUSED || game.getStatus() == GameStatus.INCORRECT) {
                game.unpauseGame();
            }
        };
        return performAction(action, gameId, "Game ID doesn't exist in unpauseGame");
    }

    public CompetitiveGame pauseGame(String gameId) throws InvalidParamException {
        Consumer<CompetitiveGame> action = (game) -> {
            if (game.getStatus() == GameStatus.STARTED) {
                game.pauseGame();
            }
        };
        return performAction(action, gameId, "Game ID doesn't exist in pauseGame");
    }

    public CompetitiveGame loseGame(String gameId) throws InvalidParamException {
        Consumer<CompetitiveGame> action = (game) -> {
            if (game.getStatus() == GameStatus.STARTED) {
                game.loseGame();
            }
        };
        return performAction(action, gameId, "Game ID doesn't exist in loseGame");
    }

    public CompetitiveGame returnToSettings(String gameId) throws InvalidParamException {
        Consumer<CompetitiveGame> action = (game) -> {
            game.returnToSettings();
        };
        return performAction(action, gameId, "Game ID doesn't exist in returnToSettings");
    }


    public CompetitiveGame leaveGame(String gameId, Player player) throws InvalidParamException {
        Consumer<CompetitiveGame> action = (game) -> {
            game.removePlayer(player);
            if (!game.hasPlayers()) {
                System.out.println("deleting this game " + gameId);
//                game.detach();
//                Optional<CompetitiveGame> val = repo.findById(gameId);
//                if (val.isPresent()) {
//                    CompetitiveGame currentGame = val.get();
//                    log.info("this is the game {}", currentGame.getGameId());
//                }
////                repo.deleteById(gameId);
//                repo.save(game);
                repo.delete(game);
//                repo.deleteByGameId(gameId);
            }
        };
        return performAction(action, gameId, "Game ID doesn't exist in leaveGame");
    }


    public CompetitiveGame makeMove(String gameId, Player player, int row, int col, char c)
            throws Exception {
        Optional<CompetitiveGame> val = repo.findById(gameId);
        if (val.isPresent()) {
            CompetitiveGame currentGame = val.get();
            currentGame.makeMove(player, row, col, c);
            repo.save(currentGame);

            return currentGame;
        }

        throw new InvalidParamException("Game ID doesn't exist in setCrossword");
    }
}
