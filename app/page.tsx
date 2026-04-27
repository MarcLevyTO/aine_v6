'use client';

import { useEffect, useState } from 'react';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import { loadTodos, saveTodos } from './lib/storage';
import type { Todo } from './lib/types';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    // architecture mandates: useState([]) initial, then setTodos(loadTodos()) in mount-effect
    // (loadTodos touches localStorage, which is client-only — must run after hydration)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodos(loadTodos());
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  function handleAdd(text: string) {
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ]);
  }

  function handleToggle(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Aine</h1>

        <AddTodoForm onAdd={handleAdd} />

        <TodoList todos={todos} onToggle={handleToggle} />
      </div>
    </main>
  );
}
