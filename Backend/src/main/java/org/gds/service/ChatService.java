package org.gds.service;

import org.gds.model.Chat;
import org.gds.model.User;
import org.gds.repository.ChatRepository;
import org.gds.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Service for handling chat operations.
 */
@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Get recent chat messages.
     *
     * @param page Page number
     * @param size Page size
     * @return Page of chat messages
     */
    public Page<Chat> getRecentMessages(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return chatRepository.findAllByOrderByTimestampDesc(pageable);
    }

    /**
     * Get chat history in chronological order.
     *
     * @param page Page number
     * @param size Page size
     * @return Page of chat messages
     */
    public Page<Chat> getChatHistory(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return chatRepository.findAllByOrderByTimestampAsc(pageable);
    }

    /**
     * Send a new chat message.
     *
     * @param message Message content
     * @param username Username of the sender
     * @return The created chat message
     */
    public Chat sendMessage(String message, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Chat chat = new Chat(message, user);
        return chatRepository.save(chat);
    }

    /**
     * Delete a chat message.
     *
     * @param id Message ID
     */
    public void deleteMessage(Long id) {
        chatRepository.deleteById(id);

        // Notify clients about the deleted message
        Chat systemMessage = createSystemMessage("A message has been deleted by an administrator");
        messagingTemplate.convertAndSend("/topic/public", 
            new org.gds.dto.ChatDTO(systemMessage.getId(), systemMessage.getMessage(), 
                                    systemMessage.getSender().getUsername(), systemMessage.getTimestamp()));
    }

    /**
     * Create a system message.
     * 
     * @param message The system message content
     * @return A chat message with system as the sender
     */
    public Chat createSystemMessage(String message) {
        User systemUser = userRepository.findByUsername("system")
                .orElseGet(() -> {
                    User system = new User();
                    system.setUsername("system");
                    system.setEmail("system@example.com");
                    system.setPassword("not-applicable");

                    // Completăm toate câmpurile marcate cu @NotBlank
                    system.setFirstName("System");
                    system.setLastName("User");
                    system.setPhoneNumber("-");
                    system.setLocation("N/A");

                    return userRepository.save(system);
                });

        Chat chat = new Chat(message, systemUser);
        return chatRepository.save(chat);
    }
}
