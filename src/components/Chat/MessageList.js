import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

function MessageList({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
      {messages.length === 0 && !isLoading && (
        <p className="chat-messages__empty">Send a message to start the conversation.</p>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} role={message.role} content={message.content} />
      ))}

      {isLoading && (
        <div className="chat-message chat-message--assistant chat-message--loading" aria-busy="true">
          <span className="chat-message__label">AI</span>
          <p className="chat-message__content">
            <span className="chat-typing-indicator">
              <span />
              <span />
              <span />
            </span>
          </p>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
