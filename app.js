document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("sendBtn");
    const statusLabel = document.getElementById("status");
    const BACKEND_URL = "https://dave-ed-cast.github.io/badge-reminder/";

    async function sendEmail() {
        const email = document.getElementById("senderEmail").value;
        const password = document.getElementById("senderPassword").value;

        // Infer SMTP from email domain
        let smtp;
        if (email.endsWith("@gmail.com")) smtp = {server: "smtp.gmail.com", port: 587};
        else if (email.endsWith("@outlook.com") || email.endsWith("@hotmail.com")) smtp = {server: "smtp.office365.com", port: 587};
        else if (email.endsWith("@yahoo.com")) smtp = {server: "smtp.mail.yahoo.com", port: 465};
        else {
            statusLabel.textContent = "Unsupported email domain.";
            statusLabel.className = "error";
            return;
        }

        // Save credentials locally
        localStorage.setItem("senderEmail", email);
        localStorage.setItem("senderPassword", password);

        const payload = {
            sender_email: email,
            sender_password: password,
            recipient_email: email,
            smtp_server: smtp.server,
            smtp_port: smtp.port,
            subject: "Badge Reminder",
            body: "Hello! This is your badge reminder."
        };

        statusLabel.textContent = "Sending...";
        statusLabel.className = "";

        try {
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            statusLabel.textContent = data.message;
            statusLabel.className = data.status === "success" ? "success" : "error";
        } catch (err) {
            statusLabel.textContent = "Network error: " + err;
            statusLabel.className = "error";
        }
    }

    // Load saved email/password
    const savedEmail = localStorage.getItem("senderEmail");
    const savedPassword = localStorage.getItem("senderPassword");
    if (savedEmail) document.getElementById("senderEmail").value = savedEmail;
    if (savedPassword) document.getElementById("senderPassword").value = savedPassword;

    button.addEventListener("click", sendEmail);
});
