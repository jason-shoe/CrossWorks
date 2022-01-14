package com.java.backend.CrossWorks.collaborative;

import com.java.backend.CrossWorks.models.Datatype;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.UUID;
import java.util.Vector;

@Entity
public class Team implements Serializable {
    @Column(columnDefinition = "LONGTEXT")
    public final Vector<Player> team;
    @Id
    private final String teamId;

    public Team() {
        teamId = Datatype.TEAM.prefix + UUID.randomUUID();
        team = new Vector();
    }

    public void add(Player player) {
        team.add(player);
    }

    public int size() {
        return team.size();
    }

    public void remove(Player player) {
        team.remove(player);
    }

    public boolean contains(Player player) {
        return team.contains(player);
    }

    public Vector<Player> getPlayers() {
        return team;
    }

}
