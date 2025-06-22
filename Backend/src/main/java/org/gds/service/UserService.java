package org.gds.service;

import org.gds.dto.UserDto;
import org.gds.model.User;
import org.gds.model.Role;
import org.gds.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


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

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public void updateUserRole(Long userId, Integer newRole) {
        userRepository.findById(userId).ifPresent(user -> {
            Set<Role> roles = new HashSet<>();
            Role role = new Role();
            role.setId(newRole);
            roles.add(role);
            user.setRoles(roles);
            userRepository.save(user);
        });
    }

    private UserDto convertToDto(User user) {
        return new UserDto(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRoles().isEmpty() ? 1 : user.getRoles().iterator().next().getId()
        );
    }
}