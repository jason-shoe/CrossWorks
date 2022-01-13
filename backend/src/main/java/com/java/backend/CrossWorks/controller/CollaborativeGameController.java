package com.java.backend.CrossWorks.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import com.java.backend.CrossWorks.CrossWorksApplication;
import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.controller.dto.MoveRequest;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.service.CollaborativeGameService;
import com.java.backend.CrossWorks.service.CrosswordService;
import com.java.backend.CrossWorks.service.Views;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Vector;

@RestController
@CrossOrigin
@RequestMapping("/collaborative-game")
public class CollaborativeGameController {
    private static final Logger log = LoggerFactory.getLogger(CrossWorksApplication.class);
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private CollaborativeGameService gameService;
    @Autowired
    private CrosswordService crosswordService;

    public CollaborativeGameController() {
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
    public Vector<CollaborativeGame> getAllGames() {
        return gameService.getAllGames();
    }

    @DeleteMapping("/delete-games")
    public void deleteAllGames() {
        gameService.deleteAllGames();
    }

    @MessageMapping("/create")
    public void create(@RequestBody Player player) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "createGame");
        simpMessagingTemplate.convertAndSendToUser(player.getPlayerId(), "/queue/messages",
                ResponseEntity.ok().headers(responseHeaders)
                        .body(gameService.removeAndCreate(player)));
    }

    @MessageMapping("connect/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<CollaborativeGame> connect(@DestinationVariable String gameId,
                                                     @RequestBody Player player)
            throws InvalidParamException {
        log.info("connect request: {}", gameId, player);
        HttpHeaders responseHeaders = new HttpHeaders();
        try {
            CollaborativeGame currentGame = gameService.connectToGame(player, gameId);
            responseHeaders.set("type", "updateGame");
            return ResponseEntity.ok().headers(responseHeaders).body(currentGame);
        } catch (Exception e) {
            responseHeaders.set("type", "badGameId");
            ResponseEntity<CollaborativeGame> body =
                    ResponseEntity.badRequest().headers(responseHeaders).body(null);
            simpMessagingTemplate.convertAndSendToUser(player.getPlayerId(), "/queue/messages",
                    body);
            throw new InvalidParamException("Game ID doesn't exist in setCrossword - Controller");
        }
    }

    @MessageMapping("update/game-crossword/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<CollaborativeGame> updateGameCrossword(@DestinationVariable String gameId,
                                                                 @RequestBody String crosswordId)
            throws InvalidParamException {
        log.info("Update Game Crossword: {}", gameId, crosswordId);
        Crossword selectedCrossword = crosswordService.getCrossword(crosswordId);
        CollaborativeGame currentGame = gameService.setCrossword(selectedCrossword, gameId);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "updateGame");
        return ResponseEntity.ok().headers(responseHeaders).body(currentGame);
    }

    @MessageMapping("update/start-game/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<CollaborativeGame> updateStartGame(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("Start Game Crossword: {}", gameId);
        CollaborativeGame currentGame = gameService.startGame(gameId);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "startGame");
        return ResponseEntity.ok().headers(responseHeaders).body(currentGame);
    }

    @MessageMapping("update/make-move/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<CollaborativeGame> makeMove(@DestinationVariable String gameId,
                                                      @RequestBody MoveRequest request)
            throws Exception {
        log.info("Make move: {}", request.row, request.col, request.c);
        CollaborativeGame currentGame =
                gameService.makeMove(gameId, request.row, request.col, request.c);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "updateGame");
        return ResponseEntity.ok().headers(responseHeaders).body(currentGame);
    }

    @MessageMapping("update/unpause/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<CollaborativeGame> unpause(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("Unpausing game: {}", gameId);
        CollaborativeGame currentGame = gameService.unpauseGame(gameId);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "updateGame");
        return ResponseEntity.ok().headers(responseHeaders).body(currentGame);

    }

    @MessageMapping("update/pause/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<CollaborativeGame> pause(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("Pausing game: {}", gameId);
        CollaborativeGame currentGame = gameService.pauseGame(gameId);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "updateGame");
        return ResponseEntity.ok().headers(responseHeaders).body(currentGame);

    }

    @MessageMapping("update/give-up/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<CollaborativeGame> giveUp(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("giving up: {}", gameId);
        CollaborativeGame currentGame = gameService.loseGame(gameId);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "updateGame");
        return ResponseEntity.ok().headers(responseHeaders).body(currentGame);
    }

    @MessageMapping("update/return-to-settings/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<CollaborativeGame> returnToSettings(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("returning to settings: {}", gameId);
        CollaborativeGame currentGame = gameService.returnToSettings(gameId);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "updateGame");
        return ResponseEntity.ok().headers(responseHeaders).body(currentGame);
    }

    @MessageMapping("update/leave-game/{gameId}")
    @SendTo("queue/game/{gameId}")
    public ResponseEntity<CollaborativeGame> leaveGame(@DestinationVariable String gameId,
                                                       @RequestBody Player player)
            throws InvalidParamException {
        log.info("leaving game : {}", gameId, player);
        CollaborativeGame currentGame = gameService.leaveGame(gameId, player);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "updateGame");
        return ResponseEntity.ok().headers(responseHeaders).body(currentGame);
    }
}
