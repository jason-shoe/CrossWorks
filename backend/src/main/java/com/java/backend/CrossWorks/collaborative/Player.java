package com.java.backend.CrossWorks.collaborative;

import com.java.backend.CrossWorks.models.Datatype;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.UUID;

@Data
@Entity
public class Player implements Serializable {
    @Id
    private String playerId;

    public Player() {
        playerId = Datatype.PLAYER.prefix + UUID.randomUUID();
    }

    public Player(String playerId) {
        this.playerId = playerId;
    }

    public String getPlayerId() {
        return playerId;
    }

}
