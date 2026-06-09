import React, { useState } from 'react';
import axios from 'axios';

function Chat({ token, onLogout }) {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post('http://localhost:8080/api/chat',
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const aiText = res.data?.choices?.[0]?.message?.content || 'No reply';
      setReply(aiText);
    } catch (err) {
      setReply('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container">
      <h2>🤖 AI Chat</h2>
      <button onClick={onLogout} style={{ marginBottom: '10px' }}>Logout</button>
      <div>
        <textarea
          rows="3"
          placeholder="Ask me anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <button onClick={sendMessage} style={{ marginTop: '10px' }}>Send</button>
      {reply && (
        <div style={{ marginTop: '20px', background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
          <strong>AI:</strong> {reply}
        </div>
      )}
    </div>
  );
}

export default Chat;