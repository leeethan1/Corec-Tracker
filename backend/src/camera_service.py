import cv2
import time
import datetime
from flask import Blueprint, jsonify, request
import record_service as rs
import person_counter as pc
import database_service

# dictionary for mapping room name to the camera that's
# scanning that room (only has one room for now)
room_to_camera = {
    'room 1': 0
}

camera_service = Blueprint('app_camera_service', __name__)

db = database_service.connect_to_database("database")
records = db['records']


@camera_service.route('/process-room', methods=['POST'])
def process_room():
    room = request.json['room']
    try:
        cap = cv2.VideoCapture(room_to_camera[room])
        image_path = '../images/{}-{}.jpg'.format(room, str(datetime.datetime.now()))
        while (cap.isOpened()):
            ret, frame = cap.read()

            if ret == False:
                # failed to capture image, return the last recorded occupancy
                record = records.find({'room': room}).sort([('time', -1)]).limit(1)
                return jsonify(record['occupancy'])

            cv2.imwrite(image_path, frame)

        cap.release()
        cv2.destroyAllWindows()
        occupancy = pc.count_people_in_image(image_path)
        return jsonify(rs.create_and_notify(room, occupancy))
    except Exception as e:
        # failed, return the last recorded occupancy
        record = records.find({'room': room}).sort([('time', -1)]).limit(1)
        return jsonify(record['occupancy'])