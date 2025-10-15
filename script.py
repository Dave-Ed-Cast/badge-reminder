from flask import Flask, jsonify, request
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from GitHub Pages

SUBJECT = "Email Sent via PWA" 
BODY = """ Hello, 

This email was sent by clicking the button in the PWA frontend. 

Best regards, 
Automated System 
"""

@app.route("/send-email", methods=["POST"])
def send_email():
    try:
        data = request.json
        sender_email = data.get("sender_email")
        sender_password = data.get("sender_password")
        recipient_email = data.get("sender_email")
        smtp_server = data.get("smtp_server", "smtp.gmail.com")
        smtp_port = data.get("smtp_port", 587)
        subject = data.get("subject", "Email from PWA")
        body = data.get("body", "Hello, this is a test email.")

        # Build email
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = recipient_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)

        return jsonify({"status": "success", "message": "Email sent!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
