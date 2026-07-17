import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFeedbackSystem } from '../hooks/useFeedbackSystem';

let nanoidCounter = 0;
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => `feedback-id-${++nanoidCounter}`),
}));

beforeEach(() => {
  nanoidCounter = 0;
});

describe('useFeedbackSystem', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should start with empty items array', () => {
      const { result } = renderHook(() => useFeedbackSystem());
      expect(result.current.items).toEqual([]);
    });

    it('should start with empty logs array', () => {
      const { result } = renderHook(() => useFeedbackSystem());
      expect(result.current.logs).toEqual([]);
    });

    it('should expose all required functions', () => {
      const { result } = renderHook(() => useFeedbackSystem());
      expect(typeof result.current.addFeedback).toBe('function');
      expect(typeof result.current.updateFeedback).toBe('function');
      expect(typeof result.current.removeFeedback).toBe('function');
    });
  });

  describe('addFeedback', () => {
    it('should add a feedback item', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'Great product!');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].rating).toBe(5);
      expect(result.current.items[0].comment).toBe('Great product!');
    });

    it('should trim comment', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(4, '  Nice feature  ');
      });

      expect(result.current.items[0].comment).toBe('Nice feature');
    });

    it('should include timestamp', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(3, 'Test');
      });

      expect(result.current.items[0].createdAt).toBe('2024-01-15T10:00:00.000Z');
    });

    it('should generate unique ID', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'Test');
      });

      expect(result.current.items[0].id).toBe('feedback-id-1');
    });

    it('should include author when provided', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'Great!', 'John Doe');
      });

      expect(result.current.items[0].author).toBe('John Doe');
    });

    it('should not include author when not provided', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'Great!');
      });

      expect(result.current.items[0].author).toBeUndefined();
    });

    it('should add log entry', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(4, 'Good product');
      });

      expect(result.current.logs).toHaveLength(1);
      expect(result.current.logs[0]).toContain('Added feedback (rating 4)');
      expect(result.current.logs[0]).toContain('Good product');
    });

    it('should support all rating values 1-5', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      for (let rating = 1; rating <= 5; rating++) {
        act(() => {
          result.current.addFeedback(rating, `Rating ${rating}`);
        });
      }

      expect(result.current.items).toHaveLength(5);
      expect(result.current.items.map(i => i.rating)).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('updateFeedback', () => {
    it('should update comment', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'Original comment');
      });

      const id = result.current.items[0].id;

      act(() => {
        result.current.updateFeedback(id, { comment: 'Updated comment' });
      });

      expect(result.current.items[0].comment).toBe('Updated comment');
    });

    it('should update rating', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(3, 'Test');
      });

      const id = result.current.items[0].id;

      act(() => {
        result.current.updateFeedback(id, { rating: 5 });
      });

      expect(result.current.items[0].rating).toBe(5);
    });

    it('should update author', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'Test');
      });

      const id = result.current.items[0].id;

      act(() => {
        result.current.updateFeedback(id, { author: 'Jane Doe' });
      });

      expect(result.current.items[0].author).toBe('Jane Doe');
    });

    it('should not change id', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'Test');
      });

      const id = result.current.items[0].id;

      act(() => {
        result.current.updateFeedback(id, { comment: 'New comment' });
      });

      expect(result.current.items[0].id).toBe(id);
    });

    it('should not change createdAt', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'Test');
      });

      const id = result.current.items[0].id;
      const createdAt = result.current.items[0].createdAt;

      vi.advanceTimersByTime(1000);

      act(() => {
        result.current.updateFeedback(id, { comment: 'New comment' });
      });

      expect(result.current.items[0].createdAt).toBe(createdAt);
    });

    it('should add log entry', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'Test');
      });

      const id = result.current.items[0].id;

      act(() => {
        result.current.updateFeedback(id, { comment: 'Updated' });
      });

      expect(result.current.logs[0]).toContain(`Updated feedback ${id}`);
    });

    it('should only update the specified item', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'First');
        result.current.addFeedback(3, 'Second');
      });

      const firstId = result.current.items[0].id;

      act(() => {
        result.current.updateFeedback(firstId, { comment: 'First updated' });
      });

      expect(result.current.items[0].comment).toBe('First updated');
      expect(result.current.items[1].comment).toBe('Second');
    });
  });

  describe('removeFeedback', () => {
    it('should remove feedback item', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'To be removed');
      });

      const id = result.current.items[0].id;

      act(() => {
        result.current.removeFeedback(id);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should add log entry', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'Test');
      });

      const id = result.current.items[0].id;

      act(() => {
        result.current.removeFeedback(id);
      });

      expect(result.current.logs[0]).toContain(`Removed feedback ${id}`);
    });

    it('should only remove the specified item', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'First');
        result.current.addFeedback(4, 'Second');
        result.current.addFeedback(3, 'Third');
      });

      const secondId = result.current.items[1].id;
      const firstId = result.current.items[0].id;
      const thirdId = result.current.items[2].id;

      act(() => {
        result.current.removeFeedback(secondId);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items.find(i => i.id === secondId)).toBeUndefined();
      expect(result.current.items.find(i => i.id === firstId)).toBeDefined();
      expect(result.current.items.find(i => i.id === thirdId)).toBeDefined();
    });

    it('should handle removing non-existent item gracefully', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'Test');
      });

      act(() => {
        result.current.removeFeedback('non-existent-id');
      });

      // Item should still exist
      expect(result.current.items).toHaveLength(1);
    });
  });

  describe('logs ordering', () => {
    it('should prepend new logs (newest first)', () => {
      const { result } = renderHook(() => useFeedbackSystem());

      act(() => {
        result.current.addFeedback(5, 'First');
      });

      vi.advanceTimersByTime(1000);

      act(() => {
        result.current.addFeedback(4, 'Second');
      });

      expect(result.current.logs[0]).toContain('Second');
      expect(result.current.logs[1]).toContain('First');
    });
  });

  describe('state isolation', () => {
    it('should maintain separate state between hook instances', () => {
      const { result: result1 } = renderHook(() => useFeedbackSystem());
      const { result: result2 } = renderHook(() => useFeedbackSystem());

      act(() => {
        result1.current.addFeedback(5, 'Test');
      });

      expect(result1.current.items).toHaveLength(1);
      expect(result2.current.items).toHaveLength(0);
    });
  });
});
