import axios from "./axiosInstance"; // folosește axios cu interceptor
const API_URL = "http://localhost:8081/api/forum/";

class ForumService {
  getAllPosts(page = 0, size = 10, sort = "createdAt", direction = "desc") {
    return axios.get(`${API_URL}posts?page=${page}&size=${size}&sort=${sort}&direction=${direction}`);
  }

  getPostsByCategory(category, page = 0, size = 10) {
    return axios.get(`${API_URL}posts/category/${category}?page=${page}&size=${size}`);
  }

  getPostById(id) {
    return axios.get(`${API_URL}posts/${id}`);
  }

  createPost(title, content, category) {
    return axios.post(`${API_URL}posts`, { title, content, category });
  }

  updatePost(id, title, content, category) {
    return axios.put(`${API_URL}posts/${id}`, { title, content, category });
  }

  deletePost(id) {
    return axios.delete(`${API_URL}posts/${id}`);
  }

  searchPosts(query, page = 0, size = 10) {
    return axios.get(`${API_URL}posts/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
  }

  getCommentsByPostId(postId, page = 0, size = 10) {
    return axios.get(`${API_URL}posts/${postId}/comments?page=${page}&size=${size}`);
  }

  createComment(postId, content) {
    return axios.post(`${API_URL}posts/${postId}/comments`, { content });
  }

  updateComment(commentId, content) {
    return axios.put(`${API_URL}comments/${commentId}`, { content });
  }

  deleteComment(commentId) {
    return axios.delete(`${API_URL}comments/${commentId}`);
  }

  likePost(postId) {
    return axios.post(`${API_URL}posts/${postId}/like`);
  }

  dislikePost(postId) {
    return axios.post(`${API_URL}posts/${postId}/dislike`);
  }

  removeLike(postId) {
    return axios.delete(`${API_URL}posts/${postId}/like`);
  }

  getLikeInfo(postId) {
    return axios.get(`${API_URL}posts/${postId}/likes`);
  }
}

export default new ForumService();
