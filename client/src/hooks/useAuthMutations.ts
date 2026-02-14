import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { LoginRequest, RegisterRequest } from '@shared/schemas';

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiClient.post('/auth/register', data);
      return response.data.data;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post('/auth/login', data);
      return response.data.data;
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/auth/refresh');
      return response.data.data;
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data.data;
    },
    retry: 1,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
  });
};
