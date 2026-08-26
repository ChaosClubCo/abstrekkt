import React, { useState } from 'react';
import { useFeedbackSystem } from '../hooks/useFeedbackSystem';

/**
 * Demo component for collecting and displaying user feedback. Users can
 * submit a rating (1–5 stars) and a comment. Existing feedback is
 * displayed in a list. This component is intended as a starting point
 * for a more robust feedback and review system that includes
 * moderation, persistence, and analytics.
 */
export const FeedbackSystem: React.FC = () => {
  const { items, logs, addFeedback, removeFeedback } = useFeedbackSystem();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    addFeedback(rating, comment);
    setRating(5);
    setComment('');
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8, maxWidth: 700 }}>
      <h2>Feedback & Review Demo</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ marginLeft: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
        <br />
        <textarea
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          style={{ width: '100%', marginTop: '0.5rem' }}
        ></textarea>
        <button onClick={handleSubmit} disabled={!comment.trim()} style={{ marginTop: '0.5rem' }}>
          Submit Feedback
        </button>
      </div>
      <div>
        <h3>Recent Feedback</h3>
        {items.length === 0 ? (
          <p>No feedback yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((item) => (
              <li key={item.id} style={{ marginBottom: '0.75rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                <strong>{item.rating} / 5</strong>
                <p style={{ margin: '0.25rem 0' }}>{item.comment}</p>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
                <div>
                  <button onClick={() => removeFeedback(item.id)} style={{ fontSize: '0.8rem', color: 'red' }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h4>Logs</h4>
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: 150, overflowY: 'auto', fontSize: '0.8rem' }}>
          {logs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedbackSystem;