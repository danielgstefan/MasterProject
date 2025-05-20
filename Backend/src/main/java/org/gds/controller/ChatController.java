package org.gds.controller;

import org.gds.model.Chat;
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

/**
 * REST controller for chat operations.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    /**
     * Get recent chat messages.
     *
     * @param page Page number
     * @param size Page size
     * @return Page of chat messages
     */
    @GetMapping("/recent")
    public ResponseEntity<Page<Chat>> getRecentMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Chat> messages = chatService.getRecentMessages(page, size);
        return ResponseEntity.ok(messages);
    }

    /**
     * Get chat history in chronological order.
     *
     * @param page Page number
     * @param size Page size
     * @return Page of chat messages
     */
    @GetMapping("/history")
    public ResponseEntity<Page<Chat>> getChatHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Chat> messages = chatService.getChatHistory(page, size);
        return ResponseEntity.ok(messages);
    }

    /**
     * Send a new chat message.
     *
     * @param chatRequest Chat message request
     * @return The created chat message
     */
    @PostMapping("/send")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Chat> sendMessage(@Valid @RequestBody ChatRequest chatRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Chat message = chatService.sendMessage(chatRequest.getMessage(), username);
        return ResponseEntity.ok(message);
    }

    /**
     * Delete a chat message.
     *
     * @param id Message ID
     * @return Response with no content
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        chatService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
