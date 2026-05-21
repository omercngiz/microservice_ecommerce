import { api } from '../lib/axios';
import type { AuthUser } from '../context/auth-context';

export const loginAPI = async (
  email: string,
  password: string,
): Promise<{ accessToken: string; user: AuthUser }> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data as { accessToken: string; user: AuthUser };
};

export const refreshAPI = async (): Promise<{
  accessToken: string;
  user: AuthUser;
}> => {
  // withCredentials=true → tarayıcı httpOnly refresh token cookie'sini otomatik gönderir
  const response = await api.post('/auth/refresh');
  return response.data as { accessToken: string; user: AuthUser };
};

export const logoutAPI = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const registerAPI = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<void> => {
  await api.post('/auth/register', data);
};