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


@Controller
public class ChatWebSocketController {

    @Autowired
    private ChatService chatService;

    
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatDTO sendMessage(@Payload ChatRequest chatRequest, Principal principal) {
        // Use the new method that creates a ChatDTO directly to avoid lazy loading issues
        return chatService.sendMessageDTO(chatRequest.getMessage(), principal.getName());
    }

    
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatDTO addUser(SimpMessageHeaderAccessor headerAccessor, Principal principal) {
        String username = principal.getName();
        headerAccessor.getSessionAttributes().put("username", username);
        // Use the new method that creates a ChatDTO directly to avoid lazy loading issues
        return chatService.createSystemMessageDTO(username + " joined the chat");
    }
}
