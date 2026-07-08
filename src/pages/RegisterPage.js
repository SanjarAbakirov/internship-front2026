import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../AuthForm';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = (token) => {
    if (token) {
      login(token);
      navigate('/chat');
    }
  };

  return (
    <div className="container">
      <h1>📝 Create Account</h1>
      <AuthForm isLogin={false} onSuccess={handleSuccess} />
      <p style={{ marginTop: '16px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
