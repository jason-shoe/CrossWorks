package src.main.java.com.javabackend.crossworks.service;

import src.main.java.com.javabackend.crossworks.collaborative.CollaborativeGame;
import src.main.java.com.javabackend.crossworks.collaborative.CollaborativePlayer;

public class GameService {
    public CollaborativeGame createGame(CollaborativePlayer player){
        CollaborativeGame game = new CollaborativeGame();
        return game;
    }

}
