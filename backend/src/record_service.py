from datetime import datetime

from flask import request, Blueprint, session

import database_service as ds

record_service = Blueprint("app_record_service", __name__)
db = ds.connect_to_database("database")
records = db["records"]
users = db["users"]


def create_record(room, occupancy):
    email = request.args.get('email')
    hour = datetime.now().hour

    new_record = {
        "room": room,
        "occupancy": occupancy,
        "hour": hour,
        "time": datetime.now()
    }
    records.insert_one(new_record)

    # TODO: send notification
    if "email" in session:
        user = users.find_one({"email": email})
        notifications = user["notifications"]
        if room in notifications and notifications[room] > occupancy:
            # send email/SMS
            if user["emailNotifications"]:
                pass
            if user["smsNotifications"]:
                pass
    return occupancy
