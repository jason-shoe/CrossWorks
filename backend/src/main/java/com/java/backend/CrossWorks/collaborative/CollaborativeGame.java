package com.java.backend.CrossWorks.collaborative;

import java.util.UUID;
import java.util.Vector;

import com.java.backend.CrossWorks.exceptions.InvalidMove;
import com.java.backend.CrossWorks.models.*;

import javax.persistence.*;

@Entity
public class CollaborativeGame extends Game{
    @Column(columnDefinition="LONGTEXT")
    private Vector<Player> players;
    @ManyToOne(cascade = {CascadeType.ALL})
    private TeamAnswers answers;

    public CollaborativeGame() {
        super(Datatype.COLLABORATIVE_GAME.prefix + UUID.randomUUID().toString());
        players = new Vector();
    }

    public CollaborativeGame(Crossword crossword) {
        this();
        setCrossword(crossword);
    }

    public void setCrossword(Crossword crossword) {
        this.changeCrossword(crossword);

        Grid answersGrid = new Grid(crossword.getSize());
        answersGrid.copyStructure(crossword.getBoard());
        int numCells = crossword.getNumNonBlock();

        this.answers = new TeamAnswers(answersGrid, numCells);
    }

    public void addPlayer(Player player) {
        if (!players.contains(player)){
            players.addElement(player);
        }
    }

    public boolean hasPlayer(Player player) {
        for (Player arrayPlayer: players) {
            System.out.print(arrayPlayer.getPlayerId());
            if (arrayPlayer.getPlayerId().equals(player.getPlayerId())) {
                System.out.println();
                return true;
            }
        }
        System.out.println();
        return false;
    }

    public void removePlayer(Player player) {
        players.remove(player);
    }

    public Vector<String> getPlayerIds() {
        Vector<String> player_ids = new Vector(players.size());
        for (int x = 0; x < players.size(); x++) {
            player_ids.add(x, players.get(x).getPlayerId());
        }
        return player_ids;
    }

    public void makeMove(Player player, int x, int y, char val) throws InvalidMove {
        answers.makeMove(x, y, GridCell.charValueOf(val), this.getCell(x, y));
    }

}
