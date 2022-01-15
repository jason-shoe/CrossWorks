package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.CrossWorksApplication;
import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.CompetitiveGame;
import com.java.backend.CrossWorks.collaborative.Game;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.models.GameStatus;
import com.java.backend.CrossWorks.storage.GameStorage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.Optional;
import java.util.Vector;
import java.util.function.Consumer;

// GameService is the interface between JPA and the Games
@Service
@Configurable
public class GameService {
    private static final Logger log = LoggerFactory.getLogger(CrossWorksApplication.class);
    @Autowired
    private GameStorage repo;

    public Vector<Game> getAllGames() {
        Vector<Game> games = new Vector();
        Iterable<Game> allGames = repo.findAll();
        allGames.forEach(new Consumer<Game>() {
            @Override
            public void accept(Game game) {
                games.add(game);
            }
        });
        return games;
    }

    public void deleteAllGames() {
        repo.deleteAll();
    }

    public Game createGame(Player player, boolean isCollaborative) {
        log.info("Creating Competitive Game: {}", player.getPlayerId());
        Game game;
        if (isCollaborative) {
            game = new CollaborativeGame();
        } else {
            game = new CompetitiveGame();
        }

        game.addPlayer(player);

        repo.save(game);
        return game;
    }

    public Game removeAndCreate(Player player, boolean isCollaborative) {
        // TODO: improve this using data regarding a players last game
        Iterator<Game> gamesIterator = repo.findAll().iterator();
        while (gamesIterator.hasNext()) {
            Game currentGame = gamesIterator.next();
            // deletes user from all other games it was in
            if (currentGame.hasPlayer(player)) {
                currentGame.removePlayer(player);
                if (!currentGame.hasPlayers()) {
                    repo.delete(currentGame);
                }
            }
        }
        return createGame(player, isCollaborative);
    }

    public Game performAction(Consumer<Game> action, String gameId,
                              String errorMsg) throws InvalidParamException {
        Optional<Game> val = repo.findById(gameId);
        if (val.isPresent()) {
            Game currentGame = val.get();
            action.accept(currentGame);
            repo.save(currentGame);
            return currentGame;
        }
        throw new InvalidParamException(errorMsg);

    }

    public Game connectToGame(Player newPlayer, String gameId)
            throws InvalidParamException {
        Consumer<Game> action = (game) -> {
            game.addPlayer(newPlayer);
        };
        return performAction(action, gameId, "Game ID doesn't exist in connectToGame");
    }

    public Game setCrossword(Crossword crossword, String gameId)
            throws InvalidParamException {
        Consumer<Game> action = (game) -> {
            game.setCrossword(crossword);
        };
        return performAction(action, gameId, "Game ID doesn't exist in setCrossword");
    }

    public Game newTeam(Player newPlayer, String gameId)
            throws InvalidParamException {
        Consumer<Game> action = (game) -> {
            ((CompetitiveGame) game).newTeam(newPlayer);
        };
        return performAction(action, gameId, "Game ID doesn't exist in newTeam");
    }

    public Game switchTeam(Player newPlayer, int teamNumber, String gameId)
            throws InvalidParamException {
        Consumer<Game> action = (game) -> {
            System.out.println("This is the game id: " + game.getGameId());
            System.out.println("this is the data: " + teamNumber);
            ((CompetitiveGame) game).switchTeam(newPlayer, teamNumber);
        };
        return performAction(action, gameId, "Game ID doesn't exist in connectToGame");
    }

    public Game startGame(String gameId) throws InvalidParamException {
        Consumer<Game> action = (game) -> {
            game.startGame();
        };
        return performAction(action, gameId, "Game ID doesn't exist in startGame");
    }

    public Game unpauseGame(String gameId) throws InvalidParamException {
        Consumer<Game> action = (game) -> {
            if (game.getStatus() == GameStatus.PAUSED || game.getStatus() == GameStatus.INCORRECT) {
                game.unpauseGame();
            }
        };
        return performAction(action, gameId, "Game ID doesn't exist in unpauseGame");
    }

    public Game pauseGame(String gameId) throws InvalidParamException {
        Consumer<Game> action = (game) -> {
            if (game.getStatus() == GameStatus.STARTED) {
                game.pauseGame();
            }
        };
        return performAction(action, gameId, "Game ID doesn't exist in pauseGame");
    }

    public Game loseGame(String gameId) throws InvalidParamException {
        Consumer<Game> action = (game) -> {
            if (game.getStatus() == GameStatus.STARTED) {
                game.loseGame();
            }
        };
        return performAction(action, gameId, "Game ID doesn't exist in loseGame");
    }

    public Game returnToSettings(String gameId) throws InvalidParamException {
        Consumer<Game> action = (game) -> {
            game.returnToSettings();
        };
        return performAction(action, gameId, "Game ID doesn't exist in returnToSettings");
    }


    public Game leaveGame(String gameId, Player player) throws InvalidParamException {
        Optional<Game> val = repo.findById(gameId);
        if (val.isPresent()) {
            Game currentGame = val.get();
            currentGame.removePlayer(player);
            repo.save(currentGame);
            if (!currentGame.hasPlayers()) {
                System.out.println("deleting this game " + gameId);
                repo.deleteById(gameId);
                return null;
            }
            return currentGame;
        }
        throw new InvalidParamException("Game ID doesn't exist in leaveGame");

    }


    public Game makeMove(String gameId, Player player, int row, int col, char c)
            throws Exception {
        Optional<Game> val = repo.findById(gameId);
        if (val.isPresent()) {
            Game currentGame = val.get();
            currentGame.makeMove(player, row, col, c);
            repo.save(currentGame);

            return currentGame;
        }

        throw new InvalidParamException("Game ID doesn't exist in setCrossword");
    }

    public void sendTeamAnswers(String gameId, SimpMessagingTemplate simpMessagingTemplate)
            throws InvalidParamException {
        Optional<Game> val = repo.findById(gameId);
        if (val.isPresent()) {
            Game currentGame = val.get();
            currentGame.sendTeamAnswers(simpMessagingTemplate);
            return;
        }

        throw new InvalidParamException("Game ID doesn't exist in sendTeamAnswers");
    }
}

