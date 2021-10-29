package com.java.backend.CrossWorks.controller;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.java.backend.CrossWorks.collaborative.CollaborativeGame;
import com.java.backend.CrossWorks.collaborative.Player;
import com.java.backend.CrossWorks.models.Crossword;
import com.java.backend.CrossWorks.service.CrosswordService;
import com.java.backend.CrossWorks.service.CollaborativeGameService;
import com.java.backend.CrossWorks.service.Views;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.Date;
import java.util.Vector;

@RestController
@CrossOrigin
@RequestMapping("/collaborative-game")
public class CollaborativeGameController {
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
        return ResponseEntity.ok(gameService.createGame(player));
    }
}
