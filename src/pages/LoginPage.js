import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../AuthForm';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      setNotification(message);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.pathname, location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = (token) => {
    login(token);
    navigate('/chat');
  };

  return (
    <div className="container">
      <h1>🔐 Sign In</h1>

      {notification && (
        <div className="auth-notice" role="alert">
          {notification}
        </div>
      )}

      <AuthForm isLogin onSuccess={handleSuccess} />

      <p style={{ marginTop: '16px', textAlign: 'center' }}>
        No account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}

export default LoginPage;
