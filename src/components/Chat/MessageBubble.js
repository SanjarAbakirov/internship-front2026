import React from 'react';

function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  const isError = role === 'error';

  return (
    <div
      className={`chat-message ${isUser ? 'chat-message--user' : ''} ${isError ? 'chat-message--error' : ''}`}
      role="article"
      aria-label={isUser ? 'Your message' : isError ? 'Error message' : 'AI reply'}
    >
      <span className="chat-message__label">
        {isUser ? 'You' : isError ? 'Error' : 'AI'}
      </span>
      <p className="chat-message__content">{content}</p>
    </div>
  );
}

export default MessageBubble;
