package com.java.backend.CrossWorks.models;

public class Crossword {
    private String crosswordId;
    private Grid answers;

    public Crossword(String id) {
        crosswordId = id;
        // somehow get the size of the crossword
        int n = 10;
        answers = new Grid(n);
    }
}
