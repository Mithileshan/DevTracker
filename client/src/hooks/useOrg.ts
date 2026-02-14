import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';
import { CreateOrgRequest } from '@shared/schemas';

export const useCreateOrg = () => {
  return useMutation({
    mutationFn: async (data: CreateOrgRequest) => {
      const response = await apiClient.post('/orgs', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userOrgs'] });
    },
  });
};

export const useUserOrgs = () => {
  return useQuery({
    queryKey: ['userOrgs'],
    queryFn: async () => {
      const response = await apiClient.get('/orgs');
      return response.data.data;
    },
  });
};

export const useOrg = (orgId: string | null) => {
  return useQuery({
    queryKey: ['org', orgId],
    queryFn: async () => {
      const response = await apiClient.get(`/orgs/${orgId}`);
      return response.data.data;
    },
    enabled: !!orgId,
  });
};

export const useOrgMembers = (orgId: string | null) => {
  return useQuery({
    queryKey: ['orgMembers', orgId],
    queryFn: async () => {
      const response = await apiClient.get(`/orgs/${orgId}/members`);
      return response.data.data;
    },
    enabled: !!orgId,
  });
};

export const useAddOrgMember = (orgId: string) => {
  return useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      const response = await apiClient.post(`/orgs/${orgId}/members`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgMembers', orgId] });
    },
  });
};
