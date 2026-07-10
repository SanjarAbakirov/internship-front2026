import { useCallback, useEffect, useState } from 'react';
import { getChatErrorMessage, sendChatMessage } from '../api/chatApi';
import { createMessage } from '../utils/messageFactory';
import { clearChatHistory, loadChatHistory, saveChatHistory } from '../utils/chatStorage';

export function useChatConversation() {
  const [messages, setMessages] = useState(() => loadChatHistory());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  const sendUserMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return false;

    const userMessage = createMessage('user', trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiReply = await sendChatMessage(trimmed);
      setMessages((prev) => [...prev, createMessage('assistant', aiReply)]);
    } catch (error) {
      setMessages((prev) => [...prev, createMessage('error', getChatErrorMessage(error))]);
    } finally {
      setIsLoading(false);
    }

    return true;
  }, [isLoading]);

  const resetConversation = useCallback(() => {
    setMessages([]);
    clearChatHistory();
  }, []);

  return { messages, isLoading, sendUserMessage, resetConversation };
}
