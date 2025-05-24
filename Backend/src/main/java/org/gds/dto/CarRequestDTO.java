package org.gds.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CarRequestDTO {
    @NotBlank(message = "Alias is required")
    @Size(max = 100, message = "Alias must be less than 100 characters")
    private String alias;

    @Size(max = 100, message = "Brand must be less than 100 characters")
    private String brand;

    @Size(max = 100, message = "Model must be less than 100 characters")
    private String model;

    private Integer horsePower;

    private Integer torque;

    private String bio;

    private String photoUrl;

    public CarRequestDTO() {
    }

    public CarRequestDTO(String alias, String brand, String model, Integer horsePower, Integer torque, String bio, String photoUrl) {
        this.alias = alias;
        this.brand = brand;
        this.model = model;
        this.horsePower = horsePower;
        this.torque = torque;
        this.bio = bio;
        this.photoUrl = photoUrl;
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
}