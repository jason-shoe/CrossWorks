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

    private String currentGameId;

    private String playerName;

    public Player() {
        playerId = Datatype.PLAYER.prefix + UUID.randomUUID();
    }

    public Player(String playerId) {
        this.playerId = playerId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public String getCurrentGameId() {
        return currentGameId;
    }

    public void setCurrentGameId(String gameId) {
        this.currentGameId = gameId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }

        /* Check if o is an instance of Complex or not
          "null instanceof [type]" also returns false */
        if (!(o instanceof Player)) {
            return false;
        }

        // typecast o to Complex so that we can compare data members
        Player c = (Player) o;

        // Compare the data members and return accordingly
        return c.getPlayerId().equals(playerId);
    }

}
