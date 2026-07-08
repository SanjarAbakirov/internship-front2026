import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const UNAUTHORIZED_CHAT_MESSAGE =
  'You must be logged in to access the chat.';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: UNAUTHORIZED_CHAT_MESSAGE }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
