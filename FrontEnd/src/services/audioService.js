// services/audioService.js
import axiosInstance from './axiosInstance';

export const fetchAudioFiles = () => {
    return axiosInstance.get('/audio'); // Adaugă tokenul automat
};
