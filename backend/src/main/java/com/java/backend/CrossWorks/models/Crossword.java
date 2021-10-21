package com.java.backend.CrossWorks.models;

import com.java.backend.CrossWorks.exceptions.InvalidMove;

public class Crossword {
    private String crosswordId;
    private Grid answers;

    public Crossword(String id) {
        crosswordId = id;
        // somehow get the size of the crossword
        int n = 10;
        answers = new Grid(n);
        answers.randomFill();
        // TODO: Use JPA storage to map id -> answers
        // TODO: Use JPA storage to get hints
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
