package org.gds.dto;

import org.gds.model.User;
import org.gds.model.Car;
import java.util.List;
import java.util.ArrayList;

public class UserProfileDTO {
    private String username;
    private String firstName;
    private String lastName;
    private String location;
    private String phoneNumber;
    private List<CarDTO> cars;

    public static UserProfileDTO from(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setLocation(user.getLocation());
        dto.setPhoneNumber(user.getPhoneNumber());

        List<CarDTO> carDtos = new ArrayList<>();
        if (user.getCars() != null) {
            for (Car car : user.getCars()) {
                carDtos.add(CarDTO.from(car));
            }
        }
        dto.setCars(carDtos);
        return dto;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public List<CarDTO> getCars() {
        return cars;
    }

    public void setCars(List<CarDTO> cars) {
        this.cars = cars;
    }
}
