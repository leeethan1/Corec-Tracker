from datetime import datetime, timedelta
from flask import Flask, Blueprint, session, jsonify, request
import database_service as ds
import notification_service as ns

record_service = Blueprint("app_record_service", __name__)
db = ds.connect_to_database("database")
records = db["records"]
users = db["users"]


@record_service.route("/records/notify", methods=['POST'])
def create_and_notify():
    room = request.json['room']
    occupancy = request.json['occupancy']
    create_record(room, occupancy, records)

    # send notification (if applicable)
    user_list = users.find({})
    for user in user_list:
        notifications = user["notifications"]
        if room in notifications and notifications[room] > occupancy:
            # send email/SMS
            if user["emailNotifications"]:
                email = user['email']
                ns.send_email_alert(email, occupancy, room)
            if user["smsNotifications"]:
                phone = user['phone']
                ns.send_text(phone, occupancy, room)
    return jsonify(occupancy)


def create_record(room, occupancy, col):
    hour = datetime.utcnow().hour

    new_record = {
        "room": room,
        "occupancy": occupancy,
        "hour": hour,
        "day": datetime.today().weekday(),
        "time": datetime.utcnow()
    }
    col.insert_one(new_record)
    col.delete_many({'time': {'$lt': datetime.utcnow() - timedelta(days=7)}})


@record_service.route('/records/get', methods=['GET'])
def get_average_occupancy():
    hour = request.json['hour']
    record_list = list(records.find({"hour": hour}))
    occupancies = [record['occupancy'] for record in record_list]
    if not occupancies:
        return jsonify(0)
    return jsonify(sum(occupancies) / len(occupancies))
