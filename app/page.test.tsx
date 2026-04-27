import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './page';

describe('Home (page)', () => {
  it('renders the heading and the empty state on first mount', async () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /aine/i })).toBeInTheDocument();
    // Empty state appears after mount-effect runs (load returns [])
    expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('adds a todo via the form and renders it in the list', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.type(
      screen.getByLabelText(/new todo text/i),
      'Buy milk{Enter}',
    );
    expect(await screen.findByText('Buy milk')).toBeInTheDocument();
  });

  it('toggles a todo to complete and back to incomplete', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.type(
      screen.getByLabelText(/new todo text/i),
      'Walk dog{Enter}',
    );
    const checkbox = await screen.findByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('persists todos across remounts (load on mount picks up saved state)', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Home />);
    await user.type(
      screen.getByLabelText(/new todo text/i),
      'Persist me{Enter}',
    );
    expect(await screen.findByText('Persist me')).toBeInTheDocument();
    unmount();

    render(<Home />);
    expect(await screen.findByText('Persist me')).toBeInTheDocument();
  });
});
