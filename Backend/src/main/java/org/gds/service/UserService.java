package org.gds.service;

import org.gds.model.User;
import org.gds.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }


    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}