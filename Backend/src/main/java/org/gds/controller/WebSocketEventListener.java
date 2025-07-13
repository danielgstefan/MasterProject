package org.gds.controller;

import org.gds.model.Chat;
import org.gds.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;


@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private ChatService chatService;


    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Received a new WebSocket connection");
    }


    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String username = (String) event.getMessage().getHeaders().get("simpSessionAttributes", Map.class).get("username");

        if (username != null) {
            logger.info("User disconnected: " + username);

            org.gds.dto.ChatDTO chatDTO = chatService.createSystemMessageDTO(username + " left the chat");
            messagingTemplate.convertAndSend("/topic/public", chatDTO);
        }
    }
}
