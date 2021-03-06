package com.java.backend.CrossWorks.collaborative;

import com.java.backend.CrossWorks.exceptions.InvalidMove;
import com.java.backend.CrossWorks.models.Datatype;
import com.java.backend.CrossWorks.models.Grid;
import com.java.backend.CrossWorks.models.GridCell;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.io.Serializable;
import java.util.UUID;

@Entity
public class TeamAnswers implements Serializable {
    @Id
    private final String teamAnswersId;

    @ManyToOne(cascade = {CascadeType.ALL})
    private Grid answers;
    private int numFilled;
    private int numCorrect;
    private int numCells;

    public TeamAnswers() {
        teamAnswersId = Datatype.TEAM_ANSWERS.prefix + UUID.randomUUID();
    }

    public TeamAnswers(Grid answers, int numCells) {
        this.teamAnswersId = Datatype.TEAM_ANSWERS.prefix + UUID.randomUUID();
        this.answers = answers;
        numFilled = 0;
        numCorrect = 0;
        this.numCells = numCells;
    }

    public void makeMove(int x, int y, GridCell newValue, GridCell correctValue)
            throws InvalidMove {
        GridCell oldValue = answers.getCell(x, y);

        if (newValue == GridCell.BLOCK) {
            throw new InvalidMove("Tried fillling a blocked cell");
        }

        if (newValue == oldValue) {
            return;
        }

        boolean newCorrect = newValue == correctValue;
        boolean oldCorrect = oldValue == correctValue;

        if (!oldValue.isEmpty() && !newValue.isEmpty()) {
            // both are nonempty
            if (oldCorrect) {
                numCorrect -= 1;
            }
            if (newCorrect) {
                numCorrect += 1;
            }
        } else if (!oldValue.isEmpty() && newValue.isEmpty()) {
            // was nonempty, not it is empty
            numFilled -= 1;
            if (oldCorrect) {
                numCorrect -= 1;
            }
        } else if (oldValue.isEmpty() && !newValue.isEmpty()) {
            // was empty, now it is nonempty
            numFilled += 1;
            if (newCorrect) {
                numCorrect += 1;
            }
        }

        answers.setCell(x, y, newValue);
    }

    public Grid getAnswers() {
        return answers;
    }

    public boolean isComplete() {
        return numFilled == numCells;
    }

    public boolean isCorrect() {
        return numCorrect == numCells;
    }

    public void clear() {
        answers.clearLetters();
        numFilled = 0;
        numCorrect = 0;
    }
}
