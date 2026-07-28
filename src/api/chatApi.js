import apiClient from './apiClient';

function normalizeRole(role) {
  const normalized = String(role || '').toLowerCase();

  if (normalized === 'user' || normalized === 'assistant' || normalized === 'error') {
    return normalized;
  }

  return 'assistant';
}

export function mapApiMessage(apiMessage) {
  return {
    id: apiMessage.id || `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role: normalizeRole(apiMessage.role),
    content: apiMessage.content || '',
    createdAt: apiMessage.createdAt ? new Date(apiMessage.createdAt).getTime() : Date.now(),
  };
}

function normalizeSession(session) {
  return {
    id: session.id || session.sessionId,
    title: session.title || session.preview || 'Untitled conversation',
    updatedAt: session.updatedAt || session.createdAt || null,
  };
}

export async function fetchChatSessions() {
  const response = await apiClient.get('/api/chat/sessions');
  const payload = response.data;
  const sessions = Array.isArray(payload) ? payload : payload?.sessions || [];

  return sessions
    .map(normalizeSession)
    .filter((session) => Boolean(session.id));
}

export async function fetchChatSession(sessionId) {
  const response = await apiClient.get(`/api/chat/sessions/${sessionId}`);
  const payload = response.data;
  const rawMessages = payload?.messages || [];

  return {
    id: payload?.id || payload?.sessionId || sessionId,
    messages: rawMessages.map(mapApiMessage),
  };
}

export async function sendChatMessage(message, sessionId = null) {
  const body = { message };

  if (sessionId) {
    body.sessionId = sessionId;
  }

  const response = await apiClient.post('/api/chat', body);

  return {
    reply: response.data?.reply || 'No reply received.',
    sessionId: response.data?.sessionId || sessionId || null,
  };
}

export function getChatErrorMessage(error) {
  return error.response?.data?.error || error.message || 'Something went wrong.';
}
