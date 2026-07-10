const CHAT_HISTORY_PREFIX = 'chat-history';

function getStorageKey() {
  const token = localStorage.getItem('jwt');
  if (!token) return null;
  return `${CHAT_HISTORY_PREFIX}-${token.slice(-16)}`;
}

function isValidMessage(message) {
  return (
    message &&
    typeof message.id === 'string' &&
    typeof message.role === 'string' &&
    typeof message.content === 'string'
  );
}

export function loadChatHistory() {
  const storageKey = getStorageKey();
  if (!storageKey) return [];

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidMessage);
  } catch {
    return [];
  }
}

export function saveChatHistory(messages) {
  const storageKey = getStorageKey();
  if (!storageKey) return;

  localStorage.setItem(storageKey, JSON.stringify(messages));
}

export function clearChatHistory() {
  const storageKey = getStorageKey();
  if (!storageKey) return;

  localStorage.removeItem(storageKey);
}
