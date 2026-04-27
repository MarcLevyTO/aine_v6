import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTodoForm from './AddTodoForm';

describe('AddTodoForm', () => {
  it('calls onAdd with trimmed text and clears the input', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);

    const input = screen.getByLabelText(/new todo text/i);
    await user.type(input, '  Buy milk  ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith('Buy milk');
    expect(input).toHaveValue('');
  });

  it('submits when Enter is pressed', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);

    const input = screen.getByLabelText(/new todo text/i);
    await user.type(input, 'Walk dog{Enter}');

    expect(onAdd).toHaveBeenCalledWith('Walk dog');
  });

  it('does NOT call onAdd for empty input', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('does NOT call onAdd for whitespace-only input', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);

    await user.type(screen.getByLabelText(/new todo text/i), '   ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).not.toHaveBeenCalled();
  });
});
