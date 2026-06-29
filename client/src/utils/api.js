import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

// Tasks
export const fetchTasks = (params = {}) => api.get("/tasks", { params });
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const deleteCompletedTasks = () => api.delete("/tasks/completed/all");
export const fetchCategories = () => api.get("/tasks/categories/all");
export const addQuery = (taskId, message) => api.post(`/tasks/${taskId}/queries`, { message });

// Users (BA only)
export const getPendingUsers = () => api.get("/users/pending");
export const getEmployees = () => api.get("/users/employees");
export const getAllUsers = () => api.get("/users/all");
export const approveUser = (id) => api.patch(`/users/${id}/approve`);
export const rejectUser = (id) => api.delete(`/users/${id}/reject`);

export default api;
