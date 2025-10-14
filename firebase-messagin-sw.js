// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase in Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyA0fyu93B6QZZLrpssoTs9MyDiNXO-lkJw",
  authDomain: "badge-reminder.firebaseapp.com",
  projectId: "badge-reminder",
  storageBucket: "badge-reminder.firebasestorage.app",
  messagingSenderId: "549707009613",
  appId: "1:549707009613:web:dd52fa66d515c7afd8d604",
  measurementId: "G-NGGMTWVC18"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://img.icons8.com/color/96/alarm-clock.png',
        vibrate: [200, 100, 200]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.openWindow('./badge-reminder.html'));
});
