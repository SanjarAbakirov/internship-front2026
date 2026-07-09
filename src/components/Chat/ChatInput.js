import React from 'react';

function ChatInput({ value, onChange, onSend, disabled }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <form
      className="chat-input"
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
    >
      <textarea
        className="chat-input__field"
        rows="2"
        placeholder="Type your message..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Message input"
      />
      <button type="submit" className="chat-input__send btn" disabled={disabled || !value.trim()}>
        Send
      </button>
    </form>
  );
}

export default ChatInput;
