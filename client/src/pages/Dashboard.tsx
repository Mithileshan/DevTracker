import { useNavigate } from 'react-router-dom';
import { useUserOrgs, useCreateOrg } from '@/hooks/useOrg';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateOrgSchema } from '@shared/schemas';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { z } from 'zod';

type CreateOrgFormData = z.infer<typeof CreateOrgSchema>;

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: orgs } = useUserOrgs();
  const { mutate: createOrg } = useCreateOrg();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateOrgFormData>({
    resolver: zodResolver(CreateOrgSchema),
  });

  const onSubmit = handleSubmit((data: CreateOrgFormData) => {
    createOrg(data, {
      onSuccess: () => {
        toast.success('Organization created!');
        reset();
        setShowCreateForm(false);
      },
      onError: () => {
        toast.error('Failed to create organization');
      },
    });
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Organizations</h1>

        {showCreateForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Create Organization</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  {...register('name')}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Organization name"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message?.toString()}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  {...register('description')}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Organization description"
                  rows={3}
                />
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
            + New Organization
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgs?.map((org: any) => (
            <div
              key={org._id}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/orgs/${org._id}/projects`)}
            >
              <h3 className="text-lg font-bold mb-2">{org.name}</h3>
              <p className="text-gray-600 mb-4">{org.description}</p>
              <p className="text-sm text-gray-500">Role: {org.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
