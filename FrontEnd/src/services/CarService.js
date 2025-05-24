import axios from "./axiosInstance";

class CarService {
  // Get all cars for the authenticated user
  getUserCars() {
    return axios.get("/cars");
  }

  // Get a car by ID
  getCarById(id) {
    return axios.get(`/cars/${id}`);
  }

  // Create a new car
  createCar(carData) {
    return axios.post("/cars", carData);
  }

  // Update an existing car
  updateCar(id, carData) {
    return axios.put(`/cars/${id}`, carData);
  }

  // Delete a car
  deleteCar(id) {
    return axios.delete(`/cars/${id}`);
  }

  // Upload car image and get URL
  uploadCarImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`/cars/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new CarService();
