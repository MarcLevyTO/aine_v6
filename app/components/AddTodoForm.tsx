'use client';

import { useState, type FormEvent } from 'react';

type Props = {
  onAdd: (text: string) => void;
};

export default function AddTodoForm({ onAdd }: Props) {
  const [text, setText] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a todo…"
        className="flex-1 rounded-md border border-foreground/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/40"
        aria-label="New todo text"
      />
      <button
        type="submit"
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
      >
        Add
      </button>
    </form>
  );
}
