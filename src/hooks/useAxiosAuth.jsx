import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { v4 as uuid4 } from 'uuid';

export default function useAxiosAuth() {
  const { token, user } = useAuth();
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      if (config.method === 'post') {
        config.headers['Idempotency-Key'] = uuid4();
      }

      if (user?.id) {
        config.headers['X-User-Id'] = user.id;
      }

      if (!config.headers['X-Correlation-ID']) {
        config.headers['X-Correlation-ID'] = uuid4();
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
}
