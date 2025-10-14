const btn = document.getElementById('badgeBtn');
const log = document.getElementById('log');
const delaySelect = document.getElementById('delaySelect');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.error('SW registration failed:', err));
}

if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

btn.onclick = async () => {
    const delaySeconds = 5;

    const now = new Date();
    const next = new Date(now.getTime() + delaySeconds * 1000);

    log.innerHTML = `
    ✅ Badge out recorded at <b>${now.toLocaleTimeString()}</b><br>
    ⏱️ Test reminder will pop at <b>${next.toLocaleTimeString()}</b>
  `;

    const entries = JSON.parse(localStorage.getItem('badgeLog') || "[]");
    entries.push({ out: now.toISOString(), remind: next.toISOString() });
    localStorage.setItem('badgeLog', JSON.stringify(entries));

    if (Notification.permission === "granted") {
        new Notification("Badge Out!", {
            body: `You badged out at ${now.toLocaleTimeString()}`,
            icon: "https://img.icons8.com/color/96/alarm-clock.png"
        });
    }

    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: "scheduleReminder",
            delay: delaySeconds * 1000,
            outTime: now.toLocaleTimeString()
        });
    } else {
        console.warn("No active service worker to handle reminder.");
    }
};
