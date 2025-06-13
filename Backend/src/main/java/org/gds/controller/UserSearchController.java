package org.gds.controller;

import org.gds.model.User;
import org.gds.service.UserService;
import org.gds.dto.UserProfileDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserSearchController {

    @Autowired
    private UserService userService;

    @GetMapping("/search/{username}")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<?> searchUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(user -> {
                    // Force initialization of cars collection
                    user.getCars().size();
                    return ResponseEntity.ok(UserProfileDTO.from(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
