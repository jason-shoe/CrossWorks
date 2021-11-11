package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.GridCell;
import com.java.backend.CrossWorks.storage.CollaborativeGameStorage;
import com.java.backend.CrossWorks.storage.CrosswordStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.Optional;
import java.util.UUID;

// GameService is the interface between JPA and the Games
@Service
@Configurable
public class CollaborativeGameService {
    @Autowired
    private CollaborativeGameStorage repo;

    public CollaborativeGame createGame(Player player){
        CollaborativeGame game = new CollaborativeGame();
        game.addPlayer(player);

        repo.save(game);
        return game;
    }

    public CollaborativeGame findPlayersGame(Player player) {
        Iterator<CollaborativeGame> gamesIterator = repo.findAll().iterator();
        while (gamesIterator.hasNext()) {
            CollaborativeGame currentGame = gamesIterator.next();
            if (currentGame.hasPlayer(player)) {
                return currentGame;
            }
        }
        return createGame(player);
    }

    public CollaborativeGame connectToGame(Player newPlayer, String gameId) throws InvalidParamException {
        Optional<CollaborativeGame> val = repo.findById(gameId);
        if (val.isPresent()) {
            CollaborativeGame currentGame = val.get();
            currentGame.addPlayer(newPlayer);
            repo.save(currentGame);

            return currentGame;

        }
        throw new InvalidParamException("Game ID doesn't exist in connectToGame");
    }

    // TODO: retrieve gameId from JPA storage
    // public CollaborativeGame connectToGame(CollaborativePlayer player2, String gameId) {
        // return the game retrieved from jpa storage
    // }
}
