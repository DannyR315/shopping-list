import './MealCard.css';

export default function MealCard({ meal, selected, onSelect, onView }) {
  return (
    <div
      className={`meal-card ${selected ? 'meal-card--selected' : ''}`}
      onClick={onSelect}
    >
      {meal.photoURL ? (
        <img src={meal.photoURL} className="meal-card__photo" alt={meal.name} />
      ) : (
        <div className="meal-card__placeholder">🍽️</div>
      )}

      <div className="meal-card__overlay" />

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

      {meal.suggested && !selected && (
        <div className="meal-card__suggested" title="Suggested meal">
          <GlobeIcon />
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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
