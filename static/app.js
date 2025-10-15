const badgeOutBtn = document.getElementById("badgeOutBtn");

async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/static/sw.js");
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BOyywpYz9c5s3Vf_Qc2PH81RK57b2uXrHwSiSwIIJcdYQFcQsXiPfGawoWTcuDQzQJND4TkevVEVb70eygbvg-8=")
    });
    return subscription;
}

badgeOutBtn.addEventListener("click", async () => {
    const subscription = await registerServiceWorker();
    await fetch("/badge-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: "user1",  // ideally unique per user
            subscription: subscription
        })
    });
    alert("Badge Out sent! You will get a notification in 20 min.");
});

// helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
