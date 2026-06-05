import React, { useState } from 'react';
import axios from 'axios';

function AuthForm({ isLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // ... остальной код как в предыдущем App.js (handleChange, validateForm, handleSubmit)
  // Скопируйте его сюда

  return (
    <div className="container">
      <h1>{isLogin ? '🔐 Sign In' : '📝 Create Account'}</h1>
      {/* ... форма ... */}
    </div>
  );
}

export default AuthForm;