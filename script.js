const btn = document.getElementById('badgeBtn');
const log = document.getElementById('log');

// request notification permission on load
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

btn.onclick = async () => {
    if (Notification.permission !== "granted") {
        await Notification.requestPermission();
    }

    const now = new Date();
    const next = new Date(now.getTime() + 5000); // 5 seconds from now

    log.innerHTML = `
      ✅ Badge out recorded at <b>${now.toLocaleTimeString()}</b><br>
      🔔 Test reminder set for <b>${next.toLocaleTimeString()}</b>
    `;

    // Play a sound function
    const playSound = () => {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/medium_bell_ringing_near.ogg');
        audio.play();
    };

    // Schedule notification and sound after 5 seconds
    setTimeout(() => {
        new Notification("Time to badge in!", {
            body: `You badged out at ${now.toLocaleTimeString()}`,
            icon: "https://img.icons8.com/color/96/alarm-clock.png"
        });
        playSound();
    }, 2000);
};
