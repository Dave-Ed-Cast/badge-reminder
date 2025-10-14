self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('badge-reminder-v1').then(cache =>
      cache.addAll([
        './',
        './badge-reminder.html',
        './badge-reminder.js',
        './manifest.json',
        './styles.css',
        'https://img.icons8.com/color/96/alarm-clock.png'
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  console.log('Service Worker activated');
});

// Listen for messages from main script
self.addEventListener('message', event => {
  const data = event.data;
  if (data.type === "scheduleReminder") {
    const delay = data.delay;
    const outTime = data.outTime;

    console.log(`Reminder scheduled in ${delay / 1000}s`);
    setTimeout(() => {
      self.registration.showNotification("⏰ Time to Badge In!", {
        body: `You badged out at ${outTime}`,
        icon: "https://img.icons8.com/color/96/alarm-clock.png",
        vibrate: [200, 100, 200]
      });
    }, delay);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('./badge-reminder.html'));
});
