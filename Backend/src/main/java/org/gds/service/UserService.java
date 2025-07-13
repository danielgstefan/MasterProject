package org.gds.service;

import org.gds.dto.UserDto;
import org.gds.model.User;
import org.gds.model.Role;
import org.gds.repository.UserRepository;
import org.gds.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;


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

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRoles().stream().anyMatch(role -> role.getId() == 2)) {
            long adminCount = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().anyMatch(role -> role.getId() == 2))
                .count();
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot delete the last admin user");
            }
        }

        refreshTokenRepository.deleteByUser(user);

        userRepository.delete(user);
    }

    @Transactional
    public void banUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRoles().stream().anyMatch(role -> role.getId() == 2)) {
            long adminCount = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().anyMatch(role -> role.getId() == 2))
                .count();
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot ban the last admin user");
            }
        }

        user.setBanned(true);
        userRepository.save(user);
    }

    @Transactional
    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBanned(false);
        userRepository.save(user);
    }

    private UserDto convertToDto(User user) {
        int roleId = user.getRoles().stream()
            .findFirst()
            .map(Role::getId)
            .orElse(1);
        return new UserDto(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            roleId,
            user.isBanned()
        );
    }
}