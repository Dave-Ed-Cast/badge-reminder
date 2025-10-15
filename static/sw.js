self.addEventListener("push", function(event) {
    const data = event.data.text();
    event.waitUntil(
        self.registration.showNotification("Badge Reminder", {
            body: data
        })
    );
});
