import { useState } from 'react';
import { detectCategory } from '../utils/categories';
import { CATEGORIES } from '../utils/categories';
import './AddItem.css';

const MAX_CHARS = 80;

export default function AddItem({ onAdd }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  }

  const remaining = MAX_CHARS - text.length;
  const detectedKey = text.trim() ? detectCategory(text) : null;
  const detectedCat = detectedKey ? CATEGORIES[detectedKey] : null;

  return (
    <div className="add-item">
      <form onSubmit={handleSubmit} className="add-item__form">
        <input
          type="text"
          className="add-item__input"
          placeholder="Add an item..."
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          maxLength={MAX_CHARS}
        />
        <button
          type="submit"
          className="add-item__button"
          disabled={!text.trim()}
          aria-label="Add item"
        >
          +
        </button>
      </form>
      {text.length > 0 && (
        <div className="add-item__footer">
          {detectedCat && (
            <span className={`add-item__category-preview add-item__category-preview--${detectedKey}`}>
              {detectedCat.emoji} {detectedCat.label}
            </span>
          )}
          <p className={`add-item__counter ${remaining <= 10 ? 'add-item__counter--warn' : ''}`}>
            {remaining} left
          </p>
        </div>
      )}
    </div>
  );
}
