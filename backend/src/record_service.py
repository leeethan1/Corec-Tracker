import json
from datetime import datetime, timedelta
from flask import Flask, Blueprint, session, jsonify, request
import database_service as ds
import notification_service as ns

record_service = Blueprint("app_record_service", __name__)
db = ds.connect_to_database("database")
records = db["records"]
users = db["users"]


@record_service.route("/records/notify", methods=['POST'])
def create_and_notify(room, occupancy):
    # room = request.json['room']
    # occupancy = request.json['occupancy']
    create_record(room, occupancy, records)

    # send notification (if applicable)
    if "email" in session:
        email = session['email']
        user = users.find_one({"email": email})
        notifications = user["notifications"]
        if room in notifications and notifications[room] > occupancy:
            # send email/SMS
            if user["emailNotifications"]:
                ns.send_email_alert(email, occupancy, room)
            if user["smsNotifications"]:
                phone = user['phone']
                ns.send_text_alert(phone, occupancy, room)
    return occupancy


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


@record_service.route('/records/get-by-day', methods=['POST', 'GET'])
def get_occupancies_by_day():
    day = request.json['day']
    averages = []
    for hour in range(5, 24):
        record_list = list(records.find({"$and": [{"hour": hour}, {'day': day}]}))

        occupancies = [record['occupancy'] for record in record_list]
        if not occupancies:
            averages.append(0)
        else:
            averages.append(sum(occupancies) / len(occupancies))
    return json.dumps({
        'occupancies': averages
    }), 200


@record_service.route('/records/week', methods=["POST", "GET"])
def get_occupancies_in_week():
    occupancies = []
    for day in range(0, 7):
        record_list = list(records.find({'day': day}))
        stats = [record['occupancy'] for record in record_list]
        if not stats:
            average = 0
        else:
            average = sum(stats) / len(stats)
            average = round(average, 1)
        occupancies.append(average)
    return json.dumps({'occupancies': occupancies}), 200


@record_service.route('/records/<day>', methods=['POST', 'GET'])
def get_average_occupancy_in_day(day):
    room = request.json['room']
    record_list = list(records.find({'$and': [{'room': room}, {'day': day}]}))
    occupancies = [record['occupancy'] for record in record_list]
    if not occupancies:
        average = 0
    else:
        average = sum(occupancies) / len(occupancies)
        average = round(average, 1)
    return json.dumps({'occupancy': average}), 200
