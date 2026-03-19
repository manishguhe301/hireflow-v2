import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

interface UseCompanyJobActionsOptions {
  onDeleteSuccess?: (data: { action: string; message: string }) => void;
  onStatusSuccess?: () => void;
  onSettled?: () => void;
}

export function useCompanyJobActions(options?: UseCompanyJobActionsOptions) {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: async ({
      slug,
      status,
    }: {
      slug: string;
      status: 'ACTIVE' | 'CLOSED';
    }) => {
      const res = await fetch(`/api/company/jobs/${slug}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.status === 401 || res.status === 403) {
        signOut({ callbackUrl: '/login' });
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update job status');
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Job status updated');
      queryClient.invalidateQueries({ queryKey: ['company-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['company-job'] });
      queryClient.invalidateQueries({ queryKey: ['company-dashboard'] });
      options?.onStatusSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong');
    },
    onSettled: () => options?.onSettled?.(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/company/jobs/${slug}`, {
        method: 'DELETE',
      });

      if (res.status === 401 || res.status === 403) {
        signOut({ callbackUrl: '/login' });
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete job');
      return data;
    },
    onSuccess: (data) => {
      if (data?.action === 'closed') {
        toast.warning(data.message);
      } else {
        toast.success(data?.message || 'Job deleted');
      }
      queryClient.invalidateQueries({ queryKey: ['company-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['company-dashboard'] });
      options?.onDeleteSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong');
    },
    onSettled: () => options?.onSettled?.(),
  });

  const updateStatus = (slug: string, status: 'ACTIVE' | 'CLOSED') => {
    statusMutation.mutate({ slug, status });
  };

  const deleteJob = (slug: string) => {
    deleteMutation.mutate(slug);
  };

  return {
    updateStatus,
    deleteJob,
    isStatusPending: statusMutation.isPending,
    isDeletePending: deleteMutation.isPending,
  };
}
