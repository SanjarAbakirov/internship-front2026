import { useCallback, useState } from 'react';
import { getChatErrorMessage, sendChatMessage } from '../api/chatApi';
import { createMessage } from '../utils/messageFactory';

export function useChatConversation() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return { messages, isLoading, sendUserMessage };
}
