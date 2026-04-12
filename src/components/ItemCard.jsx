import { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '../utils/categories';
import './ItemCard.css';

const MAX_CHARS = 80;

export default function ItemCard({ item, onTick, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const inputRef = useRef(null);
  const isMealItem = item.itemType === 'meal';
  const isTicked = !!item.ticked;
  const category = CATEGORIES[item.category ?? 'other'];

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function handleCardClick(e) {
    if (e.target.closest('.item-card__tick') || e.target.closest('.item-card__drag') || e.target.closest('.item-card__category')) return;
    if (isMealItem || isTicked) return;
    setEditing(true);
    setEditText(item.text);
  }

  function handleEditSave() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== item.text) {
      onEdit(item.id, trimmed);
    }
    setEditing(false);
  }

  function handleEditKeyDown(e) {
    if (e.key === 'Enter') handleEditSave();
    if (e.key === 'Escape') setEditing(false);
  }

  return (
    <div
      className={`item-card item-card--cat-${item.category ?? 'other'} ${isMealItem ? 'item-card--meal' : ''} ${isTicked ? 'item-card--ticked' : ''}`}
    >

      <div className="item-card__content" onClick={handleCardClick}>
        {isMealItem && item.mealSources?.length > 0 && (
          <span className="item-card__meal-source">
            <MealIcon /> {item.mealSources.join(', ')}
          </span>
        )}
        {editing ? (
          <input
            ref={inputRef}
            className="item-card__edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value.slice(0, MAX_CHARS))}
            onBlur={handleEditSave}
            onKeyDown={handleEditKeyDown}
            maxLength={MAX_CHARS}
          />
        ) : (
          <span className={`item-card__text ${isTicked ? 'item-card__text--ticked' : ''}`}>
            {item.text}
          </span>
        )}
      </div>

      <button
        className={`item-card__tick ${isTicked ? 'item-card__tick--ticked' : ''}`}
        onClick={() => onTick(item.id)}
        aria-label={isTicked ? 'Undo tick' : 'Tick item'}
      >
        <TickIcon filled={isTicked} />
      </button>
    </div>
  );
}

function TickIcon({ filled }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" stroke={filled ? '#fff' : 'currentColor'} strokeWidth="2.5" />
    </svg>
  );
}

function MealIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  );
}
