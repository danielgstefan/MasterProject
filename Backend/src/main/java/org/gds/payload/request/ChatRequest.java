package org.gds.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class ChatRequest {
    @NotBlank(message = "Message cannot be empty")
    @Size(max = 1000, message = "Message cannot exceed 1000 characters")
    private String message;

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
