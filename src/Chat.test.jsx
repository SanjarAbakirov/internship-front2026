import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Chat from './Chat';
import { AuthProvider } from './context/AuthContext';

const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock('axios', () => {
  let requestInterceptor = null;

  const createMockInstance = () => ({
    get: (url, config = {}) => {
      let finalConfig = {
        ...config,
        headers: { ...(config.headers || {}) },
        url,
      };

      if (requestInterceptor) {
        finalConfig = requestInterceptor(finalConfig) || finalConfig;
      }

      return mockGet(finalConfig);
    },
    post: (url, data, config = {}) => {
      let finalConfig = {
        ...config,
        headers: { ...(config.headers || {}) },
        url,
        data,
      };

      if (requestInterceptor) {
        finalConfig = requestInterceptor(finalConfig) || finalConfig;
      }

      return mockPost(finalConfig);
    },
    interceptors: {
      request: {
        use: (callback) => {
          requestInterceptor = callback;
        },
      },
      response: {
        use: vi.fn(),
      },
    },
  });

  return {
    __esModule: true,
    default: {
      create: vi.fn(() => createMockInstance()),
    },
  };
});

const TEST_JWT = 'test-jwt-token-abc123';

const pastSessions = [
  {
    id: 'session-1',
    title: 'React basics',
    updatedAt: '2026-07-01T10:00:00.000Z',
  },
  {
    id: 'session-2',
    title: 'Spring Boot help',
    updatedAt: '2026-07-02T12:30:00.000Z',
  },
];

function renderAuthenticatedChat(token = TEST_JWT) {
  if (token) {
    localStorage.setItem('jwt', token);
  } else {
    localStorage.removeItem('jwt');
  }

  return render(
    <MemoryRouter initialEntries={['/chat']}>
      <AuthProvider>
        <Chat />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Chat', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();

    mockGet.mockImplementation(({ url }) => {
      if (url === '/api/chat/sessions') {
        return Promise.resolve({ data: pastSessions });
      }

      if (url === '/api/chat/sessions/session-1') {
        return Promise.resolve({
          data: {
            id: 'session-1',
            messages: [
              {
                id: 'm1',
                role: 'USER',
                content: 'What is React?',
                createdAt: '2026-07-01T10:00:00.000Z',
              },
              {
                id: 'm2',
                role: 'ASSISTANT',
                content: 'React is a UI library.',
                createdAt: '2026-07-01T10:00:01.000Z',
              },
            ],
          },
        });
      }

      return Promise.reject(new Error(`Unhandled GET ${url}`));
    });

    mockPost.mockResolvedValue({
      data: {
        reply: 'Mocked AI response',
        conversationId: 'session-new',
      },
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders the message input and send button in an authenticated context', async () => {
    renderAuthenticatedChat();

    expect(screen.getByRole('heading', { name: /AI Chat/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Message input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();

    expect(await screen.findByText('React basics')).toBeInTheDocument();
  });

  test('lets the user type a message and click send', async () => {
    renderAuthenticatedChat();
    await screen.findByText('React basics');

    const input = screen.getByLabelText('Message input');
    await userEvent.type(input, 'Hello from test');
    await userEvent.click(screen.getByRole('button', { name: /Send/i }));

    expect(screen.getByLabelText('Your message')).toHaveTextContent('Hello from test');

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  test('sends the message with Authorization header and displays the mocked AI response', async () => {
    renderAuthenticatedChat(TEST_JWT);
    await screen.findByText('React basics');

    await userEvent.type(screen.getByLabelText('Message input'), 'What is React?');
    await userEvent.click(screen.getByRole('button', { name: /Send/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    const requestConfig = mockPost.mock.calls[0][0];
    expect(requestConfig.url).toBe('/api/chat');
    expect(requestConfig.data).toEqual({ message: 'What is React?' });
    expect(requestConfig.headers.Authorization).toBe(`Bearer ${TEST_JWT}`);

    expect(await screen.findByText('Mocked AI response')).toBeInTheDocument();
    expect(screen.getByLabelText('AI reply')).toHaveTextContent('Mocked AI response');
  });

  test('displays an error message when the API request fails', async () => {
    mockPost.mockRejectedValueOnce({
      response: { data: { error: 'Unauthorized chat access' } },
    });

    renderAuthenticatedChat(TEST_JWT);
    await screen.findByText('React basics');

    await userEvent.type(screen.getByLabelText('Message input'), 'Trigger error');
    await userEvent.click(screen.getByRole('button', { name: /Send/i }));

    expect(await screen.findByText('Unauthorized chat access')).toBeInTheDocument();
    expect(screen.getByLabelText('Error message')).toBeInTheDocument();
  });

  test('loads a past conversation when clicked and clears the previous messages', async () => {
    renderAuthenticatedChat(TEST_JWT);

    await userEvent.type(screen.getByLabelText('Message input'), 'Temporary message');
    await userEvent.click(screen.getByRole('button', { name: /Send/i }));
    expect(await screen.findByText('Temporary message')).toBeInTheDocument();

    await userEvent.click(await screen.findByRole('button', { name: /React basics/i }));

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/api/chat/sessions/session-1' })
      );
    });

    expect(await screen.findByText('What is React?')).toBeInTheDocument();
    expect(screen.getByText('React is a UI library.')).toBeInTheDocument();
    expect(screen.queryByText('Temporary message')).not.toBeInTheDocument();
    expect(screen.getByText('Continuing conversation')).toBeInTheDocument();
  });

  test('starts a new chat and clears the active session', async () => {
    renderAuthenticatedChat(TEST_JWT);

    await userEvent.click(await screen.findByRole('button', { name: /React basics/i }));
    expect(await screen.findByText('What is React?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /New Chat/i }));

    expect(screen.queryByText('What is React?')).not.toBeInTheDocument();
    expect(screen.queryByText('Continuing conversation')).not.toBeInTheDocument();
    expect(screen.getByText(/Send a message to start the conversation/i)).toBeInTheDocument();
  });

  test('includes conversationId when sending a message in an existing conversation', async () => {
    renderAuthenticatedChat(TEST_JWT);

    await userEvent.click(await screen.findByRole('button', { name: /React basics/i }));
    await screen.findByText('What is React?');

    await userEvent.type(screen.getByLabelText('Message input'), 'Follow-up question');
    await userEvent.click(screen.getByRole('button', { name: /Send/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
    });

    const requestConfig = mockPost.mock.calls[mockPost.mock.calls.length - 1][0];
    expect(requestConfig.data).toEqual({
      message: 'Follow-up question',
      conversationId: 'session-1',
    });
  });
});
