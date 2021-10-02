from datetime import datetime
from flask import Flask, Blueprint, session, jsonify, request
import database_service as ds
import notification_service as ns

record_service = Blueprint("app_record_service", __name__)
db = ds.connect_to_database("database")
records = db["records"]
users = db["users"]


@record_service.route('/records/notify', methods=['POST', 'GET'])
def create_and_notify():
    room = request.json['room']
    occupancy = request.json['occupancy']
    create_record(room, occupancy, records)

    # send notification (if applicable)
    if "email" in session:
        email = session['email']
        user = users.find_one({"email": email})
        notifications = user["notifications"]
        if room in notifications and notifications[room] > occupancy:
            # send email/SMS
            if user["emailNotifications"]:
                ns.send_email(email, occupancy, room)
            if user["smsNotifications"]:
                pass
    return jsonify(occupancy)


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
