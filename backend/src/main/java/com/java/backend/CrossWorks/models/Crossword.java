package com.java.backend.CrossWorks.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.java.backend.CrossWorks.exceptions.InvalidMove;
import com.java.backend.CrossWorks.service.Views;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;
import java.util.Vector;

@Data
@AllArgsConstructor
@Embeddable
@Entity
public class Crossword {
    @Id
    @JsonView(Views.CrosswordIdDateView.class)
    private String crosswordId;

    private String name;
    @JsonView(Views.CrosswordIdDateView.class)
    private Date date;
    private String source;
    private int size;
    @Column(length = 10000)
    private Vector<CrosswordHint> clues;
    @ManyToOne(cascade = {CascadeType.ALL})

    @JsonIgnore
    private Grid answers;

    protected Crossword() {
        this.crosswordId = Datatype.CROSSWORD.prefix + UUID.randomUUID();
    }

    // should only fill after all the hints have been added;
    public void fillAnswers() {
        answers = new Grid(size);
        boolean valid = true;
        for (CrosswordHint hint : clues) {
            valid = processHint(hint) && valid;
        }

        if (!valid) {
            answers.clear();
        }

        // if the clues aren't valid, then we just make the entire board black
        answers.blacken();
    }

    public Boolean processHint(CrosswordHint hint) {
        String answer = hint.getAnswer();
        int isAcross = hint.direction == Direction.ACROSS ? 1 : 0;
        for (int i = 0; i < answer.length(); i++) {
            int x = hint.row + (1 - isAcross) * i;
            int y = hint.col + isAcross * i;
            GridCell currCell = answers.getCell(x, y);
            GridCell newCell = GridCell.charValueOf(answer.charAt(i));

            if (currCell == GridCell.EMPTY) {
                answers.setCell(x, y, newCell);
            } else if (newCell != currCell) {
                // TODO: figure out better error handeling here
                return false;
            }
        }
        return true;
    }

    public String getCrosswordId() {
        return crosswordId;
    }

    public Boolean checkCell(int row, int col, GridCell pred) throws InvalidMove {
        int size = answers.getSize();
        if (0 > row || row >= size || 0 > col && col >= size) {
            throw new InvalidMove("x and y values are out of bounds");
        }

        return pred == answers.getCell(row, col);
    }

    public int getSize() {
        return answers.getSize();
    }

    public String getSource() {
        return source;
    }

    public CrosswordHint getHint(int x) {
        return clues.get(x);
    }

    @JsonIgnore
    public Grid getBoard() {
        return answers;
    }

    public Grid getBoardProtected(boolean show) {
        if (show) {
            return answers;
        } else {
            return null;
        }
    }

    @JsonIgnore
    public int getNumNonBlock() {
        return answers.getNumNonBlock();
    }
}
