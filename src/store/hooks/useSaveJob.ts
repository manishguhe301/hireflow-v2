import { AppSdk } from '@/src/utils/AppSdk';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type SaveJobVars = { jobId: string; currentlySaved: boolean };

interface UseSaveJobOptions {
  invalidateKeys?: string[][];
  onMutate?: (variables: SaveJobVars) => Promise<unknown> | void;
  onError?: (err: unknown, variables: SaveJobVars, context: unknown) => void;
}

export function useSaveJob(options?: UseSaveJobOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ jobId, currentlySaved }: SaveJobVars) => {
      if (currentlySaved) {
        const res = await AppSdk.deleteData(
          `/api/jobs/saved?jobId=${jobId}`,
          null,
        );
        if (res.error) throw new Error(res.error);
        return { removed: true };
      } else {
        const res = await AppSdk.postData('/api/jobs/saved', { jobId });
        if (res.error) throw new Error(res.error);
        return { removed: false };
      }
    },
    onMutate: options?.onMutate,
    onSuccess: ({ removed }) => {
      toast.success(
        removed ? 'Job removed from saved' : 'Job saved successfully',
      );
      options?.invalidateKeys?.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );
    },
    onError: (err, vars, context) => {
      options?.onError?.(err, vars, context);
      toast.error('Something went wrong');
    },
  });

  const toggleSave = (jobId: string, currentlySaved: boolean) => {
    mutation.mutate({ jobId, currentlySaved });
  };

  return { toggleSave, isPending: mutation.isPending };
}
