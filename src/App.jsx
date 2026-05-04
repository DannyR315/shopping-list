import { useState, useEffect } from 'react';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
import { signInAnonymously } from 'firebase/auth';
import Login from './components/Login';
import ShoppingList from './components/ShoppingList';
import MealPlanner from './components/MealPlanner';
import { db, messaging, auth } from './firebase';

function isAuthenticated() {
  return sessionStorage.getItem('auth') === 'true';
}

async function registerNotifications() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return null;
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  await navigator.serviceWorker.ready;

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  // Store token in Firestore, keyed by a stable localStorage ID for this device
  const storedDocId = localStorage.getItem('fcm_doc_id');
  if (storedDocId) {
    await setDoc(doc(db, 'tokens', storedDocId), { token, updatedAt: Date.now() });
  } else {
    const docRef = await addDoc(collection(db, 'tokens'), { token, updatedAt: Date.now() });
    localStorage.setItem('fcm_doc_id', docRef.id);
  }

  return token;
}

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [view, setView] = useState('shopping');
  const [successMsg, setSuccessMsg] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    signInAnonymously(auth).catch(() => {});
  }, []);

  useEffect(() => {
    if (!authed) return;
    registerNotifications().then(setFcmToken).catch(() => {});
  }, [authed]);

  // Show a toast when a push arrives while the app is open
  useEffect(() => {
    if (!fcmToken) return;
    return onMessage(messaging, (payload) => {
      setSuccessMsg(payload.notification?.body ?? 'Shopping list updated!');
    });
  }, [fcmToken]);

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
      fcmToken={fcmToken}
    />
  );
}
