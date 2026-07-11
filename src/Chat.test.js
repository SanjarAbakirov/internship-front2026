import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Chat from './Chat';
import { AuthProvider } from './context/AuthContext';

const mockPost = jest.fn();

jest.mock('axios', () => {
  let requestInterceptor = null;

  const createMockInstance = () => ({
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
    },
  });

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => createMockInstance()),
    },
  };
});

const TEST_JWT = 'test-jwt-token-abc123';

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
    mockPost.mockReset();
    mockPost.mockResolvedValue({
      data: {
        choices: [{ message: { content: 'Mocked AI response' } }],
      },
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders the message input and send button in an authenticated context', () => {
    renderAuthenticatedChat();

    expect(screen.getByRole('heading', { name: /AI Chat/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Message input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  test('lets the user type a message and click send', async () => {
    renderAuthenticatedChat();

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

    await userEvent.type(screen.getByLabelText('Message input'), 'Trigger error');
    await userEvent.click(screen.getByRole('button', { name: /Send/i }));

    expect(await screen.findByText('Unauthorized chat access')).toBeInTheDocument();
    expect(screen.getByLabelText('Error message')).toBeInTheDocument();
  });
});
