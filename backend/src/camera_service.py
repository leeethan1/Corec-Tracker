import cv2
import numpy as np
import time
import datetime
from flask import Blueprint, jsonify, request
import record_service as rs
import person_counter as pc
import database_service
import person_counter as pc
import record_service as rs
import json
import traceback
import logging

# dictionary for mapping room name to the camera that's
# scanning that room (only has one room for now)

room_to_camera = {
    'Room 1': 1
}

camera_service = Blueprint('app_camera_service', __name__)

db = database_service.connect_to_database("database")
records = db['records']


@camera_service.route('/process-room', methods=['POST'])
def process_room():
    room = request.json['room']
    occupancy = 0

    cap = cv2.VideoCapture(0)
    image_path = '../images/{}.jpg'.format(str(datetime.datetime.now().date()))
    while (cap.isOpened()):
        try:
            ret, frame = cap.read()
        except Exception as e:
            logging.error(traceback.format_exc())
            record = records.find({'room': room}).sort([('time', -1)]).limit(1)
            return json.dumps({'occupancy': record[0]['occupancy']}), 200
        cv2.normalize(frame, frame, 0, 80, cv2.NORM_MINMAX)

        if ret == False:
            # failed to capture image, return the last recorded occupancy
            record = records.find({'room': room}).sort([('time', -1)]).limit(1)
            return json.dumps({'occupancy': record[0]['occupancy']}), 200

        cv2.imwrite(image_path, frame)

        cap.release()
        cv2.destroyAllWindows()
        occupancy = pc.count_people_in_image(image_path)
        rs.create_and_notify(room, occupancy, records)
        return json.dumps({'occupancy': occupancy}), 200