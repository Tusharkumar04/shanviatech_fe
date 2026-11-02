import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Send } from 'lucide-react';
import { apiGet } from '@/lib/api-client';
import { getSocket } from '@/lib/socket';
import { PageHeader } from '@/components/common/page-header';
import { SectionLoader } from '@/components/common/loaders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  from: 'user' | 'admin';
  text?: string;
  createdAt?: string;
  seen?: boolean;
}

interface ResponseItem {
  question?: string;
  answer?: string;
  form?: { label?: string; value?: string }[];
}

interface SurveyResponseRecord {
  _id: string;
  uid: string;
  user_data?: Record<string, string> | null;
  responses?: ResponseItem[];
  chat?: ChatMessage[];
  unseenChatByUser?: number;
}

const fmtTime = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${d.toLocaleDateString()}`;
};

// The last `unseenByUser` admin messages are still unseen by the user (single tick).
const annotateAdminSeen = (chat: ChatMessage[], unseenByUser: number): ChatMessage[] => {
  const adminIdx = chat.map((m, i) => (m.from === 'admin' ? i : -1)).filter((i) => i >= 0);
  const unseen = new Set(adminIdx.slice(adminIdx.length - (unseenByUser || 0)));
  return chat.map((m, i) => (m.from === 'admin' ? { ...m, seen: !unseen.has(i) } : m));
};

export function SurveyResponseChatPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['survey-response', 'details', id],
    queryFn: () => apiGet<SurveyResponseRecord>(`/admin/survey-response/details/${id}`),
    enabled: Boolean(id),
  });

  const uid = data?.uid;

  const personalize = useMemo(() => {
    const ud = data?.user_data ?? {};
    const fullName = ud['Full Name'] || '';
    const firstName = fullName.split(' ')[0] || '';
    const selectedCountry = ud['Study Abroad'] || '';
    return (html?: string) =>
      (html || '')
        .replace(/\[First Name\]/g, firstName)
        .replace(/\[Selected Country\]/g, selectedCountry);
  }, [data]);

  // Seed chat from the loaded record (with seen state from the unseen count).
  useEffect(() => {
    if (data?.chat) setMessages(annotateAdminSeen(data.chat, data.unseenChatByUser || 0));
  }, [data]);

  // Socket: mark seen on open, receive new user messages, track read receipts.
  useEffect(() => {
    if (!uid) return;
    const socket = getSocket();
    socket.emit('markChatAsSeen', { uid, seenBy: 'admin' });

    const onMessageForAdmin = (msg: { guestId?: string; text?: string; createdAt?: string }) => {
      if (msg?.guestId !== uid || !msg?.text) return;
      setMessages((prev) => [...prev, { from: 'user', text: msg.text, createdAt: msg.createdAt }]);
      socket.emit('markChatAsSeen', { uid, seenBy: 'admin' });
    };
    // User viewed our messages -> show double tick on admin (outgoing) bubbles.
    const onSeenByUser = (p: { uid?: string }) => {
      if (p?.uid !== uid) return;
      setMessages((prev) => prev.map((m) => (m.from === 'admin' ? { ...m, seen: true } : m)));
    };
    socket.on('message_for_admin', onMessageForAdmin);
    socket.on('seen_by_user', onSeenByUser);
    return () => {
      socket.off('message_for_admin', onMessageForAdmin);
      socket.off('seen_by_user', onSeenByUser);
    };
  }, [uid]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text || !uid) return;
    const createdAt = new Date().toISOString();
    getSocket().emit('messageToUser', { uid, message: text, createdAt });
    setMessages((prev) => [...prev, { from: 'admin', text, createdAt, seen: false }]);
    setDraft('');
  };

  return (
    <div>
      <PageHeader
        title="Survey Response"
        description={data?.user_data?.['Full Name'] || data?.uid}
        actions={
          <Button variant="outline" onClick={() => navigate('/survey-response')}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      {isLoading ? (
        <SectionLoader />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: questions & answers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Question &amp; Answer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(data?.responses ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">No responses found.</p>
              )}
              {(data?.responses ?? []).map((resp, i) => (
                <div key={i} className="border-b border-border pb-3 last:border-0">
                  <div
                    className="text-sm font-medium"
                    dangerouslySetInnerHTML={{ __html: `Q${i + 1}: ${personalize(resp.question)}` }}
                  />
                  {resp.form && resp.form.length > 0 ? (
                    <div className="mt-2 space-y-1">
                      {resp.form.map((f, j) => (
                        <div key={j} className="rounded border border-border bg-muted/40 px-2 py-1 text-sm">
                          <strong>{f.label}:</strong> {f.value || '—'}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-muted-foreground">{resp.answer || '—'}</div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right: chat */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">Chat with the User</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <div className="mb-3 flex-1 space-y-3 overflow-y-auto rounded-lg border border-border p-3" style={{ maxHeight: 400, minHeight: 240 }}>
                {messages.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">No messages yet.</p>
                )}
                {messages.map((msg, i) => {
                  const isAdmin = msg.from === 'admin';
                  if (!msg.text) {
                    return (
                      <div key={i} className="text-sm text-muted-foreground">
                        <strong>User:</strong> Just connected…
                      </div>
                    );
                  }
                  return (
                    <div key={i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                          isAdmin ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}
                      >
                        <div>
                          <strong>{isAdmin ? 'You' : 'User'}:</strong> {msg.text}
                        </div>
                        <div className={`mt-1 flex items-center gap-1 text-[0.7rem] ${isAdmin ? 'justify-end text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          <span>{fmtTime(msg.createdAt)}</span>
                          {isAdmin && (
                            <span
                              title={msg.seen ? 'Seen' : 'Sent'}
                              className={msg.seen ? 'text-green-300' : 'text-primary-foreground/60'}
                            >
                              {msg.seen ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Type a message…"
                />
                <Button onClick={send} disabled={!draft.trim()}>
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
