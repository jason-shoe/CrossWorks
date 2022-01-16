package com.java.backend.CrossWorks.controller.dto;

import com.java.backend.CrossWorks.collaborative.Player;

public class Message {
    public String sender;
    public String receiver;
    public String message;
    public String messageType;

    public Message(String sender, String receiver, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.messageType = message;
    }

    public Message(String sender, String receiver, String message, String type) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.messageType = type;
    }

    public Message(Player player, String receiver, String message) {
        this.sender = player.getPlayerId();
        this.receiver = receiver;
        this.message = player.getPlayerName() + " " + message;
    }

    public Message(Player player, String receiver, String message, String type) {
        this.sender = player.getPlayerId();
        this.receiver = receiver;
        this.message = player.getPlayerName() + " " + message;
        this.messageType = type;
    }

}
