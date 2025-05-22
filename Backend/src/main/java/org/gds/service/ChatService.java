package org.gds.service;

import org.gds.dto.ChatDTO;
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
     * Get recent chat messages as DTOs.
     * This method avoids the need to access the User's roles collection after the Hibernate session is closed.
     *
     * @param page Page number
     * @param size Page size
     * @return Page of chat message DTOs
     */
    public Page<ChatDTO> getRecentMessagesDTO(int page, int size) {
        Page<Chat> messages = getRecentMessages(page, size);
        return messages.map(chat -> new ChatDTO(chat.getId(), chat.getMessage(), chat.getSender().getUsername(), chat.getTimestamp()));
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
     * Get chat history in chronological order as DTOs.
     * This method avoids the need to access the User's roles collection after the Hibernate session is closed.
     *
     * @param page Page number
     * @param size Page size
     * @return Page of chat message DTOs
     */
    public Page<ChatDTO> getChatHistoryDTO(int page, int size) {
        Page<Chat> messages = getChatHistory(page, size);
        return messages.map(chat -> new ChatDTO(chat.getId(), chat.getMessage(), chat.getSender().getUsername(), chat.getTimestamp()));
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
     * Send a new chat message and return it as a DTO.
     * This method avoids the need to access the User's roles collection after the Hibernate session is closed.
     *
     * @param message Message content
     * @param username Username of the sender
     * @return The created chat message as a DTO
     */
    public ChatDTO sendMessageDTO(String message, String username) {
        Chat chat = sendMessage(message, username);
        return new ChatDTO(chat.getId(), chat.getMessage(), chat.getSender().getUsername(), chat.getTimestamp());
    }

    /**
     * Delete a chat message.
     *
     * @param id Message ID
     */
    public void deleteMessage(Long id) {
        chatRepository.deleteById(id);

        // Notify clients about the deleted message
        // Use the new method that creates a ChatDTO directly to avoid lazy loading issues
        ChatDTO chatDTO = createSystemMessageDTO("A message has been deleted by an administrator");
        messagingTemplate.convertAndSend("/topic/public", chatDTO);
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

    /**
     * Create a system message DTO directly.
     * This method avoids the need to access the User's roles collection after the Hibernate session is closed.
     * 
     * @param message The system message content
     * @return A chat message DTO with system as the sender
     */
    public ChatDTO createSystemMessageDTO(String message) {
        Chat chat = createSystemMessage(message);
        return new ChatDTO(chat.getId(), chat.getMessage(), chat.getSender().getUsername(), chat.getTimestamp());
    }
}
