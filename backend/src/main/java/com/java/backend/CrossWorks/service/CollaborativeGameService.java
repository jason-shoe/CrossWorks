package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.models.GridCell;
import com.java.backend.CrossWorks.storage.CollaborativeGameStorage;
import com.java.backend.CrossWorks.storage.CrosswordStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Service;

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

    // TODO: retrieve gameId from JPA storage
    // public CollaborativeGame connectToGame(CollaborativePlayer player2, String gameId) {
        // return the game retrieved from jpa storage
    // }
}
