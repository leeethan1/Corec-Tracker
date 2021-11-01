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
def create_and_notify(room, occupancy, records):
    # room = request.json['room']
    # occupancy = request.json['occupancy']
    create_record(room, occupancy, records)
    userList = list(users.find({}))

    # send notification (if applicable)
    for user in userList:
        email = user['email']
        notifications = user["notifications"]
        startTime, endTime = None, None
        currentTime = datetime.now()
        if "startTime" in user and "endTime" in user:
            startTime = user["startTime"]
            endTime = user["endTime"]
        if room in notifications and notifications[room] > occupancy:

            # send email/SMS
            if user["emailNotifications"]:
                if (not startTime and not endTime) or (startTime <= currentTime.hour <= endTime):
                    ns.send_email_alert(email, occupancy, room)
            if user["smsNotifications"]:
                phone = user['phone']
                if (not startTime and not endTime) or (startTime <= currentTime.hour <= endTime):
                    ns.send_text_alert(phone, occupancy, room)

    return {"occupancy": occupancy}, 200


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
    # col.delete_many({'time': {'$lt': datetime.utcnow() - timedelta(days=7)}})


@record_service.route('/records/get-by-day', methods=['POST', 'GET'])
def get_occupancies_by_day():
    room = request.json['room']
    day = request.json['day']
    averages = []
    for hour in range(5, 24):
        record_list = list(records.find({"$and": [{"hour": hour}, {'day': day}, {'room': room}]}))

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
    room = request.json['room']
    occupancies = []
    for day in range(0, 7):
        record_list = list(records.find({'$and': [{'day': day}, {'room': room}]}))
        stats = [record['occupancy'] for record in record_list]
        if not stats:
            average = 0
        else:
            average = sum(stats) / len(stats)
            average = round(average, 1)
        occupancies.append(average)
    return json.dumps({'occupancies': occupancies}), 200


@record_service.route('/records/average', methods=['POST', 'GET'])
def get_average_occupancies():
    room = request.json['room']
    averages = []
    for day in range(0, 6):
        record_list = list(records.find({'$and': [{'room': room}, {'day': day}]}))
        occupancies = [record['occupancy'] for record in record_list]
        if not occupancies:
            average = 0
        else:
            average = sum(occupancies) / len(occupancies)
            average = round(average, 1)
        averages.append(average)
    return json.dumps({'averages': averages}), 200


@record_service.route('/records/get', methods=['POST'])
def get_occupancies():
    room = request.json['room']
    occupancies = []  # first index = hour of day. second index = day of week
    for hour in range(5, 24):
        averages = []
        for day in range(0, 7):
            record_list = list(records.find({'$and': [{'hour': hour}, {'day': day}, {'room': room}]}))
            stats = [record['occupancy'] for record in record_list]
            if not stats:
                average = 0
            else:
                average = sum(stats) / len(stats)
                average = round(average, 1)
            averages.append(average)
        occupancies.append(averages)

    return json.dumps({'occupancies': occupancies}), 200


@record_service.route('/records/advanced', methods=['POST'])
def get_advanced_stats():
    room = request.json['room']
    maxes = []
    mins = []
    averages = []
    for day in range(0, 7):
        record_list = list(records.find({'$and': [{'room': room}, {'day': day}]}))
        occupancies = [record['occupancy'] for record in record_list]
        if not occupancies:
            maximum = 0
            minimum = 0
            average = 0
        else:
            maximum = max(occupancies)
            minimum = min(occupancies)
            average = sum(occupancies) / len(occupancies)
        mins.append(minimum)
        maxes.append(maximum)
        averages.append(round(average, 1))
    return json.dumps({'minimums': mins, 'maximums': maxes, 'averages': averages}), 200

