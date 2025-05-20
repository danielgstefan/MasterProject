package org.gds.controller;

import org.gds.dto.ChatDTO;
import org.gds.model.Chat;
import org.gds.payload.request.ChatRequest;
import org.gds.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.stream.Collectors;

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
     * @return Page of chat message DTOs
     */
    @GetMapping("/recent")
    public ResponseEntity<Page<ChatDTO>> getRecentMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Chat> messages = chatService.getRecentMessages(page, size);

        // Convert Chat entities to ChatDTOs
        Page<ChatDTO> messageDTOs = new PageImpl<>(
            messages.getContent().stream()
                .map(chat -> new ChatDTO(chat.getId(), chat.getMessage(), chat.getSender().getUsername(), chat.getTimestamp()))
                .collect(Collectors.toList()),
            messages.getPageable(),
            messages.getTotalElements()
        );

        return ResponseEntity.ok(messageDTOs);
    }

    /**
     * Get chat history in chronological order.
     *
     * @param page Page number
     * @param size Page size
     * @return Page of chat message DTOs
     */
    @GetMapping("/history")
    public ResponseEntity<Page<ChatDTO>> getChatHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Chat> messages = chatService.getChatHistory(page, size);

        // Convert Chat entities to ChatDTOs
        Page<ChatDTO> messageDTOs = new PageImpl<>(
            messages.getContent().stream()
                .map(chat -> new ChatDTO(chat.getId(), chat.getMessage(), chat.getSender().getUsername(), chat.getTimestamp()))
                .collect(Collectors.toList()),
            messages.getPageable(),
            messages.getTotalElements()
        );

        return ResponseEntity.ok(messageDTOs);
    }

    /**
     * Send a new chat message.
     *
     * @param chatRequest Chat message request
     * @return The created chat message DTO
     */
    @PostMapping("/send")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ChatDTO> sendMessage(@Valid @RequestBody ChatRequest chatRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Chat message = chatService.sendMessage(chatRequest.getMessage(), username);
        ChatDTO messageDTO = new ChatDTO(message.getId(), message.getMessage(), message.getSender().getUsername(), message.getTimestamp());
        return ResponseEntity.ok(messageDTO);
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
