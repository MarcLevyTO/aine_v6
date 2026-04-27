import type { StoredState, Todo } from './types';

const STORAGE_KEY = 'aine.todos.v1';

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredState;
    if (parsed.version !== 1 || !Array.isArray(parsed.todos)) {
      console.warn('[aine] storage shape unrecognized, starting fresh');
      return [];
    }
    return parsed.todos;
  } catch (err) {
    console.warn('[aine] storage parse failed, starting fresh', err);
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    const payload: StoredState = { version: 1, todos };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[aine] storage save failed', err);
  }
}
