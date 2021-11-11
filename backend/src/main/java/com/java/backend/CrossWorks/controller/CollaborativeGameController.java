package com.java.backend.CrossWorks.controller;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.java.backend.CrossWorks.CrossWorksApplication;
import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.controller.dto.ConnectRequest;
import com.java.backend.CrossWorks.exceptions.InvalidParamException;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.service.CrosswordService;
import com.java.backend.CrossWorks.service.CollaborativeGameService;
import com.java.backend.CrossWorks.service.Views;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.Date;
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

    @PostMapping("/start")
    public ResponseEntity<CollaborativeGame> start(@RequestBody Player player) {
        return ResponseEntity.ok(gameService.findPlayersGame(player));
    }

    @PostMapping("/connect")
    public ResponseEntity<CollaborativeGame> connect(@RequestBody ConnectRequest request) throws InvalidParamException {
        log.info("connect request: {}", request);
        CollaborativeGame currentGame = gameService.connectToGame(request.getPlayer(), request.getGameId());
        for (String playerId: currentGame.getPlayerIds()) {
            if (!playerId.equals(request.getPlayer().getPlayerId())) {
                log.info("Sending to {}", playerId);
                simpMessagingTemplate.convertAndSendToUser(playerId, "/topic/hello", request.getPlayer().getPlayerId());
            }
        }
        return ResponseEntity.ok(currentGame);
    }
}
