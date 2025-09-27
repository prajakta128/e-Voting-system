const sessions = new Set<string>();

export function createSession(token: string) {
  sessions.add(token);
}

export function hasSession(token: string | undefined | null): boolean {
  if (!token) return false;
  return sessions.has(token);
}

export function deleteSession(token: string) {
  sessions.delete(token);
}
