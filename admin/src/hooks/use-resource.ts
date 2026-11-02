import { useMemo } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { createResourceService } from '@/services/resource.service';
import { queryKeys } from '@/services/query-keys';
import type { ModuleConfig } from '@/config/module-config';
import type { EntityRecord, ListParams } from '@/types/common';

export function useResourceService(config: ModuleConfig) {
  return useMemo(() => createResourceService(config), [config]);
}

export function useResourceList(config: ModuleConfig, params: ListParams) {
  const service = useResourceService(config);
  return useQuery({
    queryKey: queryKeys.list(config.key, params),
    queryFn: () => service.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useResourceDetails(
  config: ModuleConfig,
  idOrKey?: string,
  enabled = true,
) {
  const service = useResourceService(config);
  return useQuery({
    queryKey: queryKeys.details(config.key, idOrKey),
    queryFn: () => service.details(idOrKey as string),
    enabled: enabled && Boolean(idOrKey),
  });
}

export function useCreateResource(config: ModuleConfig) {
  const service = useResourceService(config);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => service.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [config.key] });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
      toast.success(`${config.singularLabel} created`);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateResource(config: ModuleConfig) {
  const service = useResourceService(config);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      service.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [config.key] });
      toast.success(`${config.singularLabel} updated`);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteResource(config: ModuleConfig) {
  const service = useResourceService(config);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => service.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [config.key] });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
      toast.success(`${config.singularLabel} deleted`);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useBulkDeleteResource(config: ModuleConfig) {
  const service = useResourceService(config);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(ids.map((id) => service.remove(id)));
      const failed = results.filter((r) => r.status === 'rejected').length;
      return { total: ids.length, failed };
    },
    onSuccess: ({ total, failed }) => {
      qc.invalidateQueries({ queryKey: [config.key] });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
      if (failed === 0) toast.success(`${total} ${config.pluralLabel.toLowerCase()} deleted`);
      else toast.warning(`Deleted ${total - failed} of ${total}; ${failed} failed`);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export type ResourceRecord = EntityRecord;
