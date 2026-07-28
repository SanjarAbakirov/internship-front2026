import { useCallback, useState } from 'react';
import {
  fetchChatSession,
  getChatErrorMessage,
  sendChatMessage,
} from '../api/chatApi';
import { useChatSession } from '../context/ChatSessionContext';
import { createMessage } from '../utils/messageFactory';

export function useChatConversation({ onSessionCreated } = {}) {
  const { activeSessionId, setActiveSessionId, startNewChat } = useChatSession();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const loadSession = useCallback(async (sessionId) => {
    setIsLoadingHistory(true);
    setHistoryError(null);
    setActiveSessionId(sessionId);

    try {
      const session = await fetchChatSession(sessionId);
      setMessages(session.messages);
    } catch (error) {
      setMessages([]);
      setHistoryError(getChatErrorMessage(error));
    } finally {
      setIsLoadingHistory(false);
    }
  }, [setActiveSessionId]);

  const sendUserMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return false;

    const userMessage = createMessage('user', trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { reply, sessionId } = await sendChatMessage(trimmed, activeSessionId);
      setMessages((prev) => [...prev, createMessage('assistant', reply)]);

      if (!activeSessionId && sessionId) {
        setActiveSessionId(sessionId);
        onSessionCreated?.({
          id: sessionId,
          title: trimmed.slice(0, 60),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      setMessages((prev) => [...prev, createMessage('error', getChatErrorMessage(error))]);
    } finally {
      setIsLoading(false);
    }

    return true;
  }, [activeSessionId, isLoading, onSessionCreated, setActiveSessionId]);

  const beginNewChat = useCallback(() => {
    startNewChat();
    setMessages([]);
    setHistoryError(null);
  }, [startNewChat]);

  const resetConversation = useCallback(() => {
    beginNewChat();
  }, [beginNewChat]);

  return {
    messages,
    activeSessionId,
    isLoading,
    isLoadingHistory,
    historyError,
    sendUserMessage,
    loadSession,
    beginNewChat,
    resetConversation,
  };
}
