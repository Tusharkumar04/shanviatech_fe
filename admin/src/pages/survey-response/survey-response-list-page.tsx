import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, Trash2 } from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api-client';
import type { PaginatedData } from '@/lib/api-client';
import { getSocket } from '@/lib/socket';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SurveyResponseRecord {
  _id: string;
  uid: string;
  user_data?: Record<string, string> | null;
  unseenChatByAdmin?: number;
  responses?: { question?: string; answer?: string }[];
  createdAt?: string;
}

export function SurveyResponseListPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [adminOnline, setAdminOnline] = useState(false);
  const [unseen, setUnseen] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['survey-response', 'list'],
    queryFn: () =>
      apiGet<PaginatedData<SurveyResponseRecord>>('/admin/survey-response/list', {
        params: { page: 1, limit: 100, sort: '-updatedAt' },
      }),
  });

  const rows = useMemo(() => data?.items ?? [], [data]);

  // Seed unseen counts from the fetched list.
  useEffect(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      map[r.uid] = r.unseenChatByAdmin ?? 0;
    });
    setUnseen(map);
  }, [rows]);

  // Socket: admin online status + live unseen badges.
  useEffect(() => {
    const socket = getSocket();
    socket.emit('get_admin_online_status');

    const onAdminOnline = (status: boolean) => setAdminOnline(Boolean(status));
    const onMessageForAdmin = (msg: { guestId?: string; text?: string }) => {
      if (!msg?.text || !msg.guestId) return;
      setUnseen((prev) => ({ ...prev, [msg.guestId!]: (prev[msg.guestId!] || 0) + 1 }));
    };
    const onNewVisit = () => qc.invalidateQueries({ queryKey: ['survey-response', 'list'] });

    socket.on('admin_online', onAdminOnline);
    socket.on('message_for_admin', onMessageForAdmin);
    socket.on('new_visit', onNewVisit);

    return () => {
      socket.off('admin_online', onAdminOnline);
      socket.off('message_for_admin', onMessageForAdmin);
      socket.off('new_visit', onNewVisit);
    };
  }, [qc]);

  const toggleOnline = (next: boolean) => {
    setAdminOnline(next);
    getSocket().emit('set_admin_status', { status: next });
  };

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const set = new Set(prev);
      set.has(id) ? set.delete(id) : set.add(id);
      return set;
    });

  const runMultiDelete = async () => {
    setDeleting(true);
    try {
      await apiPost('/admin/survey-response/multi-delete', { ids: Array.from(selected) });
      toast.success('Selected responses deleted');
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: ['survey-response', 'list'] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const openRow = (id: string, uid: string) => {
    setUnseen((prev) => ({ ...prev, [uid]: 0 }));
    navigate(`/survey-response/${id}`);
  };

  return (
    <div>
      <PageHeader
        title="Survey Responses"
        description="Visitor chatbot sessions and live chat."
        actions={
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
            <Switch id="admin-online" checked={adminOnline} onCheckedChange={toggleOnline} />
            <Label htmlFor="admin-online" className="cursor-pointer">
              {adminOnline ? 'Online' : 'Offline'}
            </Label>
          </div>
        }
      />

      {selected.size > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5">
          <span className="text-sm text-muted-foreground">{selected.size} selected</span>
          <Button variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      )}

      {isError ? (
        <EmptyState icon="TriangleAlert" title="Could not load data" description={(error as Error)?.message} />
      ) : !isLoading && rows.length === 0 ? (
        <EmptyState icon="MessageSquare" title="No survey responses yet" description="Visitor sessions will appear here." />
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>User</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const count = unseen[row.uid] ?? 0;
                return (
                  <TableRow key={row._id} className="cursor-pointer" onClick={() => openRow(row._id, row.uid)}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(row._id)}
                        onChange={() => toggleRow(row._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{row.user_data?.['Full Name'] || '—'}</div>
                      <div className="text-xs text-muted-foreground">{row.uid}</div>
                      {count > 0 && (
                        <Badge variant="destructive" className="mt-1">
                          New Message ({count})
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm text-muted-foreground">
                        {(row.responses ?? [])
                          .slice(0, 2)
                          .map((r) => r.answer)
                          .filter(Boolean)
                          .join(', ') || 'No responses'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openRow(row._id, row.uid)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${selected.size} response(s)?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={runMultiDelete}
      />
    </div>
  );
}
