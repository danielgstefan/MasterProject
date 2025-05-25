package org.gds.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Table(name = "forum_posts")
public class ForumPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    @NotBlank
    @Size(max = 50)
    private String category;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ForumPostPhoto> photos = new ArrayList<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Constructors
    public ForumPost() {}

    public ForumPost(String title, String content, User author, String category) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Photo management methods
    public List<ForumPostPhoto> getPhotos() {
        return photos;
    }

    public void setPhotos(List<ForumPostPhoto> photos) {
        this.photos = photos;
    }

    public void addPhoto(ForumPostPhoto photo) {
        photos.add(photo);
        photo.setPost(this);
    }

    public void removePhoto(ForumPostPhoto photo) {
        photos.remove(photo);
        photo.setPost(null);
    }
}
