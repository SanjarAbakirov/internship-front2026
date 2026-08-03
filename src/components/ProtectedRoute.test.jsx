import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute, { UNAUTHORIZED_CHAT_MESSAGE } from './ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';

function renderProtectedChatRoute(initialEntry, token) {
  if (token) {
    localStorage.setItem('jwt', token);
  } else {
    localStorage.removeItem('jwt');
  }

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>
        <Routes>
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <div>Chat Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('renders chat when user is authenticated', () => {
    renderProtectedChatRoute('/chat', 'test-jwt-token');

    expect(screen.getByText('Chat Content')).toBeInTheDocument();
  });

  test('redirects unauthenticated users to login with notification', () => {
    renderProtectedChatRoute('/chat');

    expect(screen.queryByText('Chat Content')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(UNAUTHORIZED_CHAT_MESSAGE);
    expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
  });
});
