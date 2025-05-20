package org.gds.controller;

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

/**
 * WebSocket event listener.
 * Handles WebSocket connection and disconnection events.
 */
@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private ChatService chatService;

    /**
     * Handle WebSocket connection events.
     * 
     * @param event The session connected event
     */
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Received a new WebSocket connection");
    }

    /**
     * Handle WebSocket disconnection events.
     * 
     * @param event The session disconnect event
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String username = (String) event.getMessage().getHeaders().get("simpSessionAttributes", Map.class).get("username");

        if (username != null) {
            logger.info("User disconnected: " + username);

            // Notify other users about the disconnection
            messagingTemplate.convertAndSend("/topic/public", 
                chatService.createSystemMessage(username + " left the chat"));
        }
    }
}
