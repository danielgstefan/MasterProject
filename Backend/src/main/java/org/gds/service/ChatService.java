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


@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    
    public Page<Chat> getRecentMessages(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return chatRepository.findAllByOrderByTimestampDesc(pageable);
    }

    
    public Page<ChatDTO> getRecentMessagesDTO(int page, int size) {
        Page<Chat> messages = getRecentMessages(page, size);
        return messages.map(chat -> new ChatDTO(chat.getId(), chat.getMessage(), chat.getSender().getUsername(), chat.getTimestamp()));
    }

    
    public Page<Chat> getChatHistory(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return chatRepository.findAllByOrderByTimestampAsc(pageable);
    }

    
    public Page<ChatDTO> getChatHistoryDTO(int page, int size) {
        Page<Chat> messages = getChatHistory(page, size);
        return messages.map(chat -> new ChatDTO(chat.getId(), chat.getMessage(), chat.getSender().getUsername(), chat.getTimestamp()));
    }

    
    public Chat sendMessage(String message, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Chat chat = new Chat(message, user);
        return chatRepository.save(chat);
    }

    
    public ChatDTO sendMessageDTO(String message, String username) {
        Chat chat = sendMessage(message, username);
        return new ChatDTO(chat.getId(), chat.getMessage(), chat.getSender().getUsername(), chat.getTimestamp());
    }

    
    public void deleteMessage(Long id) {
        chatRepository.deleteById(id);

        // Notify clients about the deleted message
        // Use the new method that creates a ChatDTO directly to avoid lazy loading issues
        ChatDTO chatDTO = createSystemMessageDTO("A message has been deleted by an administrator");
        messagingTemplate.convertAndSend("/topic/public", chatDTO);
    }

    
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

    
    public ChatDTO createSystemMessageDTO(String message) {
        Chat chat = createSystemMessage(message);
        return new ChatDTO(chat.getId(), chat.getMessage(), chat.getSender().getUsername(), chat.getTimestamp());
    }
}
