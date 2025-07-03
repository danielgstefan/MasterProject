// services/audioService.js
import axiosInstance from "./axiosInstance";

export const fetchAudioFiles = () => axiosInstance.get("/audio");

export const uploadAudioFile = (file, title) => {
    const fd = new FormData();
    fd.append("file", file);
    if (title?.trim()) fd.append("title", title);
    return axiosInstance.post("/audio/upload", fd, { headers: {} }); // păstrează JWT
};

export const deleteAudioFile          = (id)           => axiosInstance.delete(`/audio/${id}`);
export const updateAudioFileTitle     = (id, title)    => axiosInstance.put(`/audio/${id}/title`,    { title });
export const updateAudioFilePosition  = (id, position) => axiosInstance.put(`/audio/${id}/position`, { position });
