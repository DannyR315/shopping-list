import './MealCard.css';

export default function MealCard({ meal, selected, onSelect, onView }) {
  return (
    <div
      className={`meal-card ${selected ? 'meal-card--selected' : ''}`}
      onClick={onSelect}
    >
      <button
        className="meal-card__view"
        onClick={(e) => { e.stopPropagation(); onView(); }}
        aria-label="View meal details"
      >
        <EyeIcon />
      </button>

      {selected && (
        <div className="meal-card__check">
          <CheckIcon />
        </div>
      )}

      <div className="meal-card__body">
        <span className="meal-card__name">{meal.name}</span>
        <span className="meal-card__meta">
          {meal.ingredients?.length ?? 0} ingredient{meal.ingredients?.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
