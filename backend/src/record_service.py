from datetime import datetime
from flask import Flask, Blueprint, session, jsonify
import database_service as ds

record_service = Blueprint("app_record_service", __name__)
db = ds.connect_to_database("database")
records = db["records"]
users = db["users"]


def create_and_notify(room, occupancy, email):
    create_record(room, occupancy, records)
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


def create_record(room, occupancy, col):
    hour = datetime.now().hour

    new_record = {
        "room": room,
        "occupancy": occupancy,
        "hour": hour,
        "time": datetime.now()
    }
    col.insert_one(new_record)


@record_service.route('/records/get', methods=['GET'])
def get_average_occupancy(hour):
    record_list = list(records.find({"hour": hour}))
    occupancies = [record['occupancy'] for record in record_list]
    if not occupancies:
        return jsonify(0)
    return jsonify(sum(occupancies) / len(occupancies))