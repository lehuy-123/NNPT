import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Thêm Bearer Token nếu người dùng đã đăng nhập
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Xử lý lỗi toàn cục
api.interceptors.response.use(
  (response) => {
    return response.data; 
  },
  (error) => {
    console.error('Lỗi API:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;
