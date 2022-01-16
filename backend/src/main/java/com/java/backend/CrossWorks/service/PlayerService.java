package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.collaborative.Game;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.controller.dto.Message;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.storage.PlayerStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Vector;
import java.util.function.Consumer;

@Service
@Configurable
public class PlayerService {
    @Autowired
    private PlayerStorage playerRepo;

    @Autowired
    private GameService gameService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

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

    public void removePlayer(String playerId) throws InvalidParamException {
        // TODO: also remove the player from their game;
        Optional<Player> val = playerRepo.findById(playerId);
        if (val.isPresent()) {
            Player currentPlayer = val.get();
            if (currentPlayer.getCurrentGameId() != null) {
                Game gameLeft =
                        gameService.leaveGame(currentPlayer.getCurrentGameId(), currentPlayer);
                if (gameLeft != null) {
                    simpMessagingTemplate.convertAndSend(
                            "queue/game/" + gameLeft.getGameId(),
                            HttpUtil.createResponse(gameLeft, "updateGame",
                                    new Message(currentPlayer, HttpUtil.GAME, "left the game")));
                }
            }
            playerRepo.deleteById(playerId);
            return;
        }
        throw new InvalidParamException("Player ID doesn't exist in removePlayer");
    }

    public Player joinGame(String playerId, String gameId) throws InvalidParamException {
        Consumer<Player> action = (player) -> {
            player.setCurrentGameId(gameId);
        };
        return performAction(action, playerId, "Player ID doesn't exist in joinGame");
    }

    public Player leaveGame(String playerId) throws InvalidParamException {
        Consumer<Player> action = (player) -> {
            player.setCurrentGameId(null);
        };
        return performAction(action, playerId, "Player ID doesn't exist in joinGame");
    }


}
