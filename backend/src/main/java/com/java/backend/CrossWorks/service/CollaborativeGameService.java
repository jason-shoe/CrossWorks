package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.models.GameStatus;
import com.java.backend.CrossWorks.storage.CollaborativeGameStorage;
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
public class CollaborativeGameService {
    @Autowired
    private CollaborativeGameStorage repo;

    public Vector<CollaborativeGame> getAllGames() {
        Vector<CollaborativeGame> games = new Vector();
        Iterable<CollaborativeGame> allGames = repo.findAll();
        allGames.forEach(new Consumer<CollaborativeGame>() {
            @Override
            public void accept(CollaborativeGame game) {
                games.add(game);
            }
        });
        return games;
    }

    public void deleteAllGames() {
        repo.deleteAll();
    }

    public CollaborativeGame createGame(Player player) {
        CollaborativeGame game = new CollaborativeGame();
        game.addPlayer(player);

        repo.save(game);
        return game;
    }

    public CollaborativeGame removeAndCreate(Player player) {
        Iterator<CollaborativeGame> gamesIterator = repo.findAll().iterator();
        while (gamesIterator.hasNext()) {
            CollaborativeGame currentGame = gamesIterator.next();
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

    public CollaborativeGame performAction(Consumer<CollaborativeGame> action, String gameId,
                                           String errorMsg) throws InvalidParamException {
        Optional<CollaborativeGame> val = repo.findById(gameId);
        if (val.isPresent()) {
            CollaborativeGame currentGame = val.get();
            action.accept(currentGame);
            repo.save(currentGame);
            return currentGame;
        }
        throw new InvalidParamException(errorMsg);

    }

    public CollaborativeGame connectToGame(Player newPlayer, String gameId)
            throws InvalidParamException {
        Consumer<CollaborativeGame> action = (game) -> {
            game.addPlayer(newPlayer);
        };
        return performAction(action, gameId, "Game ID doesn't exist in connectToGame");
    }

    public CollaborativeGame setCrossword(Crossword crossword, String gameId)
            throws InvalidParamException {
        Consumer<CollaborativeGame> action = (game) -> {
            game.setCrossword(crossword);
        };
        return performAction(action, gameId, "Game ID doesn't exist in setCrossword");
    }

    public CollaborativeGame startGame(String gameId) throws InvalidParamException {
        Consumer<CollaborativeGame> action = (game) -> {
            game.startGame();
        };
        return performAction(action, gameId, "Game ID doesn't exist in startGame");
    }

    public CollaborativeGame unpauseGame(String gameId) throws InvalidParamException {
        Consumer<CollaborativeGame> action = (game) -> {
            if (game.getStatus() == GameStatus.PAUSED || game.getStatus() == GameStatus.INCORRECT) {
                game.unpauseGame();
            }
        };
        return performAction(action, gameId, "Game ID doesn't exist in unpauseGame");
    }

    public CollaborativeGame pauseGame(String gameId) throws InvalidParamException {
        Consumer<CollaborativeGame> action = (game) -> {
            if (game.getStatus() == GameStatus.STARTED) {
                game.pauseGame();
            }
        };
        return performAction(action, gameId, "Game ID doesn't exist in pauseGame");
    }

    public CollaborativeGame loseGame(String gameId) throws InvalidParamException {
        Consumer<CollaborativeGame> action = (game) -> {
            if (game.getStatus() == GameStatus.STARTED) {
                game.loseGame();
            }
        };
        return performAction(action, gameId, "Game ID doesn't exist in loseGame");
    }

    public CollaborativeGame returnToSettings(String gameId) throws InvalidParamException {
        Consumer<CollaborativeGame> action = (game) -> {
            game.returnToSettings();
        };
        return performAction(action, gameId, "Game ID doesn't exist in returnToSettings");
    }


    public CollaborativeGame leaveGame(String gameId, Player player) throws InvalidParamException {
        Consumer<CollaborativeGame> action = (game) -> {
            game.removePlayer(player);
            if (!game.hasPlayers()) {
                System.out.println("deleting this game" + gameId);
                repo.deleteGames(gameId);
            }
        };
        return performAction(action, gameId, "Game ID doesn't exist in leaveGame");
    }


    public CollaborativeGame makeMove(String gameId, int row, int col, char c) throws Exception {
        Optional<CollaborativeGame> val = repo.findById(gameId);
        if (val.isPresent()) {
            CollaborativeGame currentGame = val.get();
            currentGame.makeMove(row, col, c);
            repo.save(currentGame);

            return currentGame;
        }

        throw new InvalidParamException("Game ID doesn't exist in setCrossword");
    }
}
