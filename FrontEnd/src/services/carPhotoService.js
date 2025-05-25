// services/carPhotoService.js
import axiosInstance from './axiosInstance';

// Fetch all car photos
export const fetchCarPhotos = () => {
    return axiosInstance.get('/car-photos');
};

// Upload a new car photo
export const uploadCarPhoto = (file, title) => {
    const formData = new FormData();
    formData.append('file', file);

    if (title && title.trim() !== '') {
        formData.append('title', title);
    }

    return axiosInstance.post('/car-photos/upload', formData);
};

// Update car photo title
export const updateCarPhotoTitle = (id, title) => {
    return axiosInstance.put(`/car-photos/${id}/title`, { title });
};

// Update car photo description
export const updateCarPhotoDescription = (id, description) => {
    return axiosInstance.put(`/car-photos/${id}/description`, { description });
};

// Delete a car photo
export const deleteCarPhoto = (id) => {
    return axiosInstance.delete(`/car-photos/${id}`);
};
