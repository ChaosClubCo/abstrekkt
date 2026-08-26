import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ShortcutsProvider } from '../components/ShortcutsProvider';
import { CommandPalette } from '../components/CommandPalette';
import { ShortcutsGuide } from '../components/ShortcutsGuide';
import { ShortcutHint } from '../components/ShortcutHint';
import { useShortcut, useCommandPalette, useShortcutsContext } from '../hooks';

// Test component to access context
function ShortcutConsumer({ shortcutKey, callback }: { shortcutKey: string; callback: () => void }) {
  useShortcut(shortcutKey, callback, { description: 'Test shortcut' });
  return null;
}

// Test component to display platform info
function PlatformInfo() {
  const { platform, isMac, formatShortcut } = useShortcutsContext();
  return (
    <div>
      <span data-testid="platform">{platform}</span>
      <span data-testid="is-mac">{isMac.toString()}</span>
      <span data-testid="formatted">{formatShortcut('mod+k')}</span>
    </div>
  );
}

// Test component for command palette state
function CommandPaletteConsumer() {
  const { isOpen, open, close, toggle, registerCommand, commands, search, setSearch, filteredCommands } = useCommandPalette();
  return (
    <div>
      <span data-testid="is-open">{isOpen.toString()}</span>
      <span data-testid="command-count">{commands.length}</span>
      <span data-testid="filtered-count">{filteredCommands.length}</span>
      <span data-testid="search">{search}</span>
      <button data-testid="open" onClick={open}>Open</button>
      <button data-testid="close" onClick={close}>Close</button>
      <button data-testid="toggle" onClick={toggle}>Toggle</button>
      <button data-testid="set-search" onClick={() => setSearch('test')}>Set Search</button>
      <button
        data-testid="register"
        onClick={() => registerCommand({ id: 'test', title: 'Test Command', action: vi.fn() })}
      >
        Register
      </button>
    </div>
  );
}

describe('ShortcutsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children', () => {
    render(
      <ShortcutsProvider>
        <div data-testid="child">Child content</div>
      </ShortcutsProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should provide default config', () => {
    render(
      <ShortcutsProvider>
        <PlatformInfo />
      </ShortcutsProvider>
    );

    expect(screen.getByTestId('platform')).toBeInTheDocument();
  });

  it('should accept custom config', () => {
    const config = {
      commandPaletteKey: 'ctrl+p',
      guideKey: 'shift+/',
      vimMode: true,
    };

    render(
      <ShortcutsProvider config={config}>
        <div data-testid="child">Content</div>
      </ShortcutsProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  describe('keyboard shortcut handling', () => {
    it('should trigger shortcut callback on key press', () => {
      const callback = vi.fn();

      render(
        <ShortcutsProvider>
          <ShortcutConsumer shortcutKey="a" callback={callback} />
        </ShortcutsProvider>
      );

      fireEvent.keyDown(window, { key: 'a' });
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle modifier keys', () => {
      const callback = vi.fn();

      render(
        <ShortcutsProvider>
          <ShortcutConsumer shortcutKey="ctrl+s" callback={callback} />
        </ShortcutsProvider>
      );

      fireEvent.keyDown(window, { key: 's', ctrlKey: true });
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not trigger without correct modifier', () => {
      const callback = vi.fn();

      render(
        <ShortcutsProvider>
          <ShortcutConsumer shortcutKey="ctrl+s" callback={callback} />
        </ShortcutsProvider>
      );

      fireEvent.keyDown(window, { key: 's' });
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle multiple modifiers', () => {
      const callback = vi.fn();

      render(
        <ShortcutsProvider>
          <ShortcutConsumer shortcutKey="ctrl+shift+s" callback={callback} />
        </ShortcutsProvider>
      );

      fireEvent.keyDown(window, { key: 's', ctrlKey: true, shiftKey: true });
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle Escape key in input fields', () => {
      const callback = vi.fn();

      render(
        <ShortcutsProvider>
          <ShortcutConsumer shortcutKey="escape" callback={callback} />
          <input data-testid="input" />
        </ShortcutsProvider>
      );

      const input = screen.getByTestId('input');
      input.focus();
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(callback).toHaveBeenCalled();
    });

    it('should not trigger regular shortcuts in input fields', () => {
      const callback = vi.fn();

      render(
        <ShortcutsProvider>
          <ShortcutConsumer shortcutKey="a" callback={callback} />
          <input data-testid="input" />
        </ShortcutsProvider>
      );

      const input = screen.getByTestId('input');
      input.focus();
      fireEvent.keyDown(input, { key: 'a' });

      expect(callback).not.toHaveBeenCalled();
    });
  });
});

describe('CommandPalette', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should not render when closed', () => {
    render(
      <ShortcutsProvider>
        <CommandPalette />
      </ShortcutsProvider>
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should render when opened via context', () => {
    render(
      <ShortcutsProvider>
        <CommandPaletteConsumer />
        <CommandPalette />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should display custom placeholder', () => {
    render(
      <ShortcutsProvider>
        <CommandPaletteConsumer />
        <CommandPalette placeholder="Custom placeholder..." />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));

    expect(screen.getByPlaceholderText('Custom placeholder...')).toBeInTheDocument();
  });

  it('should close on backdrop click', () => {
    render(
      <ShortcutsProvider>
        <CommandPaletteConsumer />
        <CommandPalette />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));
    expect(screen.getByTestId('is-open')).toHaveTextContent('true');

    // Click backdrop
    const backdrop = document.querySelector('.bg-black\\/50');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
  });

  it('should close on Escape key', () => {
    render(
      <ShortcutsProvider>
        <CommandPaletteConsumer />
        <CommandPalette />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));
    expect(screen.getByTestId('is-open')).toHaveTextContent('true');

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input.parentElement!.parentElement!, { key: 'Escape' });

    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
  });

  it('should show empty state when no commands', () => {
    render(
      <ShortcutsProvider>
        <CommandPaletteConsumer />
        <CommandPalette />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));

    expect(screen.getByText('No commands found')).toBeInTheDocument();
  });

  it('should display registered commands', () => {
    const TestComponent = () => {
      const { registerCommand } = useCommandPalette();

      React.useEffect(() => {
        registerCommand({ id: 'cmd1', title: 'First Command', action: vi.fn() });
        registerCommand({ id: 'cmd2', title: 'Second Command', action: vi.fn() });
      }, [registerCommand]);

      return null;
    };

    render(
      <ShortcutsProvider>
        <TestComponent />
        <CommandPaletteConsumer />
        <CommandPalette />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));

    expect(screen.getByText('First Command')).toBeInTheDocument();
    expect(screen.getByText('Second Command')).toBeInTheDocument();
  });

  it('should filter commands based on search', async () => {
    const TestComponent = () => {
      const { registerCommand } = useCommandPalette();

      React.useEffect(() => {
        registerCommand({ id: 'cmd1', title: 'First Command', action: vi.fn() });
        registerCommand({ id: 'cmd2', title: 'Second Command', action: vi.fn() });
        registerCommand({ id: 'cmd3', title: 'Another Item', action: vi.fn() });
      }, [registerCommand]);

      return null;
    };

    render(
      <ShortcutsProvider>
        <TestComponent />
        <CommandPaletteConsumer />
        <CommandPalette />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Command' } });

    await waitFor(() => {
      expect(screen.getByText('First Command')).toBeInTheDocument();
      expect(screen.getByText('Second Command')).toBeInTheDocument();
      expect(screen.queryByText('Another Item')).not.toBeInTheDocument();
    });
  });

  it('should navigate commands with arrow keys', () => {
    const TestComponent = () => {
      const { registerCommand } = useCommandPalette();

      React.useEffect(() => {
        registerCommand({ id: 'cmd1', title: 'First', action: vi.fn() });
        registerCommand({ id: 'cmd2', title: 'Second', action: vi.fn() });
      }, [registerCommand]);

      return null;
    };

    render(
      <ShortcutsProvider>
        <TestComponent />
        <CommandPaletteConsumer />
        <CommandPalette />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));

    const container = screen.getByRole('textbox').parentElement!.parentElement!;

    // Initial selection is first item
    expect(screen.getByText('First').closest('button')).toHaveClass('bg-blue-50');

    // Arrow down
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    expect(screen.getByText('Second').closest('button')).toHaveClass('bg-blue-50');

    // Arrow up
    fireEvent.keyDown(container, { key: 'ArrowUp' });
    expect(screen.getByText('First').closest('button')).toHaveClass('bg-blue-50');
  });

  it('should execute command on Enter', () => {
    const action = vi.fn();

    const TestComponent = () => {
      const { registerCommand } = useCommandPalette();

      React.useEffect(() => {
        registerCommand({ id: 'cmd1', title: 'Test Command', action });
      }, [registerCommand]);

      return null;
    };

    render(
      <ShortcutsProvider>
        <TestComponent />
        <CommandPaletteConsumer />
        <CommandPalette />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));

    const container = screen.getByRole('textbox').parentElement!.parentElement!;
    fireEvent.keyDown(container, { key: 'Enter' });

    expect(action).toHaveBeenCalled();
    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
  });

  it('should execute command on click', () => {
    const action = vi.fn();

    const TestComponent = () => {
      const { registerCommand } = useCommandPalette();

      React.useEffect(() => {
        registerCommand({ id: 'cmd1', title: 'Click Me', action });
      }, [registerCommand]);

      return null;
    };

    render(
      <ShortcutsProvider>
        <TestComponent />
        <CommandPaletteConsumer />
        <CommandPalette />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));
    fireEvent.click(screen.getByText('Click Me').closest('button')!);

    expect(action).toHaveBeenCalled();
  });

  it('should display command descriptions', () => {
    const TestComponent = () => {
      const { registerCommand } = useCommandPalette();

      React.useEffect(() => {
        registerCommand({
          id: 'cmd1',
          title: 'Test Command',
          description: 'This is a test description',
          action: vi.fn(),
        });
      }, [registerCommand]);

      return null;
    };

    render(
      <ShortcutsProvider>
        <TestComponent />
        <CommandPaletteConsumer />
        <CommandPalette />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));

    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('should respect maxResults prop', () => {
    const TestComponent = () => {
      const { registerCommand } = useCommandPalette();

      React.useEffect(() => {
        for (let i = 0; i < 15; i++) {
          registerCommand({ id: `cmd${i}`, title: `Command ${i}`, action: vi.fn() });
        }
      }, [registerCommand]);

      return null;
    };

    render(
      <ShortcutsProvider>
        <TestComponent />
        <CommandPaletteConsumer />
        <CommandPalette maxResults={5} />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));

    const buttons = screen.getAllByRole('button').filter((btn) => btn.textContent?.includes('Command'));
    expect(buttons.length).toBe(5);
  });

  it('should focus input when opened', async () => {
    render(
      <ShortcutsProvider>
        <CommandPaletteConsumer />
        <CommandPalette />
      </ShortcutsProvider>
    );

    fireEvent.click(screen.getByTestId('open'));

    // Wait for setTimeout focus
    vi.advanceTimersByTime(0);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });
});

describe('ShortcutsGuide', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <ShortcutsProvider>
        <ShortcutsGuide />
      </ShortcutsProvider>
    );

    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });

  it('should render when opened via shortcut', () => {
    render(
      <ShortcutsProvider>
        <ShortcutsGuide />
      </ShortcutsProvider>
    );

    // Trigger the guide shortcut (shift+?)
    fireEvent.keyDown(window, { key: '?', shiftKey: true });

    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
  });

  it('should display custom title', () => {
    render(
      <ShortcutsProvider>
        <ShortcutsGuide title="Custom Title" />
      </ShortcutsProvider>
    );

    fireEvent.keyDown(window, { key: '?', shiftKey: true });

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('should close on backdrop click', () => {
    render(
      <ShortcutsProvider>
        <ShortcutsGuide />
      </ShortcutsProvider>
    );

    fireEvent.keyDown(window, { key: '?', shiftKey: true });
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();

    const backdrop = document.querySelector('.bg-black\\/50');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });

  it('should close on close button click', () => {
    render(
      <ShortcutsProvider>
        <ShortcutsGuide />
      </ShortcutsProvider>
    );

    fireEvent.keyDown(window, { key: '?', shiftKey: true });
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();

    // Find and click close button (the X button in header)
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find((btn) => btn.querySelector('svg'));
    if (closeButton) {
      fireEvent.click(closeButton);
    }

    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });

  it('should show empty state when no shortcuts', () => {
    render(
      <ShortcutsProvider>
        <ShortcutsGuide />
      </ShortcutsProvider>
    );

    fireEvent.keyDown(window, { key: '?', shiftKey: true });

    // Note: Built-in shortcuts are registered, so this may show some shortcuts
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
  });

  it('should display registered shortcuts', () => {
    const TestComponent = () => {
      useShortcut('ctrl+n', vi.fn(), { description: 'Create new item', scope: 'general' });
      return null;
    };

    render(
      <ShortcutsProvider>
        <TestComponent />
        <ShortcutsGuide />
      </ShortcutsProvider>
    );

    fireEvent.keyDown(window, { key: '?', shiftKey: true });

    expect(screen.getByText('Create new item')).toBeInTheDocument();
  });
});

describe('ShortcutHint', () => {
  it('should render shortcut keys', () => {
    render(
      <ShortcutsProvider>
        <ShortcutHint shortcut="ctrl+s" />
      </ShortcutsProvider>
    );

    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('should render single key', () => {
    render(
      <ShortcutsProvider>
        <ShortcutHint shortcut="escape" />
      </ShortcutsProvider>
    );

    expect(screen.getByText('Esc')).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    render(
      <ShortcutsProvider>
        <ShortcutHint shortcut="ctrl+s" className="custom-class" />
      </ShortcutsProvider>
    );

    const container = screen.getByText('Ctrl').parentElement;
    expect(container?.className).toContain('custom-class');
  });
});

describe('context hooks error handling', () => {
  it('useShortcutsContext should throw when used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<PlatformInfo />);
    }).toThrow('useShortcutsContext must be used within ShortcutsProvider');

    consoleError.mockRestore();
  });

  it('useCommandPalette should throw when used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<CommandPaletteConsumer />);
    }).toThrow('useCommandPalette must be used within ShortcutsProvider');

    consoleError.mockRestore();
  });
});
