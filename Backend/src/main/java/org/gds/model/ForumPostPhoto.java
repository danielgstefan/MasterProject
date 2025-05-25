package org.gds.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "forum_post_photos")
public class ForumPostPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String url;
    private String originalName;
    private String title;
    private String description;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private ForumPost post;

    // Constructors
    public ForumPostPhoto() {}

    public ForumPostPhoto(String filename, String url, String originalName, ForumPost post) {
        this.filename = filename;
        this.url = url;
        this.originalName = originalName;
        this.title = originalName; // Default title to original filename
        this.description = ""; // Default empty description
        this.post = post;
    }

    public ForumPostPhoto(String filename, String url, String originalName, String title, ForumPost post) {
        this.filename = filename;
        this.url = url;
        this.originalName = originalName;
        this.title = title;
        this.description = ""; // Default empty description
        this.post = post;
    }

    public ForumPostPhoto(String filename, String url, String originalName, String title, String description, ForumPost post) {
        this.filename = filename;
        this.url = url;
        this.originalName = originalName;
        this.title = title;
        this.description = description;
        this.post = post;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getOriginalName() { return originalName; }
    public void setOriginalName(String originalName) { this.originalName = originalName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ForumPost getPost() { return post; }
    public void setPost(ForumPost post) { this.post = post; }
}
