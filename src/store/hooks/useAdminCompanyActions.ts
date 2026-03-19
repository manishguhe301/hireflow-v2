import { AppSdk } from '@/src/utils/AppSdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseAdminCompanyActionsOptions {
  onDeleteSuccess?: () => void;
  onSettled?: () => void;
}

export function useAdminCompanyActions(
  options?: UseAdminCompanyActionsOptions,
) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
  };

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      AppSdk.patchData(`/api/admin/companies/${id}`, { status: 'APPROVED' }),
    onSuccess: () => {
      toast.success('Company approved successfully');
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['admin-company'] });
    },
    onError: () => toast.error('Failed to approve company'),
    onSettled: () => options?.onSettled?.(),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      AppSdk.patchData(`/api/admin/companies/${id}`, {
        status: 'REJECTED',
        rejectionReason: reason,
      }),
    onSuccess: () => {
      toast.success('Company rejected');
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['admin-company'] });
    },
    onError: () => toast.error('Failed to reject company'),
    onSettled: () => options?.onSettled?.(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      AppSdk.deleteData(`/api/admin/companies/${id}`, null),
    onSuccess: () => {
      toast.success('Company deleted');
      invalidate();
      options?.onDeleteSuccess?.();
    },
    onError: () => toast.error('Failed to delete company'),
    onSettled: () => options?.onSettled?.(),
  });

  const approve = (id: string) => approveMutation.mutate(id);

  const reject = (id: string, reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    rejectMutation.mutate({ id, reason });
  };

  const remove = (id: string) => deleteMutation.mutate(id);

  return {
    approve,
    reject,
    remove,
    isApprovePending: approveMutation.isPending,
    isRejectPending: rejectMutation.isPending,
    isDeletePending: deleteMutation.isPending,
    pendingId: approveMutation.isPending
      ? `approve-${approveMutation.variables}`
      : rejectMutation.isPending
        ? `reject-${rejectMutation.variables?.id}`
        : deleteMutation.isPending
          ? `delete-${deleteMutation.variables}`
          : null,
  };
}
