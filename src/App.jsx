import { useState } from 'react';
import Login from './components/Login';
import ShoppingList from './components/ShoppingList';
import MealPlanner from './components/MealPlanner';

function isAuthenticated() {
  return sessionStorage.getItem('auth') === 'true';
}

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [view, setView] = useState('shopping');
  const [successMsg, setSuccessMsg] = useState(null);

  function handleCheckoutSuccess() {
    setView('shopping');
    setSuccessMsg('Meals added to your shopping list!');
  }

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;
  if (view === 'planner') {
    return (
      <MealPlanner
        onBack={() => setView('shopping')}
        onCheckoutSuccess={handleCheckoutSuccess}
      />
    );
  }
  return (
    <ShoppingList
      onOpenPlanner={() => setView('planner')}
      successMsg={successMsg}
      onClearSuccess={() => setSuccessMsg(null)}
    />
  );
}
