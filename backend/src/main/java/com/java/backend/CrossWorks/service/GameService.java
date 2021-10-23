package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.models.GridCell;

import java.util.UUID;

// GameService is the interface between JPA and the Games
public class GameService {
    public CollaborativeGame createGame(Player player){
        CollaborativeGame game = new CollaborativeGame();

        game.addPlayer(player);
        // TODO: Store this game in JPA storage

        return game;
    }

    // TODO: retrieve gameId from JPA storage
    // public CollaborativeGame connectToGame(CollaborativePlayer player2, String gameId) {
        // return the game retrieved from jpa storage
    // }
}
