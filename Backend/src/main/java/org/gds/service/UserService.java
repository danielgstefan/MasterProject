package org.gds.service;

import org.gds.model.User;
import org.gds.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service for user operations.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Get a user by username.
     *
     * @param username the username
     * @return the user if found
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Get a user by ID.
     *
     * @param id the user ID
     * @return the user if found
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}