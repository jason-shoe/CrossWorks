package com.java.backend.CrossWorks.models;

import com.java.backend.CrossWorks.exceptions.InvalidMove;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class Crossword {
    @Id
    private String crosswordId;
    @ManyToOne(cascade = {CascadeType.ALL})
    private Grid answers;

    protected Crossword() {
        this(UUID.randomUUID().toString(), 10);
    }

    public Crossword(String crosswordId, int size) {
        this.crosswordId = crosswordId;
        // somehow get the size of the crossword
        answers = new Grid(size);
        answers.randomFill();
        // TODO: Use JPA storage to map id -> answers
        // TODO: Use JPA storage to get hints
    }

    public String getCrosswordId() {
        return crosswordId;
    }

    public Boolean checkCell(int x, int y, GridCell pred) throws InvalidMove {
        int size = answers.getSize();
        if (0 > x || x >= size || 0 > y && y >= size) {
            throw new InvalidMove("x and y values are out of bounds");
        }

        return pred == answers.getCell(x, y);
    }

    public int getNumNumBlock() {
        return answers.getNumNonBlock();
    }

    public int getSize() {
        return answers.getSize();
    }

    public Grid getBoard() {
        return answers;
    }
}
