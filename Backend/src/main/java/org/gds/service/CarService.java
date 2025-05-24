// File: CarService.java
package org.gds.service;

import lombok.RequiredArgsConstructor;
import org.gds.dto.CarDTO;
import org.gds.dto.CarRequestDTO;
import org.gds.exception.ResourceNotFoundException;
import org.gds.model.Car;
import org.gds.model.User;
import org.gds.repository.CarRepository;
import org.gds.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class CarService {

    private static final Logger log = LoggerFactory.getLogger(CarService.class);

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public CarService(CarRepository carRepository, UserRepository userRepository) {
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    public List<CarDTO> getCarsByUserId(Long userId) {
        return carRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<CarDTO> getCarById(Long id) {
        return carRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Transactional
    public CarDTO createCar(CarRequestDTO carRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + userId + " not found"));

        Car car = new Car();
        car.setAlias(carRequest.getAlias());
        car.setBrand(carRequest.getBrand());
        car.setModel(carRequest.getModel());
        car.setHorsePower(carRequest.getHorsePower());
        car.setTorque(carRequest.getTorque());
        car.setBio(carRequest.getBio());
        car.setPhotoUrl(carRequest.getPhotoUrl());
        car.setUser(user);

        Car savedCar = carRepository.save(car);
        log.debug("Car created with ID {} for user ID {}", savedCar.getId(), userId);
        return convertToDTO(savedCar);
    }

    @Transactional
    public Optional<CarDTO> updateCar(Long id, CarRequestDTO carRequest, Long userId) {
        return carRepository.findById(id).flatMap(car -> {
            if (!isOwner(car, userId)) return Optional.empty();

            car.setAlias(carRequest.getAlias());
            car.setBrand(carRequest.getBrand());
            car.setModel(carRequest.getModel());
            car.setHorsePower(carRequest.getHorsePower());
            car.setTorque(carRequest.getTorque());
            car.setBio(carRequest.getBio());
            car.setPhotoUrl(carRequest.getPhotoUrl());

            Car updatedCar = carRepository.save(car);
            log.debug("Car with ID {} updated by user ID {}", id, userId);
            return Optional.of(convertToDTO(updatedCar));
        });
    }

    @Transactional
    public boolean deleteCar(Long id, Long userId) {
        return carRepository.findById(id).map(car -> {
            if (!isOwner(car, userId)) return false;
            carRepository.delete(car);
            log.debug("Car with ID {} deleted by user ID {}", id, userId);
            return true;
        }).orElse(false);
    }

    private boolean isOwner(Car car, Long userId) {
        return car.getUser().getId().equals(userId);
    }

    private CarDTO convertToDTO(Car car) {
        return new CarDTO(
                car.getId(),
                car.getAlias(),
                car.getBrand(),
                car.getModel(),
                car.getHorsePower(),
                car.getTorque(),
                car.getBio(),
                car.getPhotoUrl(),
                car.getUser().getId()
        );
    }
}
