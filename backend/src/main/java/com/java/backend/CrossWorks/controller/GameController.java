package com.java.backend.CrossWorks.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import com.java.backend.CrossWorks.CrossWorksApplication;
import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.Game;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.controller.dto.CreateGameRequest;
import com.java.backend.CrossWorks.controller.dto.MoveRequest;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.service.CrosswordService;
import com.java.backend.CrossWorks.service.GameService;
import com.java.backend.CrossWorks.service.PlayerService;
import com.java.backend.CrossWorks.service.Views;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Vector;

@RestController
@CrossOrigin
@RequestMapping("/game")
public class GameController {
    private static final Logger log = LoggerFactory.getLogger(CrossWorksApplication.class);
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private GameService gameService;
    @Autowired
    private CrosswordService crosswordService;
    @Autowired
    private PlayerService playerService;

    public GameController() {
    }

    private String getPlayerIdFromHeader(SimpMessageHeaderAccessor headerAccessor) {
        String playerId = headerAccessor.getSessionAttributes().get("playerId").toString();
        return playerId;
    }

    public ResponseEntity<Game> createResponse(Game currentGame,
                                               String type) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", type);
        return ResponseEntity.ok().headers(responseHeaders).body(currentGame);
    }

    @GetMapping("/sample-crossword")
    @ResponseBody
    @JsonIgnoreProperties("answers")
    public Crossword sampleCrossword() {
        return crosswordService.getFirst();
    }

    @GetMapping("/dates")
    @ResponseBody
    @JsonView(Views.CrosswordIdDateView.class)
    public Vector<Crossword> getAllDates() {
        return crosswordService.getDates();
    }

    @GetMapping("/games")
    @ResponseBody
    public Vector<Game> getAllGames() {
        return gameService.getAllGames();
    }

    @GetMapping("/players")
    @ResponseBody
    public Vector<Player> getAllPlayers() {
        return playerService.getAllGames();
    }

    @DeleteMapping("/delete-games")
    public void deleteAllGames() {
        gameService.deleteAllGames();
    }

    @MessageMapping("/get-player-id")
    public void hello(SimpMessageHeaderAccessor headerAccessor) {
        String playerId = headerAccessor.getSessionAttributes().get("playerId").toString();
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add("type", "getPlayerId");
        playerService.addPlayer(playerId);
        simpMessagingTemplate.convertAndSendToUser(playerId, "/queue/messages",
                ResponseEntity.ok().headers(responseHeaders).body(playerId));
    }

    @MessageMapping("/create")
    public void create(@RequestBody CreateGameRequest request,
                       SimpMessageHeaderAccessor headerAccessor) throws InvalidParamException {
        log.info("Creating collaborative game");
        String playerId = getPlayerIdFromHeader(headerAccessor);
        Player player = playerService.renamePlayer(playerId, request.playerName);
        Game currentGame = gameService.removeAndCreate(player, request.isCollaborative);
        playerService.joinGame(playerId, currentGame.getGameId());

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "createGame");
        simpMessagingTemplate.convertAndSendToUser(player.getPlayerId(), "/queue/messages",
                ResponseEntity.ok().headers(responseHeaders)
                        .body(currentGame));
    }

    @MessageMapping("connect/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> connect(@DestinationVariable String gameId,
                                        @RequestBody String playerName,
                                        SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("connect request: {}", gameId);
        String playerId = getPlayerIdFromHeader(headerAccessor);
        Player player = playerService.renamePlayer(playerId, playerName);

        HttpHeaders responseHeaders = new HttpHeaders();
        try {
            Game currentGame = gameService.connectToGame(player, gameId);
            if (currentGame.hasPlayer(player)) {
                playerService.joinGame(playerId, currentGame.getGameId());
                responseHeaders.set("type", "updateGame");
                return ResponseEntity.ok().headers(responseHeaders).body(currentGame);
            }
            responseHeaders.set("type", "gameInProgress");
        } catch (Exception e) {
            responseHeaders.set("type", "badGameId");
        }
        ResponseEntity<CollaborativeGame> body =
                ResponseEntity.badRequest().headers(responseHeaders).body(null);
        simpMessagingTemplate.convertAndSendToUser(player.getPlayerId(), "/queue/messages",
                body);
        throw new InvalidParamException("Game ID doesn't exist in connect or game is in progress");
    }

    @MessageMapping("set-game-crossword/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> updateGameCrossword(@DestinationVariable String gameId,
                                                    @RequestBody String crosswordId)
            throws InvalidParamException {
        log.info("Update Game Crossword: {}", gameId, crosswordId);
        Crossword selectedCrossword = crosswordService.getCrossword(crosswordId);
        return createResponse(gameService.setCrossword(selectedCrossword, gameId), "updateGame");
    }

    @MessageMapping("new-team/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> newTeam(@DestinationVariable String gameId,
                                        SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("New Team: {}", gameId);
        Player player = playerService.getPlayer(getPlayerIdFromHeader(headerAccessor));
        return createResponse(gameService.newTeam(player, gameId), "updateGame");
    }

    @MessageMapping("switch-team/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> switchTeam(@DestinationVariable String gameId,
                                           @RequestBody int teamNumber,
                                           SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("Switch Team: {}", gameId, teamNumber);
        Player player = playerService.getPlayer(getPlayerIdFromHeader(headerAccessor));
        return createResponse(gameService.switchTeam(player, teamNumber, gameId),
                "updateGame");
    }

    @MessageMapping("start-game/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> updateStartGame(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("Start Game Crossword: {}", gameId);
        return createResponse(gameService.startGame(gameId), "startGame");
    }

    @MessageMapping("make-move/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> makeMove(@DestinationVariable String gameId,
                                         @RequestBody MoveRequest request,
                                         SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        log.info("Make move: {}", request.row, request.col, request.c);
        String playerId = getPlayerIdFromHeader(headerAccessor);
        Player player = playerService.getPlayer(playerId);
        return createResponse(
                gameService.makeMove(gameId, player, request.row, request.col, request.c),
                "updateGame");
    }

    @MessageMapping("unpause/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> unpause(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("Unpausing game: {}", gameId);
        return createResponse(gameService.unpauseGame(gameId), "updateGame");
    }

    @MessageMapping("pause/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> pause(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("Pausing game: {}", gameId);
        return createResponse(gameService.pauseGame(gameId), "updateGame");
    }

    @MessageMapping("give-up/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> giveUp(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("giving up: {}", gameId);
        return createResponse(gameService.loseGame(gameId), "updateGame");
    }

    @MessageMapping("return-to-settings/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> returnToSettings(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("returning to settings: {}", gameId);
        return createResponse(gameService.returnToSettings(gameId), "updateGame");
    }

    @MessageMapping("leave-game/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> leaveGame(@DestinationVariable String gameId,
                                          SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("leaving game : {}", gameId);
        Player player = playerService.getPlayer(getPlayerIdFromHeader(headerAccessor));
        return createResponse(gameService.leaveGame(gameId, player), "updateGame");
    }

    @MessageMapping("send-team-answers/{gameId}")
    public void sendTeamAnswers(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("sending team answer: {}", gameId);
        gameService.sendTeamAnswers(gameId, simpMessagingTemplate);

    }
}
