package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.CollaborativePlayer;

public class GameService {
    public CollaborativeGame createGame(CollaborativePlayer player){
        CollaborativeGame game = new CollaborativeGame();
        return game;
    }
}
