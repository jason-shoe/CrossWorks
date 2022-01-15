package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.storage.PlayerStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Vector;
import java.util.function.Consumer;

@Service
@Configurable
public class PlayerService {
    @Autowired
    private PlayerStorage playerRepo;

    public Vector<Player> getAllGames() {
        Vector<Player> players = new Vector();
        Iterable<Player> allPlayers = playerRepo.findAll();
        allPlayers.forEach(new Consumer<Player>() {
            @Override
            public void accept(Player player) {
                players.add(player);
            }
        });
        return players;
    }

    public Player performAction(Consumer<Player> action, String gameId,
                                String errorMsg) throws InvalidParamException {
        Optional<Player> val = playerRepo.findById(gameId);
        if (val.isPresent()) {
            Player currentPlayer = val.get();
            action.accept(currentPlayer);
            playerRepo.save(currentPlayer);
            System.out.println("saved player in repo");
            return currentPlayer;
        }
        throw new InvalidParamException(errorMsg);

    }

    public Player getPlayer(String playerId) throws InvalidParamException {
        Optional<Player> val = playerRepo.findById(playerId);
        if (val.isPresent()) {
            return val.get();
        }
        throw new InvalidParamException("Player ID doesn't exist in getPlayer");
    }

    public Player renamePlayer(String playerId, String playerName) throws InvalidParamException {
        Consumer<Player> action = (player) -> {
            player.setPlayerName(playerName);
        };
        return performAction(action, playerId, "Player ID doesn't exist in renamePlayer");
    }

    public Player addPlayer(String playerId) {
        Player newPlayer = new Player(playerId);
        playerRepo.save(newPlayer);
        return newPlayer;
    }

    public Player joinGame(String playerId, String gameId) throws InvalidParamException {
        Consumer<Player> action = (player) -> {
            player.setCurrentGameId(gameId);
        };
        return performAction(action, playerId, "Player ID doesn't exist in joinGame");
    }

}
