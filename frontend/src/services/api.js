import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// --- Auth ---
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/user'),
};

// --- Users ---
export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (data) => api.put('/users/profile', data),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
  followUser: (userId) => api.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => api.delete(`/users/${userId}/follow`),
};

// --- Posts ---
export const postAPI = {
  getFeed: (page = 0, size = 10) => api.get(`/posts?page=${page}&size=${size}`),
  getDiscoverFeed: (page = 0, size = 10) => api.get(`/posts/discover?page=${page}&size=${size}`),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (formData) => api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
  unlikePost: (id) => api.delete(`/posts/${id}/like`),
  searchPosts: (params) => api.get('/posts/search', { params }),
};

// --- Comments ---
export const commentAPI = {
  getComments: (postId, page = 0, size = 10) =>
    api.get(`/posts/${postId}/comments?page=${page}&size=${size}`),
  addComment: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  updateComment: (commentId, data) => api.put(`/comments/${commentId}`, data),
  deleteOwnComment: (commentId) => api.delete(`/comments/${commentId}`),
  deleteAsPostOwner: (postId, commentId) =>
    api.delete(`/posts/${postId}/comments/${commentId}`),
};

// --- Notifications ---
export const notificationAPI = {
  getNotifications: (page = 0, size = 20) =>
    api.get(`/notifications?page=${page}&size=${size}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// --- Learning Progress ---
export const progressAPI = {
  createProgress: (data) => api.post('/progress', data),
  getUserProgress: (userId, page = 0, size = 10) =>
    api.get(`/progress/user/${userId}?page=${page}&size=${size}`),
  deleteProgress: (id) => api.delete(`/progress/${id}`),
};

// --- Learning Plans ---
export const planAPI = {
  createPlan: (data) => api.post('/plans', data),
  getUserPlans: (userId) => api.get(`/plans/user/${userId}`),
  updatePlan: (id, data) => api.put(`/plans/${id}`, data),
};
