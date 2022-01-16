package com.java.backend.CrossWorks.service;

import com.java.backend.CrossWorks.controller.dto.Message;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;

public class HttpUtil {
    public static String GAME = "GAME";
    public static String TEAM = "TEAM";

    private HttpUtil() {
    }

    public static String getPlayerIdFromHeader(SimpMessageHeaderAccessor headerAccessor) {
        String playerId = headerAccessor.getSessionAttributes().get("playerId").toString();
        return playerId;
    }

    public static HttpHeaders createResponseHeaders(String type, Message message) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("type", type);
        if (message != null) {
            responseHeaders.set("sender", message.sender);
            responseHeaders.set("receiver", message.receiver);
            responseHeaders.set("message", message.message);
        }

        return responseHeaders;
    }

    public static <T> ResponseEntity<T> createResponse(T body,
                                                       String type, Message message) {
        return ResponseEntity.ok().headers(createResponseHeaders(type, message)).body(body);
    }

    public static String getGameEndpoint(String gameId) {
        return "queue/game/" + gameId;
    }

    public static String getTeamEndpoint(String gameId, int teamNumber) {
        return "queue/game/" + gameId + "/" + teamNumber + "-team";
    }
}
