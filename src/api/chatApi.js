import apiClient from './apiClient';

export async function sendChatMessage(message) {
  const response = await apiClient.post('/api/chat', { message });
  return response.data?.reply || 'No reply received.';
}

export function getChatErrorMessage(error) {
  return error.response?.data?.error || error.message || 'Something went wrong.';
}
