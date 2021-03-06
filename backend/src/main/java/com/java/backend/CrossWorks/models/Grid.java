package com.java.backend.CrossWorks.models;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Random;

@Entity
public class Grid implements Serializable {
    @Column(columnDefinition = "LONGTEXT")
    private final GridCell[][] board;
    private final int size;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    protected Grid() {
        this(10);
    }

    public Grid(int s) {
        size = s;
        board = new GridCell[size][size];
        clear();
    }

    // deep copy constructor
    public Grid(Grid other) {
        this.size = other.getSize();
        board = new GridCell[size][size];
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                board[x][y] = other.getCell(x, y);
            }
        }
    }

    public Long getId() {
        return id;
    }

    public GridCell getCell(int x, int y) {
        return board[x][y];
    }

    public void setCell(int x, int y, GridCell cell) {
        board[x][y] = cell;
    }

    public char[][] getGrid() {
        char[][] charBoard = new char[size][size];
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                charBoard[x][y] = board[x][y].charValue;
            }
        }

        return charBoard;
    }

    public int getSize() {
        return size;
    }

    public int getNumNonBlock() {
        int counter = 0;
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                if (board[x][y] != GridCell.BLOCK) {
                    counter += 1;
                }
            }
        }

        return counter;
    }

    public void clear() {
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                board[x][y] = GridCell.EMPTY;
            }
        }
    }

    public void clearLetters() {
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                if (board[x][y] != GridCell.BLOCK) {
                    board[x][y] = GridCell.EMPTY;
                }
            }
        }
    }

    public void blacken() {
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                if (board[x][y] == GridCell.EMPTY) {
                    board[x][y] = GridCell.BLOCK;
                }
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
