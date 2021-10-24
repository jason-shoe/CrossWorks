package com.java.backend.CrossWorks.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.UUID;

@Data
@AllArgsConstructor
@Embeddable
@Entity
public class CrosswordHint implements Serializable {
    @Id
    private String crosswordHintId;

    public int hintNumber;
    public String hint;
    public int x;
    public int y;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String answer;
    public Direction direction;

    public CrosswordHint () {
        this.crosswordHintId = Datatype.CROSSWORD_HINT + UUID.randomUUID().toString();
    }

    public String getAnswer(){
        return answer;
    }

    @Override
    public String toString() {
       return hint + " " + String.valueOf(x) + " " + String.valueOf(y) + " " + answer;
    }

    public int getAnswerLength() {
        return answer.length();
    }

}
