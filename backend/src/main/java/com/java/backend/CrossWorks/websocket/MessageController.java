package com.java.backend.CrossWorks.websocket;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.java.backend.CrossWorks.models.Datatype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    private final SimpUserRegistry simpUserRegistry;

    public MessageController(SimpUserRegistry simpUserRegistry) {
        this.simpUserRegistry = simpUserRegistry;
    }
    /*
     * Messages sent to
     */
    @MessageMapping("/hello")
    @SendTo("/topic/hello")
    public String hello(SimpMessageHeaderAccessor headerAccessor) {
        String playerId = headerAccessor.getSessionAttributes().get("playerId").toString();
        System.out.println("new connection from this session");
		System.out.println(playerId);
        return playerId;
    }
}
