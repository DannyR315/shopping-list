import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './ItemCard.css';

const MAX_CHARS = 80;

export default function ItemCard({ item, onComplete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const inputRef = useRef(null);
  const isMealItem = item.itemType === 'meal';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function handleCardClick(e) {
    if (e.target.closest('.item-card__tick') || e.target.closest('.item-card__drag')) return;
    if (isMealItem) return; // meal items are not manually editable
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
      ref={setNodeRef}
      style={style}
      className={`item-card ${isMealItem ? 'item-card--meal' : ''} ${isDragging ? 'item-card--dragging' : ''}`}
    >
      <button
        className="item-card__drag"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        tabIndex={-1}
      >
        <DragIcon />
      </button>

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
          <span className="item-card__text">{item.text}</span>
        )}
      </div>

      <button
        className="item-card__tick"
        onClick={() => onComplete(item.id)}
        aria-label="Mark as done"
      >
        <TickIcon />
      </button>
    </div>
  );
}

function DragIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="16" x2="20" y2="16" />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
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
