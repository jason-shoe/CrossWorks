package com.java.backend.CrossWorks.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        /*
         * Broker that just handles sending a message back to a client
         * https://www.ietf.org/archive/id/draft-hapner-hybi-messagebroker-subprotocol-00.html
         */
        config.enableSimpleBroker("/topic");
        /*
         * This differentiates message-handeling methods for the application
         * level vs messages to be routed to the broker to broadcast to subscribed clients.
         * bound for functions with MessageMapping
         * https://github.com/lahsivjar/spring-websocket-template/blob/master/with-sockjs/src/main/java/lahsivjar/spring/websocket/template/WebSocketConfig.java
         */
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/gs-guide-websocket")
                .setAllowedOrigins("http://localhost:3000/")
                .addInterceptors(new HttpHandshakeInterceptor())
                .withSockJS();
    }


}