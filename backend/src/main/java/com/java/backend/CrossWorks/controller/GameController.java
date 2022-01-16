package com.java.backend.CrossWorks.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import com.java.backend.CrossWorks.CrossWorksApplication;
import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.CompetitiveGame;
import com.java.backend.CrossWorks.collaborative.Game;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.controller.dto.ChatRequest;
import com.java.backend.CrossWorks.controller.dto.CreateGameRequest;
import com.java.backend.CrossWorks.controller.dto.Message;
import com.java.backend.CrossWorks.controller.dto.MoveRequest;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.service.*;
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
        log.info("Retrieving Player ID");

        String playerId = headerAccessor.getSessionAttributes().get("playerId").toString();
        HttpHeaders responseHeaders = HttpUtil.createResponseHeaders("getPlayerId", null);
        playerService.addPlayer(playerId);
        simpMessagingTemplate.convertAndSendToUser(playerId, "/queue/messages",
                ResponseEntity.ok().headers(responseHeaders).body(playerId));
    }

    @MessageMapping("/chat")
    public void chat(@RequestBody ChatRequest request, SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("Sending chat message: {}", request.message);

        String playerId = HttpUtil.getPlayerIdFromHeader(headerAccessor);
        Player player = playerService.getPlayer(playerId);
        String gameId = player.getCurrentGameId();

        if (request.receiver.equals(HttpUtil.GAME) && gameId != null) {
            simpMessagingTemplate.convertAndSend(HttpUtil.getGameEndpoint(gameId),
                    HttpUtil.createResponse(null, "chatMessage",
                            new Message(playerId, HttpUtil.GAME, request.message)));
        } else if (request.receiver.equals(HttpUtil.TEAM) && gameId != null) {
            Game currentGame = gameService.getGame(gameId);
            int teamNumber = ((CompetitiveGame) currentGame).getTeamNumber(player);
            simpMessagingTemplate.convertAndSend(
                    HttpUtil.getTeamEndpoint(gameId, teamNumber));
            HttpUtil.createResponse(null, "chatMessage",
                    new Message(playerId, HttpUtil.GAME, request.message));
        }
    }

    @MessageMapping("/create")
    public void create(@RequestBody CreateGameRequest request,
                       SimpMessageHeaderAccessor headerAccessor) throws InvalidParamException {
        log.info("Creating a game: {}", request.isCollaborative ? "Collaborative" : "Competitive");

        String playerId = HttpUtil.getPlayerIdFromHeader(headerAccessor);
        Player player = playerService.renamePlayer(playerId, request.playerName);
        Game currentGame = gameService.removeAndCreate(player, request.isCollaborative);
        playerService.joinGame(playerId, currentGame.getGameId());

        HttpHeaders responseHeaders =
                HttpUtil.createResponseHeaders("createGame",
                        new Message(player, HttpUtil.GAME, "created the game"));
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
        log.info("Connecting to game: {}", gameId);

        String playerId = HttpUtil.getPlayerIdFromHeader(headerAccessor);
        Player player = playerService.renamePlayer(playerId, playerName);

        HttpHeaders responseHeaders;
        try {
            Game currentGame = gameService.connectToGame(player, gameId);
            if (currentGame.hasPlayer(player)) {
                playerService.joinGame(playerId, currentGame.getGameId());
                responseHeaders = HttpUtil.createResponseHeaders("updateGame",
                        new Message(player, HttpUtil.GAME, "joined the game"));
                return ResponseEntity.ok().headers(responseHeaders).body(currentGame);
            }
            responseHeaders = HttpUtil.createResponseHeaders("gameInProgress",
                    new Message(player, playerId, "tried joining an in progress game"));
        } catch (Exception e) {
            responseHeaders = HttpUtil.createResponseHeaders("badGameId",
                    new Message(player, playerId, "tried joining an invalid game"));
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
                                                    @RequestBody String crosswordId,
                                                    SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("Update Game Crossword: {}", gameId);

        Crossword selectedCrossword = crosswordService.getCrossword(crosswordId);
        Player player = playerService.getPlayer(HttpUtil.getPlayerIdFromHeader(headerAccessor));
        return HttpUtil.createResponse(gameService.setCrossword(selectedCrossword, gameId),
                "updateGame",
                new Message(player, HttpUtil.GAME, "changed the crossword"));
    }

    @MessageMapping("new-team/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> newTeam(@DestinationVariable String gameId,
                                        SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("Created a new Team: {}", gameId);

        Player player = playerService.getPlayer(HttpUtil.getPlayerIdFromHeader(headerAccessor));
        return HttpUtil.createResponse(gameService.newTeam(player, gameId), "updateGame",
                new Message(player, HttpUtil.GAME, "created a new team"));
    }

    @MessageMapping("switch-team/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> switchTeam(@DestinationVariable String gameId,
                                           @RequestBody int teamNumber,
                                           SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("Switch Team: {}", gameId, teamNumber);
        Player player = playerService.getPlayer(HttpUtil.getPlayerIdFromHeader(headerAccessor));
        return HttpUtil.createResponse(gameService.switchTeam(player, teamNumber, gameId),
                "updateGame",
                new Message(player, HttpUtil.GAME, "joined team " + teamNumber));
    }

    @MessageMapping("start-game/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> updateStartGame(@DestinationVariable String gameId,
                                                SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("Start Game: {}", gameId);

        Player player = playerService.getPlayer(HttpUtil.getPlayerIdFromHeader(headerAccessor));
        return HttpUtil.createResponse(gameService.startGame(gameId), "startGame",
                new Message(player, HttpUtil.GAME, "started the game"));
    }

    @MessageMapping("make-move/{gameId}")
    public void makeMove(@DestinationVariable String gameId,
                         @RequestBody MoveRequest request,
                         SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        log.info("Move made {}", request.row, request.col, request.c);

        String playerId = HttpUtil.getPlayerIdFromHeader(headerAccessor);
        Player player = playerService.getPlayer(playerId);
        Game currentGame =
                gameService.makeMove(gameId, player, request.row, request.col, request.c);

        if (currentGame != null) {
            simpMessagingTemplate.convertAndSend(HttpUtil.getGameEndpoint(gameId),
                    HttpUtil.createResponse(currentGame,
                            "updateGame", null));
        }
    }

    @MessageMapping("unpause/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> unpause(@DestinationVariable String gameId,
                                        SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("Unpausing game: {}", gameId);

        String playerId = HttpUtil.getPlayerIdFromHeader(headerAccessor);
        Player player = playerService.getPlayer(playerId);

        return HttpUtil.createResponse(gameService.unpauseGame(gameId), "updateGame",
                new Message(player, HttpUtil.GAME, "unpaused the game"));
    }

    @MessageMapping("pause/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> pause(@DestinationVariable String gameId,
                                      SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("Pausing game: {}", gameId);

        String playerId = HttpUtil.getPlayerIdFromHeader(headerAccessor);
        Player player = playerService.getPlayer(playerId);

        return HttpUtil.createResponse(gameService.pauseGame(gameId), "updateGame",
                new Message(player, HttpUtil.GAME, "paused the game"));
    }

    @MessageMapping("give-up/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> giveUp(@DestinationVariable String gameId,
                                       SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("Giving up game: {}", gameId);

        String playerId = HttpUtil.getPlayerIdFromHeader(headerAccessor);
        Player player = playerService.getPlayer(playerId);
        return HttpUtil.createResponse(gameService.loseGame(gameId), "updateGame",
                new Message(player, HttpUtil.GAME, "forfeited the game"));
    }

    @MessageMapping("return-to-settings/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> returnToSettings(@DestinationVariable String gameId,
                                                 SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("Returned game to settings: {}", gameId);

        String playerId = HttpUtil.getPlayerIdFromHeader(headerAccessor);
        Player player = playerService.getPlayer(playerId);
        return HttpUtil.createResponse(gameService.returnToSettings(gameId), "updateGame",
                new Message(player, HttpUtil.GAME, "returned the party back to settings"));
    }

    @MessageMapping("leave-game/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<Game> leaveGame(@DestinationVariable String gameId,
                                          SimpMessageHeaderAccessor headerAccessor)
            throws InvalidParamException {
        log.info("Leaving game: {}", gameId);

        Player player = playerService.getPlayer(HttpUtil.getPlayerIdFromHeader(headerAccessor));
        Game game = gameService.leaveGame(gameId, player);
        playerService.leaveGame(player.getPlayerId());

        return HttpUtil.createResponse(game, "updateGame",
                new Message(player, HttpUtil.GAME, "left the game"));
    }

    @MessageMapping("send-team-answers/{gameId}")
    public void sendTeamAnswers(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("Sending team answer: {}", gameId);

        gameService.sendTeamAnswers(gameId, simpMessagingTemplate);

    }
}
