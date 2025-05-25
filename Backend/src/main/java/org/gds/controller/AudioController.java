package org.gds.controller;

import org.gds.model.Audio;
import org.gds.service.AudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/audio")
public class AudioController {
    @Autowired
    private AudioService audioService;

    @Value("${audio.upload.dir:uploads/audio}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<Audio> uploadAudio(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title) {
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
            String url = "/audio/" + filename;

            Audio audio;
            if (title != null && !title.trim().isEmpty()) {
                audio = new Audio(filename, url, originalName, title);
            } else {
                audio = new Audio(filename, url, originalName);
            }

            Audio saved = audioService.save(audio);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public List<Audio> getAllAudio() {
        return audioService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Audio> getAudioById(@PathVariable Long id) {
        Optional<Audio> audioOpt = audioService.findById(id);
        return audioOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/title")
    public ResponseEntity<Audio> updateAudioTitle(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Audio> audioOpt = audioService.findById(id);
        if (audioOpt.isPresent()) {
            Audio audio = audioOpt.get();
            audio.setTitle(title);
            Audio updated = audioService.save(audio);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/position")
    public ResponseEntity<Audio> updateAudioPosition(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> payload) {
        Integer position = payload.get("position");
        if (position == null || position < 0) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Audio> audioOpt = audioService.findById(id);
        if (audioOpt.isPresent()) {
            Audio audio = audioOpt.get();
            audio.setLastPosition(position);
            Audio updated = audioService.save(audio);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAudio(@PathVariable Long id) {
        Optional<Audio> audioOpt = audioService.findById(id);
        if (audioOpt.isPresent()) {
            Audio audio = audioOpt.get();
            Path filePath = Paths.get(uploadDir).resolve(audio.getFilename());
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException ignored) {}
            audioService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
