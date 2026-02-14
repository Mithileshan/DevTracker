import { useParams, useNavigate } from 'react-router-dom';
import { useProjects, useCreateProject } from '@/hooks/useProject';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProjectSchema } from '@shared/schemas';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { z } from 'zod';

type CreateProjectFormData = z.infer<typeof CreateProjectSchema>;

export default function ProjectsPage() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const { data: projects } = useProjects(orgId || null);
  const { mutate: createProject } = useCreateProject(orgId || '');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProjectFormData>({
    resolver: zodResolver(CreateProjectSchema),
  });

  const onSubmit = handleSubmit((data: CreateProjectFormData) => {
    createProject(data, {
      onSuccess: () => {
        toast.success('Project created!');
        reset();
        setShowCreateForm(false);
      },
      onError: () => {
        toast.error('Failed to create project');
      },
    });
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            ← Back
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Create Project</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  {...register('name')}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Project name"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message?.toString()}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Key</label>
                <input
                  {...register('key')}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., PROJ"
                />
                {errors.key && <p className="text-red-500 text-sm">{errors.key.message?.toString()}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="mb-8 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
          >
            + New Project
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project: any) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/projects/${project._id}/tickets`)}
            >
              <h3 className="text-lg font-bold mb-2">{project.name}</h3>
              <p className="text-gray-600 text-sm mb-2">Key: {project.key}</p>
              <p className="text-gray-600">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
