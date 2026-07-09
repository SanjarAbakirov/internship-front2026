import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ChatInput from './components/Chat/ChatInput';
import MessageList from './components/Chat/MessageList';
import { useChatConversation } from './hooks/useChatConversation';
import './components/Chat/Chat.css';

function Chat() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const { messages, isLoading, sendUserMessage } = useChatConversation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSendMessage = async () => {
    const sent = await sendUserMessage(input);
    if (sent) {
      setInput('');
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
