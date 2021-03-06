package com.java.backend.CrossWorks.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        /*
         * Broker that just handles sending a message back to a client
         * https://www.ietf.org/archive/id/draft-hapner-hybi-messagebroker-subprotocol-00.html
         */
        // this is how hello messages get sent back
//        config.enableSimpleBroker("/topic");
        /*
         * This differentiates message-handeling methods for the application
         * level vs messages to be routed to the broker to broadcast to subscribed clients.
         * bound for functions with MessageMapping
         * https://github.com/lahsivjar/spring-websocket-template/blob/master/with-sockjs/src/main/java/lahsivjar/spring/websocket/template/WebSocketConfig.java
         */
//        config.setApplicationDestinationPrefixes("/app");

        config.enableSimpleBroker("queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/users");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/game-socket")
                .setAllowedOrigins("http://localhost:3000/")
//                .addInterceptors(new HttpHandshakeInterceptor())
                .setHandshakeHandler(new CustomHandshakeHandler())
                .withSockJS();
    }


}