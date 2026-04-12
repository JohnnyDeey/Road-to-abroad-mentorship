// ═══════════════════════════════════════════════════════════════
//  firebase-messaging-sw.js
//  Place this file at the ROOT of your project (same level as index.html)
//  This file MUST be named exactly "firebase-messaging-sw.js"
// ═══════════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// ── Same config as your main app ─────────────────────────────
firebase.initializeApp({
  apiKey:            "AIzaSyBiU-23Ki5Cs369fdfGwzzNIYCrWCMIbko",
  authDomain:        "road-to-abroad-mentorship.firebaseapp.com",
  projectId:         "road-to-abroad-mentorship",
  storageBucket:     "road-to-abroad-mentorship.firebasestorage.app",
  messagingSenderId: "512665582745",
  appId:             "1:512665582745:web:db508416cd0b7bdd26cc08"
});

const messaging = firebase.messaging();

// ── Handle messages received while the app is in the BACKGROUND ──
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);

  const title = payload.notification?.title || '✈️ Path Abroad';
  const body  = payload.notification?.body  || 'You have a new update.';
  const data  = payload.data || {};

  self.registration.showNotification(title, {
    body,
    icon:    '/icon-192.png',
    badge:   '/icon-192.png',          // small monochrome icon shown in status bar (Android)
    tag:     'path-abroad-notif',      // replaces previous notification of same tag
    renotify: true,
    data,
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: '📖 Open App' },
      { action: 'dismiss', title: 'Later' }
    ]
  });
});

// ── Tap on notification → open app ───────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const appUrl = 'https://john-mentorship-hub.vercel.app';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open in a tab, focus it
      for (const client of clientList) {
        if (client.url.startsWith(appUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow(appUrl);
      }
    })
  );
});
