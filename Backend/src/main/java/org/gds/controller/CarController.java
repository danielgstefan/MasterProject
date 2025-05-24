package org.gds.controller;

import jakarta.validation.Valid;
import org.gds.dto.CarDTO;
import org.gds.dto.CarRequestDTO;
import org.gds.payload.response.MessageResponse;
import org.gds.security.services.UserDetailsImpl;
import org.gds.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import java.util.List;

/**
 * Controller for car operations.
 */
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/cars")
public class CarController {

    @Autowired
    private CarService carService;

    /**
     * Get all cars for the authenticated user.
     *
     * @return list of cars
     */
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<CarDTO>> getUserCars() {
        Long userId = getCurrentUserId();
        List<CarDTO> cars = carService.getCarsByUserId(userId);
        return ResponseEntity.ok(cars);
    }

    /**
     * Get a car by ID.
     *
     * @param id the car ID
     * @return the car if found and belongs to the user
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getCarById(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        return carService.getCarById(id)
                .filter(car -> car.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new car.
     *
     * @param carRequest the car data
     * @return the created car
     */
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CarDTO> createCar(@Valid @RequestBody CarRequestDTO carRequest) {
        Long userId = getCurrentUserId();
        CarDTO createdCar = carService.createCar(carRequest, userId);
        return ResponseEntity.ok(createdCar);
    }

    /**
     * Update an existing car.
     *
     * @param id the car ID
     * @param carRequest the updated car data
     * @return the updated car
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @Valid @RequestBody CarRequestDTO carRequest) {
        Long userId = getCurrentUserId();
        return carService.updateCar(id, carRequest, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a car.
     *
     * @param id the car ID
     * @return success message if deleted
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteCar(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        boolean deleted = carService.deleteCar(id, userId);

        if (deleted) {
            return ResponseEntity.ok(new MessageResponse("Car deleted successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Upload a car image.
     *
     * @param file the image file
     * @return the URL of the uploaded image
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadCarImage(@RequestParam("file") MultipartFile file) {
        try {
            // Create uploads directory if it doesn't exist
            String uploadDir = "uploads/cars";
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate a unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + fileExtension;

            // Save the file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return the file URL
            String fileUrl = "/uploads/cars/" + filename;
            return ResponseEntity.ok(new MessageResponse(fileUrl));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to upload image: " + e.getMessage()));
        }
    }

    /**
     * Get the current authenticated user ID.
     *
     * @return the user ID
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
