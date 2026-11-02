import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import type { ModuleConfig } from '@/config/module-config';
import type { EntityRecord } from '@/types/common';
import { useDeleteResource, useBulkDeleteResource, useResourceList } from '@/hooks/use-resource';
import { useDebounce } from '@/hooks/use-debounce';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { DataTable } from '@/components/data-table/data-table';
import { Pagination } from '@/components/data-table/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ResourceListPageProps {
  config: ModuleConfig;
}

interface DeleteTarget {
  ids: string[];
  label: string;
}

export function ResourceListPage({ config }: ResourceListPageProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState('-createdAt');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit,
      sort,
      ...(config.searchable && debouncedSearch
        ? { search: debouncedSearch }
        : {}),
    }),
    [page, limit, sort, debouncedSearch, config.searchable],
  );

  const { data, isLoading, isError, error } = useResourceList(config, params);
  const deleteOne = useDeleteResource(config);
  const bulkDelete = useBulkDeleteResource(config);

  const rows = data?.items ?? [];
  const meta = data?.meta ?? { total: 0, page, limit, totalPages: 1 };
  const isMutating = deleteOne.isPending || bulkDelete.isPending;

  const getRowId = (row: EntityRecord) => String(row._id);
  const routeKey = (row: EntityRecord) => {
    if (config.detailsBy === 'slug') return String(row.slug ?? row._id);
    if (config.detailsBy === 'type') return String(row.type ?? row._id);
    return String(row._id);
  };

  const toggleRow = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = (checked: boolean) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      rows.forEach((row) => {
        const id = getRowId(row);
        if (checked) next.add(id);
        else next.delete(id);
      });
      return next;
    });

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const onDone = () => {
      setDeleteTarget(null);
      setSelectedIds(new Set());
    };
    if (deleteTarget.ids.length === 1) {
      deleteOne.mutate(deleteTarget.ids[0], { onSettled: onDone });
    } else {
      bulkDelete.mutate(deleteTarget.ids, { onSettled: onDone });
    }
  };

  const isEmpty = !isLoading && rows.length === 0;
  const hasFilter = Boolean(debouncedSearch);

  return (
    <div>
      <PageHeader
        title={config.pluralLabel}
        description={config.description}
        actions={
          <Button onClick={() => navigate(`/${config.routePath}/new`)}>
            <Plus className="h-4 w-4" />
            New {config.singularLabel}
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {config.searchable ? (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={config.searchPlaceholder ?? 'Search…'}
              className="pl-9"
            />
          </div>
        ) : (
          <div />
        )}

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                setDeleteTarget({
                  ids: Array.from(selectedIds),
                  label: `${selectedIds.size} ${config.pluralLabel.toLowerCase()}`,
                })
              }
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {isError ? (
        <EmptyState
          icon="TriangleAlert"
          title="Could not load data"
          description={(error as Error)?.message}
        />
      ) : isEmpty ? (
        <EmptyState
          icon={config.icon}
          title={hasFilter ? 'No matches found' : `No ${config.pluralLabel.toLowerCase()} yet`}
          description={
            hasFilter
              ? 'Try a different search term.'
              : `Create your first ${config.singularLabel.toLowerCase()} to get started.`
          }
          action={
            !hasFilter && (
              <Button onClick={() => navigate(`/${config.routePath}/new`)}>
                <Plus className="h-4 w-4" />
                New {config.singularLabel}
              </Button>
            )
          }
        />
      ) : (
        <>
          <DataTable
            columns={config.columns ?? []}
            data={rows}
            getRowId={getRowId}
            isLoading={isLoading}
            sort={sort}
            onSortChange={setSort}
            selectedIds={selectedIds}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
            onRowClick={(row) => navigate(`/${config.routePath}/${routeKey(row)}`)}
            actions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate(`/${config.routePath}/${routeKey(row)}`)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(`/${config.routePath}/${routeKey(row)}/edit`)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() =>
                      setDeleteTarget({
                        ids: [getRowId(row)],
                        label: String(
                          row[config.primaryField ?? 'title'] ??
                            config.singularLabel,
                        ),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
          <Pagination
            meta={meta}
            onPageChange={setPage}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.label ?? ''}?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={isMutating}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
