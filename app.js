document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("sendBtn");
    const statusLabel = document.getElementById("status");
    const BACKEND_URL = "https://your-backend-domain/send-email";

    const providerSelect = document.getElementById("emailProvider");

    // Map provider to SMTP
    const SMTP_MAP = {
        gmail: { server: "smtp.gmail.com", port: 587 },
        outlook: { server: "smtp.office365.com", port: 587 },
        yahoo: { server: "smtp.mail.yahoo.com", port: 465 }
    };

    // Load saved preferences
    const savedProvider = localStorage.getItem("emailProvider");
    const savedEmail = localStorage.getItem("senderEmail");
    const savedPassword = localStorage.getItem("senderPassword");

    if (savedProvider) providerSelect.value = savedProvider;
    if (savedEmail) document.getElementById("senderEmail").value = savedEmail;
    if (savedPassword) document.getElementById("senderPassword").value = savedPassword;

    async function sendEmail() {
        const provider = providerSelect.value;
        const smtp = SMTP_MAP[provider];

        // Save preferences
        localStorage.setItem("emailProvider", provider);
        localStorage.setItem("senderEmail", document.getElementById("senderEmail").value);
        localStorage.setItem("senderPassword", document.getElementById("senderPassword").value);

        const payload = {
            sender_email: document.getElementById("senderEmail").value,
            sender_password: document.getElementById("senderPassword").value,
            recipient_email: document.getElementById("senderEmail").value,
            smtp_server: smtp.server,
            smtp_port: smtp.port,
            subject: "Badge Reminder",
            body: "Hello! This is your badge reminder."
        };

        statusLabel.textContent = "Sending...";
        try {
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            statusLabel.textContent = data.message;
        } catch (err) {
            statusLabel.textContent = "Network error: " + err;
        }
    }

    button.addEventListener("click", sendEmail);
});
