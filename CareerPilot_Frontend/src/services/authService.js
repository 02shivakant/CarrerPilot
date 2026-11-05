import api from './api'

export const registerUser = async(userData) => {
        const response = await api.post(
             '/auth/register/',
             userData
        );

        return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post(
    '/auth/login/',
    credentials
  );

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get(
    '/auth/profile/'
  );

  return response.data;
};

// Update student profile
export const updateProfile = async (profileData) => {
  const response = await api.patch(
    '/auth/profile/',
    profileData
  );

  return response.data;
};