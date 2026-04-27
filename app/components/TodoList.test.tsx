import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from './TodoList';
import type { Todo } from '../lib/types';

describe('TodoList', () => {
  it('renders the empty state when there are no todos', () => {
    render(<TodoList todos={[]} onToggle={() => {}} />);
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('renders one item per todo, in order', () => {
    const todos: Todo[] = [
      { id: '1', text: 'first', completed: false },
      { id: '2', text: 'second', completed: false },
      { id: '3', text: 'third', completed: true },
    ];
    render(<TodoList todos={todos} onToggle={() => {}} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('first');
    expect(items[1]).toHaveTextContent('second');
    expect(items[2]).toHaveTextContent('third');
  });

  it('forwards onToggle through to its items', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const todos: Todo[] = [{ id: 'x', text: 'one', completed: false }];
    render(<TodoList todos={todos} onToggle={onToggle} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('x');
  });
});
