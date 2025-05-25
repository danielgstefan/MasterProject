package org.gds.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "forum_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "post_id"})
})
public class ForumLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_id", nullable = false)
    private ForumPost post;

    // true for like, false for dislike
    private boolean isLike;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructors
    public ForumLike() {}

    public ForumLike(User user, ForumPost post, boolean isLike) {
        this.user = user;
        this.post = post;
        this.isLike = isLike;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ForumPost getPost() {
        return post;
    }

    public void setPost(ForumPost post) {
        this.post = post;
    }

    public boolean isLike() {
        return isLike;
    }

    public void setLike(boolean like) {
        isLike = like;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}