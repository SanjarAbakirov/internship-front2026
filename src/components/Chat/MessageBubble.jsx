import React from 'react';

function MessageBubble({ id, role, content }) {
  const isUser = role === 'user';
  const isError = role === 'error';

  return (
    <div
      className={`chat-message chat-message--enter ${isUser ? 'chat-message--user' : ''} ${isError ? 'chat-message--error' : ''}`}
      role="article"
      data-message-id={id}
      aria-label={isUser ? 'Your message' : isError ? 'Error message' : 'AI reply'}
    >
      <span className="chat-message__label">{isUser ? 'You' : isError ? 'Error' : 'AI'}</span>
      <p className="chat-message__content">{content}</p>
    </div>
  );
}

export default MessageBubble;
