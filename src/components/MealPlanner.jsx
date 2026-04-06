import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import MealCard from './MealCard';
import MealModal from './MealModal';
import './MealPlanner.css';

function stackIngredients(selectedMeals) {
  const stack = new Map();
  for (const meal of selectedMeals) {
    for (const ingredient of meal.ingredients ?? []) {
      const key = `${ingredient.name.toLowerCase()}|${ingredient.unit}`;
      if (stack.has(key)) {
        const existing = stack.get(key);
        existing.quantity += Number(ingredient.quantity);
        if (!existing.mealSources.includes(meal.name)) {
          existing.mealSources.push(meal.name);
        }
      } else {
        stack.set(key, {
          name: ingredient.name,
          quantity: Number(ingredient.quantity),
          unit: ingredient.unit,
          category: ingredient.category ?? 'other',
          mealSources: [meal.name],
        });
      }
    }
  }
  return Array.from(stack.values());
}

export default function MealPlanner({ onBack, onCheckoutSuccess }) {
  const [meals, setMeals] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [modalMeal, setModalMeal] = useState(undefined); // undefined=closed, null=new, object=edit
  const [loading, setLoading] = useState(true);
  const [saveMealSuccess, setSaveMealSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'meals'), (snap) => {
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
      setMeals(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSaveMeal(mealData, existingId) {
    try {
      if (existingId) {
        await updateDoc(doc(db, 'meals', existingId), mealData);
      } else {
        await addDoc(collection(db, 'meals'), { ...mealData, createdAt: Date.now() });
      }
      setSaveMealSuccess(true);
      setTimeout(() => setSaveMealSuccess(false), 3000);
    } catch (err) {
      console.error('Save meal failed:', err);
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3500);
    } finally {
      setModalMeal(undefined);
    }
  }

  async function handleDeleteMeal(id) {
    await deleteDoc(doc(db, 'meals', id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    setModalMeal(undefined);
  }

  async function handleCheckout() {
    const selectedMeals = meals.filter(m => selected.has(m.id));
    const stacked = stackIngredients(selectedMeals);

    if (stacked.length === 0) {
      setCheckoutError(true);
      setTimeout(() => setCheckoutError(false), 3500);
      return;
    }

    try {
      const itemsSnap = await getDocs(collection(db, 'items'));
      const existingMealItems = itemsSnap.docs
        .filter(d => d.data().itemType === 'meal')
        .map(d => ({ id: d.id, ...d.data() }));

      const maxOrder = itemsSnap.docs.length > 0
        ? Math.max(...itemsSnap.docs.map(d => d.data().order ?? 0))
        : 0;

      let newItemIndex = 0;
      await Promise.all(
        stacked.map((item) => {
          // Check if a meal item with the same ingredient name+unit already exists
          const existing = existingMealItems.find(e => {
            const match = e.text.match(/^(.+)\s\((\d+(?:\.\d+)?)(\w+)\)$/);
            if (!match) return false;
            return (
              match[1].toLowerCase() === item.name.toLowerCase() &&
              match[3] === item.unit
            );
          });

          if (existing) {
            // Merge: extract old quantity, add new, update doc
            const match = existing.text.match(/^(.+)\s\((\d+(?:\.\d+)?)(\w+)\)$/);
            const oldQty = Number(match[2]);
            const newQty = oldQty + item.quantity;
            const mergedSources = [...new Set([...(existing.mealSources ?? []), ...item.mealSources])];
            return updateDoc(doc(db, 'items', existing.id), {
              text: `${existing.text.replace(/\s\(.+\)$/, '')} (${newQty}${item.unit})`,
              mealSources: mergedSources,
            });
          } else {
            // New item
            const order = maxOrder + (++newItemIndex);
            return addDoc(collection(db, 'items'), {
              text: `${item.name} (${item.quantity}${item.unit})`,
              itemType: 'meal',
              category: item.category ?? 'other',
              mealSources: item.mealSources,
              order,
              createdAt: Date.now(),
            });
          }
        })
      );

      setSelected(new Set());
      onCheckoutSuccess();
    } catch (err) {
      console.error('Checkout failed:', err);
      alert(`Checkout failed: ${err.message}`);
      setCheckoutError(true);
      setTimeout(() => setCheckoutError(false), 3500);
    }
  }

  const allIngredientNames = [...new Set(
    meals.flatMap(m => m.ingredients?.map(i => i.name) ?? [])
  )];

  return (
    <div className="meal-planner">
      <div className="meal-planner__header">
        <button className="meal-planner__back" onClick={onBack} aria-label="Back to shopping list">
          <BackIcon />
        </button>
        <h1 className="meal-planner__title">Meal Planner</h1>
        <button className="meal-planner__add-btn" onClick={() => setModalMeal(null)} aria-label="Add new meal">
          <PlusIcon />
        </button>
      </div>

      <div className="meal-planner__content">
        {loading ? (
          <p className="meal-planner__empty">Loading...</p>
        ) : meals.length === 0 ? (
          <div className="meal-planner__empty">
            <div className="meal-planner__empty-icon">🍽️</div>
            <p>No meals yet.</p>
            <p className="meal-planner__empty-hint">Tap + to add your first meal!</p>
          </div>
        ) : (
          <div className="meal-planner__grid">
            {meals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                selected={selected.has(meal.id)}
                onSelect={() => toggleSelect(meal.id)}
                onView={() => setModalMeal(meal)}
              />
            ))}
          </div>
        )}
      </div>

      {selected.size > 0 && (
        <div className="meal-planner__footer">
          <button className="meal-planner__checkout" onClick={handleCheckout}>
            Add {selected.size} meal{selected.size > 1 ? 's' : ''} to shopping list
          </button>
        </div>
      )}

      {saveMealSuccess && (
        <div className="meal-planner__toast meal-planner__toast--success">
          <CheckToastIcon />
          Meal saved!
        </div>
      )}

      {saveError && (
        <div className="meal-planner__toast meal-planner__toast--error">
          Failed to save — check your Firebase rules allow writes.
        </div>
      )}

      {checkoutError && (
        <div className="meal-planner__toast meal-planner__toast--error">
          Selected meals have no ingredients. Edit a meal to add some.
        </div>
      )}

      {modalMeal !== undefined && (
        <MealModal
          meal={modalMeal}
          ingredientSuggestions={allIngredientNames}
          onSave={handleSaveMeal}
          onDelete={handleDeleteMeal}
          onClose={() => setModalMeal(undefined)}
        />
      )}
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CheckToastIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
