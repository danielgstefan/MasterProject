package org.gds.model;

import jakarta.persistence.*;

@Entity
public class Audio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String url;
    private String originalName;
    private String title;
    private Integer lastPosition;

    public Audio() {}

    public Audio(String filename, String url, String originalName) {
        this.filename = filename;
        this.url = url;
        this.originalName = originalName;
        this.title = originalName;
        this.lastPosition = 0;
    }

    public Audio(String filename, String url, String originalName, String title) {
        this.filename = filename;
        this.url = url;
        this.originalName = originalName;
        this.title = title;
        this.lastPosition = 0;
    }

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

    public Integer getLastPosition() { return lastPosition; }
    public void setLastPosition(Integer lastPosition) { this.lastPosition = lastPosition; }
}
