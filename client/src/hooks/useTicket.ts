import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';
import { CreateTicketRequest, UpdateTicketRequest, TicketFilters } from '@shared/schemas';

export const useCreateTicket = (orgId: string, projectId: string) => {
  return useMutation({
    mutationFn: async (data: CreateTicketRequest) => {
      const response = await apiClient.post(
        `/orgs/${orgId}/projects/${projectId}/tickets`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', projectId] });
    },
  });
};

export const useTickets = (
  projectId: string | null,
  filters?: TicketFilters
) => {
  return useQuery({
    queryKey: ['tickets', projectId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.assignee) params.append('assignee', filters.assignee);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.q) params.append('q', filters.q);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.sort) params.append('sort', filters.sort);

      const response = await apiClient.get(
        `/orgs/:orgId/projects/${projectId}/tickets?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: !!projectId,
  });
};

export const useTicket = (ticketId: string | null) => {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const response = await apiClient.get(`/tickets/${ticketId}`);
      return response.data.data;
    },
    enabled: !!ticketId,
  });
};

export const useUpdateTicket = (ticketId: string) => {
  return useMutation({
    mutationFn: async (data: UpdateTicketRequest) => {
      const response = await apiClient.patch(`/tickets/${ticketId}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useUpdateTicketStatus = (ticketId: string) => {
  return useMutation({
    mutationFn: async (status: string) => {
      const response = await apiClient.post(`/tickets/${ticketId}/status`, { status });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useAssignTicket = (ticketId: string) => {
  return useMutation({
    mutationFn: async (assigneeId: string | null) => {
      const response = await apiClient.post(`/tickets/${ticketId}/assign`, {
        assigneeId,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
  });
};

export const useDeleteTicket = (ticketId: string) => {
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/tickets/${ticketId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};
