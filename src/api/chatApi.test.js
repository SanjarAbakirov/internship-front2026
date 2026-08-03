import { vi } from 'vitest';
import { fetchChatSession, fetchChatSessions, mapApiMessage, sendChatMessage } from './chatApi';

vi.mock('./apiClient', () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import apiClient from './apiClient';

describe('chatApi', () => {
  beforeEach(() => {
    apiClient.get.mockReset();
    apiClient.post.mockReset();
  });

  test('mapApiMessage normalizes backend roles', () => {
    expect(mapApiMessage({ id: '1', role: 'USER', content: 'Hi' }).role).toBe('user');
    expect(mapApiMessage({ id: '2', role: 'ASSISTANT', content: 'Hello' }).role).toBe('assistant');
  });

  test('fetchChatSessions returns normalized sessions', async () => {
    apiClient.get.mockResolvedValue({
      data: [{ id: 's1', title: 'First chat', updatedAt: '2026-07-01T00:00:00.000Z' }],
    });

    const sessions = await fetchChatSessions();

    expect(apiClient.get).toHaveBeenCalledWith('/api/chat/sessions');
    expect(sessions).toEqual([
      { id: 's1', title: 'First chat', updatedAt: '2026-07-01T00:00:00.000Z' },
    ]);
  });

  test('fetchChatSession returns mapped messages', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        id: 's1',
        messages: [{ id: 'm1', role: 'USER', content: 'Question' }],
      },
    });

    const session = await fetchChatSession('s1');

    expect(apiClient.get).toHaveBeenCalledWith('/api/chat/sessions/s1');
    expect(session.messages[0]).toMatchObject({
      id: 'm1',
      role: 'user',
      content: 'Question',
    });
  });

  test('sendChatMessage includes sessionId when provided', async () => {
    apiClient.post.mockResolvedValue({
      data: { reply: 'Answer', sessionId: 's1' },
    });

    const result = await sendChatMessage('Hello', 's1');

    expect(apiClient.post).toHaveBeenCalledWith('/api/chat', {
      message: 'Hello',
      sessionId: 's1',
    });
    expect(result).toEqual({ reply: 'Answer', sessionId: 's1' });
  });
});
