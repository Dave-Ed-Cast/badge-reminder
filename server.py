from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from pywebpush import webpush, WebPushException
from datetime import datetime, timedelta
import json

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

scheduler = BackgroundScheduler()
scheduler.start()

subscriptions = {}

with open("private_key.pem", "r") as f:
    VAPID_PRIVATE_KEY = f.read().strip()

VAPID_CLAIMS = {"sub": "mailto:you@example.com"}

@app.post("/badge-out")
async def badge_out(request: Request):
    data = await request.json()
    user_id = data["user_id"]
    subscriptions[user_id] = data["subscription"]  # store push info

    # Schedule notification in 20 minutes
    run_time = datetime.now() + timedelta(minutes=20)
    scheduler.add_job(send_notification, trigger=DateTrigger(run_date=run_time), args=[user_id])

    return {"status": "ok"}


def send_notification(user_id):
    sub = subscriptions.get(user_id)
    if sub:
        try:
            webpush(
                subscription_info=sub,
                data="Time to badge in!",
                vapid_private_key=VAPID_PRIVATE_KEY,
                vapid_claims=VAPID_CLAIMS
            )
            print(f"Notification sent to {user_id}")
        except WebPushException as e:
            print(f"Notification failed for {user_id}: {e}")
