import React, { useState } from 'react';
import axios from 'axios';

function Chat({ token, onLogout }) {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/chat',
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply(res.data.choices?.[0]?.message?.content || 'No response');
    } catch (err) {
      setReply('Error: ' + err.message);
    }
  };

  return (
    <div className="container">
      <h2>AI Chat</h2>
      <button onClick={onLogout}>Logout</button>
      <textarea value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <div><strong>AI:</strong> {reply}</div>
    </div>
  );
}

export default Chat;