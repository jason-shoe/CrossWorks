package com.java.backend.CrossWorks.models;

import java.util.Random;

public class Grid {
    private final GridCell[][] board;
    private final int size;

    public Grid(int s) {
        size = s;
        board = new GridCell[size][size];
        clearBoard();
    }

    // deep copy constructor
    public Grid(Grid other) {
        size = other.getSize();
        board = new GridCell[size][size];
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                board[x][y] = other.getCell(x, y);
            }
        }
    }

    public GridCell getCell(int x, int y) {
        return board[x][y];
    }

    public int getSize() {
        return size;
    }

    public void clearBoard() {
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                board[x][y] = GridCell.EMPTY;
            }
        }
    }

    public void randomFill() {
        Random random = new Random();
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                board[x][y] = GridCell.values()[random.nextInt(GridCell.values().length)];
            }
        }
    }

    // copies over BLOCKED (black squares), everything else becomes EMPTY
    public void copyStructure(Grid other) {
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                board[x][y] =
                        other.getCell(x, y) == GridCell.BLOCK ? GridCell.BLOCK :
                                GridCell.EMPTY;
            }
        }
    }

    public void printBoard() {
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                System.out.print(board[x][y].charValue);
            }
            System.out.println();
        }
    }
}
