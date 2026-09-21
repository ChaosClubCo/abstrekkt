import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { useTheme } from '../hooks';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Mock matchMedia
const createMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('dark') ? matches : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

// Test component to access theme context
function ThemeConsumer() {
  const { theme, resolvedTheme, isDark, isSystem, toggle, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <span data-testid="is-dark">{isDark.toString()}</span>
      <span data-testid="is-system">{isSystem.toString()}</span>
      <button data-testid="toggle" onClick={toggle}>Toggle</button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>Light</button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>Dark</button>
      <button data-testid="set-system" onClick={() => setTheme('system')}>System</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should render children', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Child content</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should default to system theme', () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('is-system')).toHaveTextContent('true');
    });

    it('should use defaultTheme prop when provided', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <ThemeConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    });

    it('should read theme from localStorage if available', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('should use custom storageKey', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'custom-theme-key') return 'dark';
        return null;
      });

      render(
        <ThemeProvider storageKey="custom-theme-key">
          <ThemeConsumer />
        </ThemeProvider>
      );

      expect(localStorageMock.getItem).toHaveBeenCalledWith('custom-theme-key');
    });
  });

  describe('system theme detection', () => {
    it('should resolve to dark when system prefers dark', () => {
      Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(true) });

      render(
        <ThemeProvider defaultTheme="system">
          <ThemeConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    });

    it('should resolve to light when system prefers light', () => {
      Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });

      render(
        <ThemeProvider defaultTheme="system">
          <ThemeConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    });
  });

  describe('theme switching', () => {
    it('should toggle between light and dark', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');

      fireEvent.click(screen.getByTestId('toggle'));
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');

      fireEvent.click(screen.getByTestId('toggle'));
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    });

    it('should set theme via setTheme', async () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('set-dark'));
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      fireEvent.click(screen.getByTestId('set-light'));
      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      fireEvent.click(screen.getByTestId('set-system'));
      expect(screen.getByTestId('theme')).toHaveTextContent('system');
    });

    it('should persist theme to localStorage', async () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('set-dark'));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('document attribute', () => {
    it('should set data-theme attribute on document', async () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <ThemeConsumer />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });
    });

    it('should use class attribute when configured', async () => {
      render(
        <ThemeProvider defaultTheme="dark" attribute="class">
          <ThemeConsumer />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });
  });
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });
  });

  it('should render toggle button', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should have correct aria-label for light mode', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('should have correct aria-label for dark mode', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('should toggle theme on click', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');

    fireEvent.click(screen.getByRole('button', { name: /switch to dark/i }));

    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
  });

  it('should render in different sizes', () => {
    const { rerender } = render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle size="sm" />
      </ThemeProvider>
    );

    expect(screen.getByRole('button').className).toContain('w-8');

    rerender(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle size="md" />
      </ThemeProvider>
    );
    expect(screen.getByRole('button').className).toContain('w-10');

    rerender(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle size="lg" />
      </ThemeProvider>
    );
    expect(screen.getByRole('button').className).toContain('w-12');
  });

  it('should show label when showLabel is true', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle showLabel />
      </ThemeProvider>
    );

    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('should show correct label for dark mode', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeToggle showLabel />
      </ThemeProvider>
    );

    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle className="custom-class" />
      </ThemeProvider>
    );

    expect(screen.getByRole('button').className).toContain('custom-class');
  });
});

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });
  });

  it('should render dropdown button', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
  });

  it('should show current theme label', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('should open dropdown on click', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { expanded: false });
    fireEvent.click(button);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /system/i })).toBeInTheDocument();
  });

  it('should select theme from dropdown', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeSwitcher />
        <ThemeConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { expanded: false }));
    fireEvent.click(screen.getByRole('option', { name: /dark/i }));

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('should close dropdown after selection', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { expanded: false }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('option', { name: /dark/i }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should close dropdown on Escape key', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { expanded: false });
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(button.parentElement!, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should close dropdown on outside click', async () => {
    render(
      <div>
        <ThemeProvider defaultTheme="light">
          <ThemeSwitcher />
        </ThemeProvider>
        <button data-testid="outside">Outside</button>
      </div>
    );

    fireEvent.click(screen.getByRole('button', { expanded: false }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should mark current theme as selected', async () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { expanded: false }));

    const darkOption = screen.getByRole('option', { name: /dark/i });
    expect(darkOption).toHaveAttribute('aria-selected', 'true');
  });

  it('should hide label when showLabel is false', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeSwitcher showLabel={false} />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { expanded: false });
    expect(button.textContent).not.toContain('Light');
  });

  it('should accept custom className', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeSwitcher className="custom-class" />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { expanded: false }).parentElement?.className).toContain('custom-class');
  });
});

describe('useTheme hook error handling', () => {
  it('should throw error when used outside ThemeProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ThemeConsumer />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleError.mockRestore();
  });
});
