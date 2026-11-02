import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { getSocket } from '@/lib/socket';

interface IncomingMessage {
  guestId?: string;
  text?: string;
  responseId?: string;
  isNewVisit?: boolean;
}

interface NewVisit {
  uid?: string;
  responseId?: string;
}

/**
 * App-wide live notifications for admins. Subscribes once to the survey chat
 * socket and raises a clickable toast for new visitor messages / new visits,
 * navigating to that conversation's chat page. Mounted in AppLayout so it
 * fires on every admin page (mirrors the reference admin header.ejs).
 */
export function useSurveyNotifications() {
  const navigate = useNavigate();
  const location = useLocation();
  // Keep the latest pathname in a ref so we don't re-subscribe on navigation.
  const pathRef = useRef(location.pathname);
  pathRef.current = location.pathname;

  useEffect(() => {
    const socket = getSocket();

    const openChat = (responseId?: string) =>
      navigate(responseId ? `/survey-response/${responseId}` : '/survey-response');

    const onMessage = (data: IncomingMessage) => {
      if (!data?.text) return; // ignore the empty "connected" ping
      // Don't interrupt if already viewing this exact conversation.
      if (data.responseId && pathRef.current === `/survey-response/${data.responseId}`) return;
      toast.message('New message', {
        description: data.text,
        action: { label: 'Open chat', onClick: () => openChat(data.responseId) },
        duration: 6000,
        position: 'bottom-right',
      });
    };

    const onNewVisit = (data: NewVisit) => {
      toast.message('New visitor', {
        description: 'A new visitor just started a session.',
        action: { label: 'View', onClick: () => openChat(data.responseId) },
        duration: 6000,
        position: 'bottom-right',
      });
    };

    socket.on('message_for_admin', onMessage);
    socket.on('new_visit', onNewVisit);

    return () => {
      socket.off('message_for_admin', onMessage);
      socket.off('new_visit', onNewVisit);
    };
  }, [navigate]);
}
