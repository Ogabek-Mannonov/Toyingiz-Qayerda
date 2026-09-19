import axios from 'axios';

// Barcha API so'rovlar uchun markaziy instansiya (Global interceptors)
const apiClient = axios.create({
  // URLni baseURL orqali boshqaramiz. Vite Proxy ishlatilgani uchun '/api' yozamiz.
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Har bir so'rov ketishidan oldin Tokenni avtomatik qo'shish
apiClient.interceptors.request.use(
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

// Har bir kelgan javobni (response) tekshirish (masalan, token eskirgan bo'lsa avtomatik logout)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token muddati tugagan yoki noto'g'ri. Iltimos, qayta kiring.");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login'; // Majburiy login sahifasiga o'tkazish
    }
    return Promise.reject(error);
  }
);

export default apiClient;
