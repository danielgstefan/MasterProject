package org.gds.dto;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Integer roles;
    private boolean banned;

    public UserDto() {
    }

    public UserDto(Long id, String username, String email, Integer roles, boolean banned) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.banned = banned;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getRoles() {
        return roles;
    }

    public void setRoles(Integer roles) {
        this.roles = roles;
    }

    public boolean isBanned() {
        return banned;
    }

    public void setBanned(boolean banned) {
        this.banned = banned;
    }
}
