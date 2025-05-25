package org.gds.service;

import org.gds.model.CarPhoto;
import org.gds.repository.CarPhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarPhotoService {
    @Autowired
    private CarPhotoRepository carPhotoRepository;

    public CarPhoto save(CarPhoto carPhoto) {
        return carPhotoRepository.save(carPhoto);
    }

    public List<CarPhoto> findAll() {
        return carPhotoRepository.findAll();
    }

    public Optional<CarPhoto> findById(Long id) {
        return carPhotoRepository.findById(id);
    }

    public void deleteById(Long id) {
        carPhotoRepository.deleteById(id);
    }
}