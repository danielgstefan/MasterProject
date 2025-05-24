package org.gds.dto;

import java.time.LocalDateTime;

public class ChatDTO {
    private Long id;
    private String message;
    private String senderUsername;
    private LocalDateTime timestamp;

    public ChatDTO(String message, String senderUsername) {
        this.message = message;
        this.senderUsername = senderUsername;
    }

    public ChatDTO(Long id, String message, String senderUsername, LocalDateTime timestamp) {
        this.id = id;
        this.message = message;
        this.senderUsername = senderUsername;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
