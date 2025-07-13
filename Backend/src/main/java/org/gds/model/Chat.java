package org.gds.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "chats")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String message;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User sender;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public Chat() {
        this.timestamp = LocalDateTime.now();
    }

    public Chat(String message, User sender) {
        this.message = message;
        this.sender = sender;
        this.timestamp = LocalDateTime.now();
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

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Chat{" +
                "id=" + id +
                ", message='" + message + '\'' +
                ", sender=" + sender.getUsername() +
                ", timestamp=" + timestamp +
                '}';
    }
}
