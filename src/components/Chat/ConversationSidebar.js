import React, { useCallback, useEffect, useState } from 'react';
import { fetchChatSessions, getChatErrorMessage } from '../../api/chatApi';

function formatSessionDate(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ConversationSidebar({
  activeSessionId,
  onSelectSession,
  onStartNewChat,
  refreshKey = 0,
}) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchChatSessions();
      setSessions(data);
    } catch (err) {
      setError(getChatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions, refreshKey]);

  const handleSelectSession = (sessionId) => {
    if (sessionId === activeSessionId) return;
    onSelectSession(sessionId);
  };

  return (
    <aside className="conversation-sidebar" aria-label="Past conversations">
      <button
        type="button"
        className="conversation-sidebar__new-chat"
        onClick={onStartNewChat}
      >
        + New Chat
      </button>

      <h3 className="conversation-sidebar__title">Past Conversations</h3>

      {isLoading && (
        <p className="conversation-sidebar__status">Loading conversations...</p>
      )}

      {!isLoading && error && (
        <p className="conversation-sidebar__error" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && sessions.length === 0 && (
        <p className="conversation-sidebar__status">No past conversations yet.</p>
      )}

      <ul className="conversation-sidebar__list">
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;

          return (
            <li key={session.id}>
              <button
                type="button"
                className={`conversation-sidebar__item${isActive ? ' conversation-sidebar__item--active' : ''}`}
                onClick={() => handleSelectSession(session.id)}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="conversation-sidebar__item-title">{session.title}</span>
                {session.updatedAt && (
                  <span className="conversation-sidebar__item-date">
                    {formatSessionDate(session.updatedAt)}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default ConversationSidebar;
