import { useState } from 'react';
import { nanoid } from 'nanoid';

/**
 * Representation of user feedback on templates, AI outputs or published apps.
 */
export interface FeedbackItem {
  id: string;
  rating: number; // 1–5 stars
  comment: string;
  createdAt: string;
  author?: string;
}

/**
 * Hook to manage feedback items. Supports adding new feedback,
 * updating existing items (e.g. editing a comment), and removing
 * feedback. Maintains a log for demonstration.
 */
export function useFeedbackSystem() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  /**
   * Submit a new feedback item.
   */
  const addFeedback = (rating: number, comment: string, author?: string) => {
    const id = nanoid();
    const createdAt = new Date().toISOString();
    const item: FeedbackItem = { id, rating, comment: comment.trim(), createdAt, author };
    setItems((prev) => [...prev, item]);
    setLogs((prev) => [
      `[${createdAt}] Added feedback (rating ${rating}): ${comment}`,
      ...prev,
    ]);
  };

  /**
   * Edit an existing feedback item. Only comment and rating can be changed.
   */
  const updateFeedback = (id: string, updates: Partial<Omit<FeedbackItem, 'id' | 'createdAt'>>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    setLogs((prev) => [
      `[${new Date().toISOString()}] Updated feedback ${id}`,
      ...prev,
    ]);
  };

  /**
   * Remove a feedback item from the list.
   */
  const removeFeedback = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setLogs((prev) => [
      `[${new Date().toISOString()}] Removed feedback ${id}`,
      ...prev,
    ]);
  };

  return { items, logs, addFeedback, updateFeedback, removeFeedback };
}