// ===== CONSTANTS =====
const button = document.getElementById("sendBtn");
const statusLabel = document.getElementById("status");
const BACKEND_URL = "https://dave-ed-cast.github.io/badge-reminder/";

const providerSelect = document.getElementById("emailProvider");
const smtpServerInput = document.getElementById("smtpServer");
const smtpPortInput = document.getElementById("smtpPort");

// ===== PROVIDER SELECTION LOGIC =====
providerSelect.addEventListener("change", () => {
    const provider = providerSelect.value;

    switch (provider) {
        case "gmail":
            smtpServerInput.value = "smtp.gmail.com";
            smtpPortInput.value = 587;
            smtpServerInput.disabled = true;
            smtpPortInput.disabled = true;
            break;
        case "outlook":
            smtpServerInput.value = "smtp.office365.com";
            smtpPortInput.value = 587;
            smtpServerInput.disabled = true;
            smtpPortInput.disabled = true;
            break;
        case "yahoo":
            smtpServerInput.value = "smtp.mail.yahoo.com";
            smtpPortInput.value = 465;
            smtpServerInput.disabled = true;
            smtpPortInput.disabled = true;
            break;
        case "custom":
        default:
            smtpServerInput.disabled = false;
            smtpPortInput.disabled = false;
            smtpServerInput.value = "";
            smtpPortInput.value = "";
            break;
    }
});

// ===== LOAD SAVED PREFERENCES =====
window.onload = () => {
    const savedProvider = localStorage.getItem("emailProvider");
    const savedEmail = localStorage.getItem("senderEmail");
    const savedPassword = localStorage.getItem("senderPassword");
    const savedRecipient = localStorage.getItem("recipientEmail");

    if (savedProvider) providerSelect.value = savedProvider;
    if (savedEmail) document.getElementById("senderEmail").value = savedEmail;
    if (savedPassword) document.getElementById("senderPassword").value = savedPassword;
    if (savedRecipient) document.getElementById("recipientEmail").value = savedRecipient;

    providerSelect.dispatchEvent(new Event("change")); // Apply SMTP auto-fill
};

// ===== SEND EMAIL FUNCTION =====
async function sendEmail() {
    // Save preferences locally
    localStorage.setItem("emailProvider", providerSelect.value);
    localStorage.setItem("senderEmail", document.getElementById("senderEmail").value);
    localStorage.setItem("senderPassword", document.getElementById("senderPassword").value);
    localStorage.setItem("recipientEmail", document.getElementById("recipientEmail").value);

    const payload = {
        sender_email: document.getElementById("senderEmail").value,
        sender_password: document.getElementById("senderPassword").value,
        recipient_email: document.getElementById("recipientEmail").value,
        smtp_server: document.getElementById("smtpServer").value,
        smtp_port: parseInt(document.getElementById("smtpPort").value),
        subject: document.getElementById("subject").value,
        body: document.getElementById("body").value
    };

    statusLabel.textContent = "Sending...";  // updated
    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        statusLabel.textContent = data.message;  // updated
    } catch (err) {
        statusLabel.textContent = "Network error: " + err;  // updated
    }
}

// ===== BUTTON CLICK EVENT =====
button.addEventListener("click", sendEmail);

// ===== SERVICE WORKER REGISTRATION =====
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("Service Worker registered"))
        .catch(err => console.log("SW registration failed", err));
}
