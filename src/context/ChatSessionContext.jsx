import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ChatSessionContext = createContext(null);

export function ChatSessionProvider({ children }) {
  const [activeSessionId, setActiveSessionId] = useState(null);

  const startNewChat = useCallback(() => {
    setActiveSessionId(null);
  }, []);

  const selectSession = useCallback((sessionId) => {
    setActiveSessionId(sessionId);
  }, []);

  const value = useMemo(
    () => ({
      activeSessionId,
      setActiveSessionId,
      startNewChat,
      selectSession,
    }),
    [activeSessionId, startNewChat, selectSession]
  );

  return <ChatSessionContext.Provider value={value}>{children}</ChatSessionContext.Provider>;
}

export function useChatSession() {
  const context = useContext(ChatSessionContext);

  if (!context) {
    throw new Error('useChatSession must be used within ChatSessionProvider');
  }

  return context;
}
