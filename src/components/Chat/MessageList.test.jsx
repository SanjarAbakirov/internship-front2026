import { render, screen } from '@testing-library/react';
import MessageList from './MessageList';

const sampleMessages = [
  { id: 'msg-1', role: 'user', content: 'Hello' },
  { id: 'msg-2', role: 'assistant', content: 'Hi there!' },
];

test('renders each message with a unique key and updates when messages change', () => {
  const { rerender } = render(<MessageList messages={[]} isLoading={false} />);

  expect(screen.getByText(/Send a message to start the conversation/i)).toBeInTheDocument();

  rerender(<MessageList messages={sampleMessages} isLoading={false} />);

  expect(screen.getByText('Hello')).toBeInTheDocument();
  expect(screen.getByText('Hi there!')).toBeInTheDocument();
  expect(screen.getByLabelText('Your message')).toHaveAttribute('data-message-id', 'msg-1');
  expect(screen.getByLabelText('AI reply')).toHaveAttribute('data-message-id', 'msg-2');
});

test('shows loading indicator while waiting for AI response', () => {
  render(<MessageList messages={sampleMessages} isLoading />);

  expect(screen.getByLabelText('AI reply')).toBeInTheDocument();
  expect(screen.getByLabelText('Your message')).toBeInTheDocument();
  expect(document.querySelector('[data-message-id="loading-indicator"]')).toBeInTheDocument();
});
