const btn = document.getElementById('badgeBtn');
const log = document.getElementById('log');
const delaySelect = document.getElementById('delaySelect');

// request notification permission on load
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

btn.onclick = async () => {
    if (Notification.permission !== "granted") {
        await Notification.requestPermission();
    }

    const delayMinutes = parseInt(delaySelect.value, 10);
    const now = new Date();
    const next = new Date(now.getTime() + delayMinutes * 60000);

    log.innerHTML = `
      ✅ Badge out recorded at <b>${now.toLocaleTimeString()}</b><br>
      🔔 Reminder set for <b>${next.toLocaleTimeString()}</b>
    `;

    // Save to local log
    const entries = JSON.parse(localStorage.getItem('badgeLog') || "[]");
    entries.push({ out: now.toISOString(), remind: next.toISOString() });
    localStorage.setItem('badgeLog', JSON.stringify(entries));

    // Schedule reminder
    // Trigger notification after 5 seconds for testing
        setTimeout(() => {
            new Notification("Time to badge in!", {
                body: `You badged out at ${now.toLocaleTimeString()}`,
                icon: "https://img.icons8.com/color/96/alarm-clock.png"
            });
        }, 5000);
};