import {
  clearChatHistory,
  loadChatHistory,
  saveChatHistory,
} from './chatStorage';

const sampleMessages = [
  { id: 'msg-1', role: 'user', content: 'Hello' },
  { id: 'msg-2', role: 'assistant', content: 'Hi there!' },
];

describe('chatStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('jwt', 'test-jwt-token-abc123');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('saves and loads conversation history for the current user', () => {
    saveChatHistory(sampleMessages);

    expect(loadChatHistory()).toEqual(sampleMessages);
  });

  test('returns empty array when no history exists', () => {
    expect(loadChatHistory()).toEqual([]);
  });

  test('clears stored history', () => {
    saveChatHistory(sampleMessages);
    clearChatHistory();

    expect(loadChatHistory()).toEqual([]);
  });

  test('isolates history per authentication token', () => {
    saveChatHistory(sampleMessages);

    localStorage.setItem('jwt', 'another-user-token-xyz789');
    expect(loadChatHistory()).toEqual([]);
  });
});
