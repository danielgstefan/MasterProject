package org.gds.controller;

import org.gds.dto.UserDto;
import org.gds.dto.UserRoleRequest;
import org.gds.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserManagementController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody UserRoleRequest roleRequest) {
        userService.updateUserRole(id, roleRequest.getRole());
        return ResponseEntity.ok().build();
    }
}
