package org.gds.controller;

import org.gds.model.TuningRequest;
import org.gds.security.IsOwnerOrAdmin;
import org.gds.service.TuningRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tuning")
public class TuningRequestController {

    @Autowired
    private TuningRequestService tuningRequestService;

    @PostMapping("/request")
    @PreAuthorize("isAuthenticated()")
    @IsOwnerOrAdmin
    public ResponseEntity<?> createRequest(@RequestBody TuningRequest request, @RequestParam Long userId) {
        try {
            TuningRequest savedRequest = tuningRequestService.createRequest(request, userId);
            return ResponseEntity.ok(savedRequest);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating request: " + e.getMessage());
        }
    }

    @GetMapping("/requests/{userId}")
    @PreAuthorize("isAuthenticated()")
    @IsOwnerOrAdmin
    public ResponseEntity<?> getUserRequests(@PathVariable Long userId) {
        try {
            List<TuningRequest> requests = tuningRequestService.getUserRequests(userId);
            return ResponseEntity.ok(requests);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching requests: " + e.getMessage());
        }
    }

    @GetMapping("/requests/{userId}/{type}")
    @PreAuthorize("isAuthenticated()")
    @IsOwnerOrAdmin
    public ResponseEntity<?> getUserRequestsByType(
            @PathVariable Long userId,
            @PathVariable TuningRequest.TuningType type) {
        try {
            List<TuningRequest> requests = tuningRequestService.getUserRequestsByType(userId, type);
            return ResponseEntity.ok(requests);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching requests: " + e.getMessage());
        }
    }

    @PutMapping("/request/{requestId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestParam String status) {
        try {
            TuningRequest updatedRequest = tuningRequestService.updateRequestStatus(requestId, status);
            return ResponseEntity.ok(updatedRequest);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating request status: " + e.getMessage());
        }
    }
}
