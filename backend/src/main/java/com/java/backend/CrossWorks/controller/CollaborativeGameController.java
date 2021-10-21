package com.java.backend.CrossWorks.controller;

import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.CollaborativePlayer;
import com.java.backend.CrossWorks.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/collaborative-game")
public class CollaborativeGameController {
    private final GameService gameService;

    public CollaborativeGameController() {
        this.gameService = new GameService();
    }

    @PostMapping("/start")
    public ResponseEntity<CollaborativeGame> start(@RequestBody CollaborativePlayer player) {
        System.out.println("start game request: " + player.getPlayerId());
        return ResponseEntity.ok(gameService.createGame(player));
    }
}
