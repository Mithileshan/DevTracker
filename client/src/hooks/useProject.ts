import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';
import { CreateProjectRequest } from '@shared/schemas';

export const useCreateProject = (orgId: string) => {
  return useMutation({
    mutationFn: async (data: CreateProjectRequest) => {
      const response = await apiClient.post(`/orgs/${orgId}/projects`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', orgId] });
    },
  });
};

export const useProjects = (orgId: string | null) => {
  return useQuery({
    queryKey: ['projects', orgId],
    queryFn: async () => {
      const response = await apiClient.get(`/orgs/${orgId}/projects`);
      return response.data.data;
    },
    enabled: !!orgId,
  });
};

export const useProject = (projectId: string | null) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${projectId}`);
      return response.data.data;
    },
    enabled: !!projectId,
  });
};

export const useProjectMembers = (projectId: string | null) => {
  return useQuery({
    queryKey: ['projectMembers', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${projectId}/members`);
      return response.data.data;
    },
    enabled: !!projectId,
  });
};
