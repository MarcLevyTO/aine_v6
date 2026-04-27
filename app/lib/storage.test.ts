import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadTodos, saveTodos } from './storage';
import type { Todo } from './types';

const STORAGE_KEY = 'aine.todos.v1';

describe('loadTodos', () => {
  it('returns empty array when storage is empty', () => {
    expect(loadTodos()).toEqual([]);
  });

  it('returns persisted todos when storage holds valid data', () => {
    const todos: Todo[] = [
      { id: 'a', text: 'Buy milk', completed: false },
      { id: 'b', text: 'Walk dog', completed: true },
    ];
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, todos }),
    );
    expect(loadTodos()).toEqual(todos);
  });

  it('returns empty array on malformed JSON, with a warning', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(loadTodos()).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('returns empty array when version is unrecognized, with a warning', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 99, todos: [] }),
    );
    expect(loadTodos()).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('returns empty array when shape is wrong, with a warning', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, todos: 'not-an-array' }),
    );
    expect(loadTodos()).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe('saveTodos', () => {
  it('writes a versioned wrapper to storage', () => {
    const todos: Todo[] = [{ id: 'x', text: 'Test', completed: false }];
    saveTodos(todos);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!)).toEqual({ version: 1, todos });
  });

  it('logs a warning and does not throw when storage throws', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const setItemSpy = vi
      .spyOn(localStorage, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded');
      });
    expect(() => saveTodos([])).not.toThrow();
    expect(warnSpy).toHaveBeenCalled();
    setItemSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
