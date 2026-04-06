import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { db } from '../firebase';
import AddItem from './AddItem';
import ItemCard from './ItemCard';
import './ShoppingList.css';

const COLLECTION = 'items';

export default function ShoppingList({ onOpenPlanner, successMsg, onClearSuccess }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => onClearSuccess(), 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function handleAdd(text) {
    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.order ?? 0)) : 0;
    await addDoc(collection(db, COLLECTION), {
      text,
      itemType: 'normal',
      order: maxOrder + 1,
      createdAt: Date.now(),
    });
  }

  async function handleComplete(id) {
    await deleteDoc(doc(db, COLLECTION, id));
  }

  async function handleEdit(id, text) {
    await updateDoc(doc(db, COLLECTION, id), { text });
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    setItems(reordered);

    await Promise.all(
      reordered.map((item, index) =>
        updateDoc(doc(db, COLLECTION, item.id), { order: index })
      )
    );
  }

  return (
    <div className="shopping-list">
      <div className="shopping-list__header">
        <h1 className="shopping-list__title">🛒 Shopping List <span className="shopping-list__version">v1.1</span></h1>
        <div className="shopping-list__header-right">
          {items.length > 0 && (
            <span className="shopping-list__count">{items.length}</span>
          )}
          <button
            className="shopping-list__planner-btn"
            onClick={onOpenPlanner}
            aria-label="Open meal planner"
          >
            <UtensilsIcon />
          </button>
        </div>
      </div>

      <AddItem onAdd={handleAdd} />

      <div className="shopping-list__items">
        {loading ? (
          <p className="shopping-list__empty">Loading...</p>
        ) : items.length === 0 ? (
          <div className="shopping-list__empty">
            <p>Nothing on the list yet.</p>
            <p className="shopping-list__empty-hint">Add something above!</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onComplete={handleComplete}
                  onEdit={handleEdit}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {successMsg && (
        <div className="shopping-list__toast">
          <CheckIcon />
          {successMsg}
        </div>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function UtensilsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  );
}
