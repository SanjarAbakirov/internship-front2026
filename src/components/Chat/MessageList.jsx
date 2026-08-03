import React, { useLayoutEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

function MessageList({ messages, isLoading }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="chat-messages"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {messages.length === 0 && !isLoading && (
        <p className="chat-messages__empty">Send a message to start the conversation.</p>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          id={message.id}
          role={message.role}
          content={message.content}
        />
      ))}

      {isLoading && (
        <div
          className="chat-message chat-message--assistant chat-message--loading"
          aria-busy="true"
          data-message-id="loading-indicator"
        >
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
    </div>
  );
}

export default MessageList;
