const btn = document.getElementById('badgeBtn');
const log = document.getElementById('log');
const delaySelect = document.getElementById('delaySelect');

// --- PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.error('SW registration failed:', err));
}

// --- Request Notification Permission ---
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

btn.onclick = async () => {
    const delayMinutes = parseInt(delaySelect.value, 10);
    const now = new Date();
    const next = new Date(now.getTime() + delayMinutes * 60000);

    // Update UI
    log.innerHTML = `
    ✅ Badge out recorded at <b>${now.toLocaleTimeString()}</b><br>
    🔔 Reminder set for <b>${next.toLocaleTimeString()}</b>
  `;

    // Save to localStorage
    const entries = JSON.parse(localStorage.getItem('badgeLog') || "[]");
    entries.push({ out: now.toISOString(), remind: next.toISOString() });
    localStorage.setItem('badgeLog', JSON.stringify(entries));

    // Immediate test notification
    if (Notification.permission === "granted") {
        new Notification("Badge Out!", {
            body: `You badged out at ${now.toLocaleTimeString()}`,
            icon: "https://img.icons8.com/color/96/alarm-clock.png"
        });
    }

    // Request the service worker to schedule the reminder
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: "scheduleReminder",
            delay: delayMinutes * 60 * 1000, // convert minutes to ms
            outTime: now.toLocaleTimeString()
        });
    } else {
        console.warn("No active service worker to handle reminder.");
    }
};
