import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';
import { CreateCommentRequest } from '@shared/schemas';

export const useCreateComment = (ticketId: string) => {
  return useMutation({
    mutationFn: async (data: CreateCommentRequest) => {
      const response = await apiClient.post(`/tickets/${ticketId}/comments`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
    },
  });
};

export const useComments = (ticketId: string | null, page: number = 1) => {
  return useQuery({
    queryKey: ['comments', ticketId, page],
    queryFn: async () => {
      const response = await apiClient.get(`/tickets/${ticketId}/comments?page=${page}`);
      return response.data.data;
    },
    enabled: !!ticketId,
  });
};

export const useDeleteComment = (commentId: string) => {
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
