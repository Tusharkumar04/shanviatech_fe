import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createSingleService } from '@/services/single.service';
import { queryKeys } from '@/services/query-keys';
import type { ModuleConfig } from '@/config/module-config';

export function useSingleService(config: ModuleConfig) {
  return useMemo(() => createSingleService(config), [config]);
}

export function useSingleDocument(config: ModuleConfig) {
  const service = useSingleService(config);
  return useQuery({
    queryKey: queryKeys.single(config.key),
    queryFn: () => service.get(),
    // A missing single document (404) is an expected "create me" state.
    retry: false,
  });
}

export function useSaveSingle(config: ModuleConfig) {
  const service = useSingleService(config);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => service.save(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.single(config.key) });
      toast.success(`${config.title} saved`);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
