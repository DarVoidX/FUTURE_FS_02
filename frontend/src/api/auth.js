import api from './axios';

export const login = async (username, password) => {
  const { data } = await api.post('/api/auth/login', { username, password });
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/api/auth/me');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.put('/api/auth/profile', profileData);
  return data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await api.put('/api/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return data;
};
