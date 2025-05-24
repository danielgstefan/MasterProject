package org.gds.controller;

import org.gds.dto.ChatDTO;
import org.gds.model.Chat;
import org.gds.payload.request.ChatRequest;
import org.gds.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * WebSocket controller for chat operations.
 * Handles WebSocket messages for the chat functionality.
 */
@Controller
public class ChatWebSocketController {

    @Autowired
    private ChatService chatService;

    /**
     * Handle chat messages sent via WebSocket.
     * This method is mapped to /app/chat.sendMessage and broadcasts the message to /topic/public
     *
     * @param chatRequest The chat message request
     * @param principal   The authenticated user
     * @return The chat message DTO to be broadcast
     */
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatDTO sendMessage(@Payload ChatRequest chatRequest, Principal principal) {
        // Use the new method that creates a ChatDTO directly to avoid lazy loading issues
        return chatService.sendMessageDTO(chatRequest.getMessage(), principal.getName());
    }

    /**
     * Handle WebSocket connection when a user joins the chat.
     * This method is mapped to /app/chat.addUser and broadcasts a join message to /topic/public
     *
     * @param headerAccessor The message headers
     * @param principal       The authenticated user
     * @return A system message DTO indicating a user has joined
     */
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatDTO addUser(SimpMessageHeaderAccessor headerAccessor, Principal principal) {
        String username = principal.getName();
        headerAccessor.getSessionAttributes().put("username", username);
        // Use the new method that creates a ChatDTO directly to avoid lazy loading issues
        return chatService.createSystemMessageDTO(username + " joined the chat");
    }
}
