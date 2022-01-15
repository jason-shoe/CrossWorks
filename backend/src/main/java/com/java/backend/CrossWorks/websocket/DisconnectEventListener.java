package com.java.backend.CrossWorks.websocket;

import com.java.backend.CrossWorks.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class DisconnectEventListener implements ApplicationListener<SessionDisconnectEvent> {
    @Autowired
    PlayerService playerService;

    @Override
    public void onApplicationEvent(SessionDisconnectEvent event) {
        System.out.println("Recieved disconnect event" + event.getSessionId());
        System.out.println("user's name " + event.getUser().getName());
        try {
            playerService.removePlayer(event.getUser().getName());
        } catch (Exception e) {
            System.out.println("Couldn't remove player: " + e);
        }

    }
}
