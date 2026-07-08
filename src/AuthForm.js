import React, { useState } from 'react';
import axios from 'axios';

function AuthForm({ isLogin, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const validateClient = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!isLogin && !formData.email.trim()) newErrors.email = 'Email is required';
    if (!isLogin && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin && formData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseServerErrors = (serverMessage) => {
    const parsed = {};
    const match = serverMessage.match(/Validation failed: \{(.+)\}/);
    if (match) {
      const pairs = match[1].split(', ');
      pairs.forEach((pair) => {
        const [key, value] = pair.split('=');
        parsed[key.trim()] = value.trim();
      });
    }
    return parsed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setFieldErrors({});
    if (!validateClient()) return;

    try {
      const url = isLogin
        ? 'http://localhost:8080/api/auth/login'
        : 'http://localhost:8080/api/auth/register';

      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await axios.post(url, payload);

      if (response.data.success) {
        if (response.data.token) {
          onSuccess(response.data.token);
        } else {
          setMessage(response.data.message);
        }
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        setFieldErrors({});
      }
    } catch (err) {
      if (err.response?.data) {
        const serverMsg = err.response.data.message || 'Error';
        if (serverMsg.startsWith('Validation failed')) {
          setFieldErrors(parseServerErrors(serverMsg));
        } else {
          setError(serverMsg);
        }
      } else {
        setError('Network error. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <div className="success">{message}</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="form-group">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className={fieldErrors.username ? 'input-error' : ''}
        />
        {fieldErrors.username && <span className="error">{fieldErrors.username}</span>}
      </div>

      {!isLogin && (
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={fieldErrors.email ? 'input-error' : ''}
          />
          {fieldErrors.email && <span className="error">{fieldErrors.email}</span>}
        </div>
      )}

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={fieldErrors.password ? 'input-error' : ''}
        />
        {fieldErrors.password && <span className="error">{fieldErrors.password}</span>}
      </div>

      {!isLogin && (
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={fieldErrors.confirmPassword ? 'input-error' : ''}
          />
          {fieldErrors.confirmPassword && (
            <span className="error">{fieldErrors.confirmPassword}</span>
          )}
        </div>
      )}

      <button type="submit" className="btn">
        {isLogin ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
}

export default AuthForm;
