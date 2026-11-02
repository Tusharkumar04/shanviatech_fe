import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { ColumnConfig } from '@/config/field-config';
import type { EntityRecord } from '@/types/common';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatDate, formatDateTime, humanize, truncate } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface DataTableProps {
  columns: ColumnConfig[];
  data: EntityRecord[];
  getRowId: (row: EntityRecord) => string;
  isLoading?: boolean;
  sort?: string;
  onSortChange?: (sort: string) => void;
  selectedIds: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  actions?: (row: EntityRecord) => ReactNode;
  onRowClick?: (row: EntityRecord) => void;
}

function Cell({ column, row }: { column: ColumnConfig; row: EntityRecord }) {
  const value = row[column.key];

  switch (column.type) {
    case 'image': {
      // Support both a single image string and an array (render the first image).
      const first = Array.isArray(value) ? value[0] : value;
      const src =
        typeof first === 'string'
          ? first
          : first && typeof first === 'object' && 'file' in first
            ? (first as { file: string }).file
            : '';
      return src ? (
        <img
          src={src}
          alt=""
          className="h-10 w-10 rounded-md border border-border object-cover"
        />
      ) : (
        <div className="grid h-10 w-10 place-items-center rounded-md border border-dashed border-border text-[10px] text-muted-foreground">
          N/A
        </div>
      );
    }
    case 'badge': {
      const str = String(value ?? '—');
      const variant = column.badgeMap?.[str] ?? 'secondary';
      return (
        <Badge variant={variant}>
          {column.humanize ? humanize(str) : str}
        </Badge>
      );
    }
    case 'boolean':
      return value ? (
        <Check className="h-4 w-4 text-success" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      );
    case 'date':
      return <span className="text-muted-foreground">{formatDate(value as string)}</span>;
    case 'datetime':
      return (
        <span className="text-muted-foreground">
          {formatDateTime(value as string)}
        </span>
      );
    case 'number':
      return <span>{value == null ? '—' : String(value)}</span>;
    case 'truncate':
      return (
        <span className="text-muted-foreground">
          {value ? truncate(String(value), 48) : '—'}
        </span>
      );
    case 'text':
    default:
      return (
        <span className={cn(column.humanize && 'capitalize')}>
          {value ? (column.humanize ? humanize(String(value)) : String(value)) : '—'}
        </span>
      );
  }
}

export function DataTable({
  columns,
  data,
  getRowId,
  isLoading,
  sort,
  onSortChange,
  selectedIds,
  onToggleRow,
  onToggleAll,
  actions,
  onRowClick,
}: DataTableProps) {
  const allSelected = data.length > 0 && data.every((row) => selectedIds.has(getRowId(row)));
  const someSelected = data.some((row) => selectedIds.has(getRowId(row)));

  const handleSort = (key: string) => {
    if (!onSortChange) return;
    const next = sort === key ? `-${key}` : sort === `-${key}` ? key : `-${key}`;
    onSortChange(next);
  };

  const sortIcon = (key: string) => {
    if (sort === key) return <ArrowUp className="h-3.5 w-3.5" />;
    if (sort === `-${key}`) return <ArrowDown className="h-3.5 w-3.5" />;
    return <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <Checkbox
                checked={
                  allSelected ? true : someSelected ? 'indeterminate' : false
                }
                onCheckedChange={(c) => onToggleAll(Boolean(c))}
                aria-label="Select all"
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    {column.label}
                    {sortIcon(column.key)}
                  </button>
                ) : (
                  column.label
                )}
              </TableHead>
            ))}
            {actions && <TableHead className="w-16 text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <Skeleton className="ml-auto h-7 w-7" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            : data.map((row) => {
                const id = getRowId(row);
                const selected = selectedIds.has(id);
                return (
                  <TableRow
                    key={id}
                    data-state={selected ? 'selected' : undefined}
                    onClick={() => onRowClick?.(row)}
                    className={cn(onRowClick && 'cursor-pointer')}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => onToggleRow(id)}
                        aria-label="Select row"
                      />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        <Cell column={column} row={row} />
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}
