let messageCounter = 0;

export function createMessage(role, content) {
  messageCounter += 1;
  const uniqueSuffix =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${messageCounter}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    id: `msg-${uniqueSuffix}`,
    role,
    content,
    createdAt: Date.now(),
  };
}
