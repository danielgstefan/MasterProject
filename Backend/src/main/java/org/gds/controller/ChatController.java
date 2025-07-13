package org.gds.controller;

import org.gds.dto.ChatDTO;
import org.gds.payload.request.ChatRequest;
import org.gds.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;


    @GetMapping("/recent")
    public ResponseEntity<Page<ChatDTO>> getRecentMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<ChatDTO> messageDTOs = chatService.getRecentMessagesDTO(page, size);
        return ResponseEntity.ok(messageDTOs);
    }


    @GetMapping("/history")
    public ResponseEntity<Page<ChatDTO>> getChatHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<ChatDTO> messageDTOs = chatService.getChatHistoryDTO(page, size);
        return ResponseEntity.ok(messageDTOs);
    }


    @PostMapping("/send")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ChatDTO> sendMessage(@Valid @RequestBody ChatRequest chatRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        ChatDTO messageDTO = chatService.sendMessageDTO(chatRequest.getMessage(), username);
        return ResponseEntity.ok(messageDTO);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        chatService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
