import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ChatInput from './components/Chat/ChatInput';
import MessageList from './components/Chat/MessageList';
import { getChatErrorMessage, sendChatMessage } from './api/chatApi';
import './components/Chat/Chat.css';

function createMessage(role, content) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
  };
}

function Chat() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = createMessage('user', trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiReply = await sendChatMessage(trimmed);
      setMessages((prev) => [...prev, createMessage('assistant', aiReply)]);
    } catch (error) {
      setMessages((prev) => [...prev, createMessage('error', getChatErrorMessage(error))]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container chat-container">
      <header className="chat-header">
        <h2>AI Chat</h2>
        <button type="button" className="chat-header__logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <MessageList messages={messages} isLoading={isLoading} />

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  );
}

export default Chat;
