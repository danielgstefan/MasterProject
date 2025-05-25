package org.gds.controller;

import org.gds.model.CarPhoto;
import org.gds.service.CarPhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/car-photos")
public class CarPhotoController {
    @Autowired
    private CarPhotoService carPhotoService;

    @Value("${car.photo.upload.dir:uploads/cars}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<CarPhoto> uploadCarPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = "";
            int i = originalName.lastIndexOf('.');
            if (i > 0) extension = originalName.substring(i);
            String filename = UUID.randomUUID() + extension;
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(filename);
            file.transferTo(filePath);
            String url = "/cars/" + filename;

            CarPhoto carPhoto;
            if (title != null && !title.trim().isEmpty()) {
                if (description != null && !description.trim().isEmpty()) {
                    carPhoto = new CarPhoto(filename, url, originalName, title, description);
                } else {
                    carPhoto = new CarPhoto(filename, url, originalName, title);
                }
            } else {
                carPhoto = new CarPhoto(filename, url, originalName);
            }

            CarPhoto saved = carPhotoService.save(carPhoto);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public List<CarPhoto> getAllCarPhotos() {
        return carPhotoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarPhoto> getCarPhotoById(@PathVariable Long id) {
        Optional<CarPhoto> carPhotoOpt = carPhotoService.findById(id);
        return carPhotoOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/title")
    public ResponseEntity<CarPhoto> updateCarPhotoTitle(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<CarPhoto> carPhotoOpt = carPhotoService.findById(id);
        if (carPhotoOpt.isPresent()) {
            CarPhoto carPhoto = carPhotoOpt.get();
            carPhoto.setTitle(title);
            CarPhoto updated = carPhotoService.save(carPhoto);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/description")
    public ResponseEntity<CarPhoto> updateCarPhotoDescription(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String description = payload.get("description");
        if (description == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<CarPhoto> carPhotoOpt = carPhotoService.findById(id);
        if (carPhotoOpt.isPresent()) {
            CarPhoto carPhoto = carPhotoOpt.get();
            carPhoto.setDescription(description);
            CarPhoto updated = carPhotoService.save(carPhoto);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarPhoto(@PathVariable Long id) {
        Optional<CarPhoto> carPhotoOpt = carPhotoService.findById(id);
        if (carPhotoOpt.isPresent()) {
            CarPhoto carPhoto = carPhotoOpt.get();
            Path filePath = Paths.get(uploadDir).resolve(carPhoto.getFilename());
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException ignored) {}
            carPhotoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}