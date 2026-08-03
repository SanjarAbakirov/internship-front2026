import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ChatSessionProvider } from './context/ChatSessionContext';
import ChatInput from './components/Chat/ChatInput';
import ConversationSidebar from './components/Chat/ConversationSidebar';
import MessageList from './components/Chat/MessageList';
import { useChatConversation } from './hooks/useChatConversation';
import './components/Chat/Chat.css';

function ChatContent() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [sessionsRefreshKey, setSessionsRefreshKey] = useState(0);

  const handleSessionCreated = useCallback(() => {
    setSessionsRefreshKey((current) => current + 1);
  }, []);

  const {
    messages,
    activeSessionId,
    isLoading,
    isLoadingHistory,
    historyError,
    sendUserMessage,
    loadSession,
    beginNewChat,
    resetConversation,
  } = useChatConversation({ onSessionCreated: handleSessionCreated });

  const handleLogout = () => {
    resetConversation();
    logout();
    navigate('/login');
  };

  const handleSendMessage = async () => {
    const sent = await sendUserMessage(input);
    if (sent) {
      setInput('');
    }
  };

  const handleStartNewChat = () => {
    beginNewChat();
    setInput('');
  };

  return (
    <div className="chat-layout">
      <ConversationSidebar
        activeSessionId={activeSessionId}
        onSelectSession={loadSession}
        onStartNewChat={handleStartNewChat}
        refreshKey={sessionsRefreshKey}
      />

      <div className="container chat-container">
        <header className="chat-header">
          <div>
            <h2>AI Chat</h2>
            {activeSessionId && <p className="chat-header__session">Continuing conversation</p>}
          </div>
          <button type="button" className="chat-header__logout" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {historyError && (
          <div className="chat-history-error" role="alert">
            {historyError}
          </div>
        )}

        <MessageList messages={messages} isLoading={isLoading || isLoadingHistory} />

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSendMessage}
          disabled={isLoading || isLoadingHistory}
        />
      </div>
    </div>
  );
}

function Chat() {
  return (
    <ChatSessionProvider>
      <ChatContent />
    </ChatSessionProvider>
  );
}

export default Chat;
