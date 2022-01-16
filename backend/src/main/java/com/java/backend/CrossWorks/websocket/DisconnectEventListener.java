package com.java.backend.CrossWorks.websocket;

import com.java.backend.CrossWorks.CrossWorksApplication;
import com.java.backend.CrossWorks.service.PlayerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class DisconnectEventListener implements ApplicationListener<SessionDisconnectEvent> {
    private static final Logger log = LoggerFactory.getLogger(CrossWorksApplication.class);

    @Autowired
    PlayerService playerService;

    @Override
    public void onApplicationEvent(SessionDisconnectEvent event) {
        try {
            playerService.removePlayer(event.getUser().getName());
        } catch (Exception e) {
            log.info("Couldn't remove player: {}", e.toString());
        }

    }
}
