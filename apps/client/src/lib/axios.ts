import axios from 'axios';
import { tokenStore } from './token-store';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

export const api = axios.create({
  baseURL: API_GATEWAY_URL, // API Gateway URL
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