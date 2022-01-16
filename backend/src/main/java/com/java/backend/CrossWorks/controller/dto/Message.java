package com.java.backend.CrossWorks.controller.dto;

import com.java.backend.CrossWorks.collaborative.Player;

public class Message {
    public String sender;
    public String receiver;
    public String message;

    public Message(String sender, String receiver, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
    }

    public Message(Player player, String receiver, String message) {
        this.sender = player.getPlayerId();
        this.receiver = receiver;
        this.message = player.getPlayerName() + " " + message;
    }


}
