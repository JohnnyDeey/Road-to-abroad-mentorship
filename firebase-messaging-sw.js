// firebase-messaging-sw.js — place at root of project (same folder as index.html)
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyBiU-23Ki5Cs369fdfGwzzNIYCrWCMIbko",
  authDomain:        "road-to-abroad-mentorship.firebaseapp.com",
  projectId:         "road-to-abroad-mentorship",
  storageBucket:     "road-to-abroad-mentorship.firebasestorage.app",
  messagingSenderId: "512665582745",
  appId:             "1:512665582745:web:db508416cd0b7bdd26cc08"
});

const messaging = firebase.messaging();

// Only show OS notification when the app window is NOT visible.
// When the app IS open, the foreground onMessage handler in index.html
// shows the in-app toast instead — preventing double notifications.
messaging.onBackgroundMessage(async (payload) => {
  const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const appIsVisible = allClients.some(c => c.visibilityState === 'visible');
  if (appIsVisible) return; // app is open — let the toast handle it

  const title = payload.notification?.title || 'Path Abroad';
  const body  = payload.notification?.body  || 'You have a new update.';

  await self.registration.showNotification(title, {
    body,
    icon:     '/icon-192.png',
    badge:    '/icon-192.png',
    tag:      'path-abroad',
    renotify: true,
    vibrate:  [200, 100, 200],
    data:     payload.data || {}
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = 'https://john-mentorship-hub.vercel.app';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if (c.url.startsWith(url) && 'focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
