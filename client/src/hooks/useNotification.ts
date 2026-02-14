import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';

export const useNotifications = (page: number = 1, unreadOnly: boolean = false) => {
  return useQuery({
    queryKey: ['notifications', page, unreadOnly],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (unreadOnly) params.append('unread', 'true');

      const response = await apiClient.get(`/notifications?${params.toString()}`);
      return response.data.data;
    },
  });
};

export const useMarkNotificationAsRead = (notificationId: string) => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch(`/notifications/${notificationId}/read`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/notifications/read-all');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteNotification = (notificationId: string) => {
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
