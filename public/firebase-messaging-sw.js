importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// Fill in your Firebase config values — same as the VITE_FIREBASE_* values in your .env
firebase.initializeApp({
  apiKey: 'AIzaSyCNdq_b0qazj08x1afQYr6xi5nJoDRjpzQ',
  authDomain: 'shopping-list-81716.firebaseapp.com',
  projectId: 'shopping-list-81716',
  storageBucket: 'shopping-list-81716.firebasestorage.app',
  messagingSenderId: '986216694615',
  appId: '1:986216694615:web:e06b3a6ca769ed332af412',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
