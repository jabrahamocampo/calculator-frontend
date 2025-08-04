import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function useAxiosAuth() {
  const { token } = useAuth();

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
}
