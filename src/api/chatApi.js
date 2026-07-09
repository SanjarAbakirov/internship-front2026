import apiClient from './apiClient';

export async function sendChatMessage(message) {
  const response = await apiClient.post('/api/chat', { message });
  return response.data?.choices?.[0]?.message?.content || 'No reply received.';
}

export function getChatErrorMessage(error) {
  return error.response?.data?.error || error.message || 'Something went wrong.';
}
