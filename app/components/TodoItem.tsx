'use client';

import type { Todo } from '../lib/types';

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
};

export default function TodoItem({ todo, onToggle }: Props) {
  return (
    <li className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-foreground/5">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 cursor-pointer accent-foreground"
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span
        className={
          todo.completed
            ? 'text-sm text-foreground/50 line-through'
            : 'text-sm'
        }
      >
        {todo.text}
      </span>
    </li>
  );
}
