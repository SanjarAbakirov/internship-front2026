import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import ChatInput from './components/Chat/ChatInput';
import MessageList from './components/Chat/MessageList';
import './components/Chat/Chat.css';

const API_URL = 'http://localhost:8080/api/chat';

function createMessage(role, content) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
  };
}

function Chat() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = createMessage('user', trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        API_URL,
        { message: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const aiText = res.data?.choices?.[0]?.message?.content || 'No reply received.';
      setMessages((prev) => [...prev, createMessage('assistant', aiText)]);
    } catch (err) {
      const errorText = err.response?.data?.error || err.message || 'Something went wrong.';
      setMessages((prev) => [...prev, createMessage('error', errorText)]);
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
        onSend={sendMessage}
        disabled={isLoading}
      />
    </div>
  );
}

export default Chat;
