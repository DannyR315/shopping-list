import { useState, useEffect, useRef } from 'react';
import './MealModal.css';

const UNITS = ['g', 'kg', 'ml', 'L', 'pcs', 'tbsp', 'tsp', 'cup', 'handful', 'pinch'];

function IngredientRow({ ingredient, index, suggestions, onChange, onRemove }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filtered = ingredient.name.length > 0
    ? suggestions.filter(s => s.toLowerCase().includes(ingredient.name.toLowerCase()) && s.toLowerCase() !== ingredient.name.toLowerCase())
    : [];

  return (
    <div className="ingredient-row">
      <div className="ingredient-row__name-wrap">
        <input
          className="ingredient-row__name"
          placeholder="Ingredient name"
          value={ingredient.name}
          onChange={e => onChange(index, 'name', e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        {showSuggestions && filtered.length > 0 && (
          <ul className="ingredient-row__suggestions">
            {filtered.slice(0, 5).map(s => (
              <li key={s} onMouseDown={() => onChange(index, 'name', s)}>
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        className="ingredient-row__qty"
        type="number"
        placeholder="Qty"
        value={ingredient.quantity}
        onChange={e => onChange(index, 'quantity', e.target.value)}
        min="0"
        inputMode="decimal"
      />
      <select
        className="ingredient-row__unit"
        value={ingredient.unit}
        onChange={e => onChange(index, 'unit', e.target.value)}
      >
        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
      <button className="ingredient-row__remove" onClick={() => onRemove(index)} aria-label="Remove ingredient">
        <RemoveIcon />
      </button>
    </div>
  );
}

export default function MealModal({ meal, ingredientSuggestions, onSave, onDelete, onClose }) {
  const isNew = meal === null;
  const [name, setName] = useState(meal?.name ?? '');
  const [ingredients, setIngredients] = useState(
    meal?.ingredients?.length > 0 ? meal.ingredients : []
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    if (isNew) nameRef.current?.focus();
  }, [isNew]);

  function handleIngredientChange(index, field, value) {
    setIngredients(prev =>
      prev.map((ing, i) =>
        i === index
          ? { ...ing, [field]: field === 'quantity' ? value : value }
          : ing
      )
    );
  }

  function handleAddIngredient() {
    setIngredients(prev => [...prev, { name: '', quantity: '', unit: 'g' }]);
  }

  function handleRemoveIngredient(index) {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    if (!name.trim()) return;
    const validIngredients = ingredients.filter(i => i.name.trim() && i.quantity !== '');
    onSave(
      { name: name.trim(), ingredients: validIngredients.map(i => ({ ...i, quantity: Number(i.quantity) })) },
      meal?.id ?? null
    );
  }

  return (
    <div className="meal-modal__overlay" onClick={onClose}>
      <div className="meal-modal" onClick={e => e.stopPropagation()}>
        <div className="meal-modal__header">
          <h2 className="meal-modal__title">{isNew ? 'New Meal' : 'Edit Meal'}</h2>
          <button className="meal-modal__close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="meal-modal__body">
          <label className="meal-modal__label">Meal name</label>
          <input
            ref={nameRef}
            className="meal-modal__name-input"
            placeholder="e.g. Pasta Bake"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label className="meal-modal__label">Ingredients</label>
          <div className="meal-modal__ingredients">
            {ingredients.length === 0 && (
              <p className="meal-modal__no-ingredients">No ingredients yet. Add one below.</p>
            )}
            {ingredients.map((ing, i) => (
              <IngredientRow
                key={i}
                index={i}
                ingredient={ing}
                suggestions={ingredientSuggestions}
                onChange={handleIngredientChange}
                onRemove={handleRemoveIngredient}
              />
            ))}
          </div>
          <button className="meal-modal__add-ingredient" onClick={handleAddIngredient}>
            + Add ingredient
          </button>
        </div>

        <div className="meal-modal__footer">
          {!isNew && (
            confirmDelete ? (
              <div className="meal-modal__confirm-delete">
                <span>Delete this meal?</span>
                <button className="meal-modal__confirm-yes" onClick={() => onDelete(meal.id)}>Yes, delete</button>
                <button className="meal-modal__confirm-no" onClick={() => setConfirmDelete(false)}>Cancel</button>
              </div>
            ) : (
              <button className="meal-modal__delete" onClick={() => setConfirmDelete(true)}>
                Delete meal
              </button>
            )
          )}
          <button
            className="meal-modal__save"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            {isNew ? 'Add meal' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
