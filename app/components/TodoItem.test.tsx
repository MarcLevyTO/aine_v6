import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from './TodoItem';
import type { Todo } from '../lib/types';

const incomplete: Todo = { id: 'a', text: 'Buy milk', completed: false };
const complete: Todo = { id: 'b', text: 'Walk dog', completed: true };

describe('TodoItem', () => {
  it('renders the todo text', () => {
    render(<TodoItem todo={incomplete} onToggle={() => {}} />);
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('shows checkbox unchecked for an incomplete todo', () => {
    render(<TodoItem todo={incomplete} onToggle={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('shows checkbox checked for a complete todo', () => {
    render(<TodoItem todo={complete} onToggle={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('applies line-through styling to a complete todo', () => {
    render(<TodoItem todo={complete} onToggle={() => {}} />);
    const text = screen.getByText('Walk dog');
    expect(text.className).toContain('line-through');
  });

  it('calls onToggle with the todo id when the checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<TodoItem todo={incomplete} onToggle={onToggle} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('a');
  });
});
