import axios from 'axios';
import { tokenStore } from './token-store';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // Refresh token httpOnly cookie için gerekli
  headers: {
    'Content-Type': 'application/json',
  },
});

// Her istekte hafızadaki accessToken'ı Authorization header'a ekle
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});