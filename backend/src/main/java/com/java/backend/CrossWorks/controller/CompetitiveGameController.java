package com.java.backend.CrossWorks.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import com.java.backend.CrossWorks.CrossWorksApplication;
import com.java.backend.CrossWorks.collaborative.CompetitiveGame;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.controller.dto.MoveRequest;
import com.java.backend.CrossWorks.controller.dto.NewTeamRequest;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.models.Grid;
import com.java.backend.CrossWorks.service.CompetitiveGameService;
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
@RequestMapping("/competitive-game")
public class CompetitiveGameController {
    private static final Logger log = LoggerFactory.getLogger(CrossWorksApplication.class);
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private CompetitiveGameService gameService;
    @Autowired
    private CrosswordService crosswordService;

    public CompetitiveGameController() {
    }

    public ResponseEntity<CompetitiveGame> createResponse(CompetitiveGame currentGame,
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
    public Vector<CompetitiveGame> getAllGames() {
        return gameService.getAllGames();
    }

    @DeleteMapping("/delete-games")
    public void deleteAllGames() {
        gameService.deleteAllGames();
    }

    @MessageMapping("/competitive/create")
    public void create(@RequestBody Player player) {
        log.info("Creating competitive game");
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "createGame");
        simpMessagingTemplate.convertAndSendToUser(player.getPlayerId(), "/queue/messages",
                ResponseEntity.ok().headers(responseHeaders)
                        .body(gameService.removeAndCreate(player)));
    }

    @MessageMapping("competitive/connect/{gameId}")
    @SendTo("queue/competitive/{gameId}")
    public ResponseEntity<CompetitiveGame> connect(@DestinationVariable String gameId,
                                                   @RequestBody Player player)
            throws InvalidParamException {
        log.info("connect request: {}", gameId, player);
        HttpHeaders responseHeaders = new HttpHeaders();
        try {
            CompetitiveGame currentGame = gameService.connectToGame(player, gameId);
            responseHeaders.set("type", "updateGame");
            return ResponseEntity.ok().headers(responseHeaders).body(currentGame);
        } catch (Exception e) {
            responseHeaders.set("type", "badGameId");
            ResponseEntity<CompetitiveGame> body =
                    ResponseEntity.badRequest().headers(responseHeaders).body(null);
            simpMessagingTemplate.convertAndSendToUser(player.getPlayerId(), "/queue/messages",
                    body);
            throw new InvalidParamException("Game ID doesn't exist in setCrossword - Controller");
        }
    }

    @MessageMapping("competitive/game-crossword/{gameId}")
    @SendTo("queue/competitive/{gameId}")
    public ResponseEntity<CompetitiveGame> updateGameCrossword(@DestinationVariable String gameId,
                                                               @RequestBody String crosswordId)
            throws InvalidParamException {
        log.info("Update Game Crossword: {}", gameId, crosswordId);
        Crossword selectedCrossword = crosswordService.getCrossword(crosswordId);
        return createResponse(gameService.setCrossword(selectedCrossword, gameId), "updateGame");
    }

    @MessageMapping("competitive/new-team/{gameId}")
    @SendTo("queue/competitive/{gameId}")
    public ResponseEntity<CompetitiveGame> newTeam(@DestinationVariable String gameId,
                                                   @RequestBody Player player)
            throws InvalidParamException {
        log.info("New Team: {}", gameId, player.getPlayerId());
        return createResponse(gameService.newTeam(player, gameId), "updateGame");
    }

    @MessageMapping("competitive/switch-team/{gameId}")
    @SendTo("queue/competitive/{gameId}")
    public ResponseEntity<CompetitiveGame> switchTeam(@DestinationVariable String gameId,
                                                      @RequestBody NewTeamRequest request)
            throws InvalidParamException {
        log.info("Switch Team: {}", gameId, request.player.getPlayerId(), request.teamNumber);
        return createResponse(gameService.switchTeam(request.player, request.teamNumber, gameId),
                "updateGame");
    }

    @MessageMapping("competitive/start-game/{gameId}")
    @SendTo("queue/competitive/{gameId}")
    public ResponseEntity<CompetitiveGame> updateStartGame(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("Start Game Crossword: {}", gameId);
        CompetitiveGame currentGame = gameService.startGame(gameId);
        sendTeamAnswers(currentGame);
        return createResponse(currentGame, "startGame");
    }

    @MessageMapping("competitive/make-move/{gameId}")
    @SendTo("queue/competitive/{gameId}")
    public void makeMove(@DestinationVariable String gameId,
                         @RequestBody MoveRequest request)
            throws Exception {
        log.info("Make move: {}", request.row, request.col, request.c);
        CompetitiveGame currentGame =
                gameService.makeMove(gameId, request.player, request.row, request.col, request.c);
        sendTeamAnswers(currentGame);
        return;
    }

    public void sendTeamAnswers(CompetitiveGame currentGame) {
        int numTeams = currentGame.getNumTeams();
        Grid[] unmaskedAnswers = currentGame.getTeamAnswers();
        Grid[] maskedAnswers = currentGame.getMaskedTeamAnswers();

        Grid[] temp = maskedAnswers.clone();

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", "competitiveAnswersUpdate");

        for (int i = 0; i < numTeams; i++) {
            temp[i] = unmaskedAnswers[i];
            log.info("sending to team: {}",
                    "/queue/messages/" + currentGame.getGameId() + "/" + i + "-team");

            simpMessagingTemplate.convertAndSend(
                    "queue/competitive/" + currentGame.getGameId() + "/" + i + "-team",
                    ResponseEntity.ok().headers(responseHeaders).body(temp));
            temp[i] = maskedAnswers[i];
        }
        return;

    }

    @MessageMapping("competitive/unpause/{gameId}")
    @SendTo("queue/competitive/{gameId}")
    public ResponseEntity<CompetitiveGame> unpause(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("Unpausing game: {}", gameId);
        return createResponse(gameService.unpauseGame(gameId), "updateGame");
    }

    @MessageMapping("competitive/pause/{gameId}")
    @SendTo("queue/competitive/{gameId}")
    public ResponseEntity<CompetitiveGame> pause(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("Pausing game: {}", gameId);
        return createResponse(gameService.pauseGame(gameId), "updateGame");
    }

    @MessageMapping("competitive/give-up/{gameId}")
    @SendTo("queue/competitive/{gameId}")
    public ResponseEntity<CompetitiveGame> giveUp(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("giving up: {}", gameId);
        return createResponse(gameService.loseGame(gameId), "updateGame");
    }

    @MessageMapping("competitive/return-to-settings/{gameId}")
    @SendTo("queue/competitive/{gameId}")
    public ResponseEntity<CompetitiveGame> returnToSettings(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("returning to settings: {}", gameId);
        return createResponse(gameService.returnToSettings(gameId), "updateGame");
    }

    @MessageMapping("competitive/leave-game/{gameId}")
    @SendTo("queue/competitive/{gameId}")
    public ResponseEntity<CompetitiveGame> leaveGame(@DestinationVariable String gameId,
                                                     @RequestBody Player player)
            throws InvalidParamException {
        log.info("leaving game : {}", gameId, player);
        return createResponse(gameService.leaveGame(gameId, player), "updateGame");
    }

    @MessageMapping("competitive/send-team-answers/{gameId}")
    public void sendTeamAnswers(@DestinationVariable String gameId)
            throws InvalidParamException {
        log.info("sending team answer: {}", gameId);
        CompetitiveGame currentGame = gameService.startGame(gameId);
        sendTeamAnswers(currentGame);
    }
}