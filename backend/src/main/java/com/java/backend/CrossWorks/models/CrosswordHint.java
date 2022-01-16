package com.java.backend.CrossWorks.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.UUID;

@Data
@AllArgsConstructor
@Embeddable
@Entity
public class CrosswordHint implements Serializable {
    public int hintNumber;
    public String hint;
    @Column(name = "`ROW`")
    public int row;
    @Column(name = "`COL`")
    public int col;
    public Direction direction;
    @Id
    private String crosswordHintId;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String answer;

    public CrosswordHint() {
        this.crosswordHintId = Datatype.CROSSWORD_HINT + UUID.randomUUID().toString();
    }

    public String getAnswer() {
        return answer;
    }

    @Override
    public String toString() {
        return hint + " " + row + " " + col + " " + answer;
    }

    public int getAnswerLength() {
        return answer.length();
    }

}
