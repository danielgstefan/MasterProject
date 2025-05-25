package org.gds.service;

import org.gds.model.Audio;
import org.gds.repository.AudioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AudioService {
    @Autowired
    private AudioRepository audioRepository;

    public Audio save(Audio audio) {
        return audioRepository.save(audio);
    }

    public List<Audio> findAll() {
        return audioRepository.findAll();
    }

    public Optional<Audio> findById(Long id) {
        return audioRepository.findById(id);
    }

    public void deleteById(Long id) {
        audioRepository.deleteById(id);
    }
}

