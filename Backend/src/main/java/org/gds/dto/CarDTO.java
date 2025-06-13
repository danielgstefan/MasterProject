package org.gds.dto;

import org.gds.model.Car;

public class CarDTO {
    private Long id;
    private String alias;
    private String brand;
    private String model;
    private Integer horsePower;
    private Integer torque;
    private String bio;
    private String photoUrl;
    private Long userId;

    public CarDTO() {}

    public CarDTO(Long id, String alias, String brand, String model, Integer horsePower, Integer torque, String bio, String photoUrl, Long userId) {
        this.id = id;
        this.alias = alias;
        this.brand = brand;
        this.model = model;
        this.horsePower = horsePower;
        this.torque = torque;
        this.bio = bio;
        this.photoUrl = photoUrl;
        this.userId = userId;
    }

    public static CarDTO from(Car car) {
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

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getHorsePower() {
        return horsePower;
    }

    public void setHorsePower(Integer horsePower) {
        this.horsePower = horsePower;
    }

    public Integer getTorque() {
        return torque;
    }

    public void setTorque(Integer torque) {
        this.torque = torque;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
