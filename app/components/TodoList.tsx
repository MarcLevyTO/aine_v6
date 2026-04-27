'use client';

import type { Todo } from '../lib/types';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void;
};

export default function TodoList({ todos, onToggle }: Props) {
  if (todos.length === 0) {
    return (
      <p className="text-sm text-foreground/60">
        No todos yet — add one above.
      </p>
    );
  }

  return (
    <ul className="space-y-1">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
      ))}
    </ul>
  );
}
