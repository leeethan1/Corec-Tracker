import cv2
import numpy as np
import time
import datetime
from flask import Blueprint, jsonify, request
# import record_service as rs
import person_counter as pc
import database_service
import person_counter as pc
import record_service as rs

# dictionary for mapping room name to the camera that's
# scanning that room (only has one room for now)

# room_to_camera = {
#     'room 1': 0
# }


camera_service = Blueprint('app_camera_service', __name__)

# db = database_service.connect_to_database("database")
# records = db['records']


@camera_service.route('/process-room', methods=['POST'])
def process_room():
    # room = request.json['room']
    occupancy = 0
    try:
        cap = cv2.VideoCapture(0)
        image_path = '../images/{}.jpg'.format(str(datetime.datetime.now().date()))
        while (cap.isOpened()):
            ret, frame = cap.read()
            cv2.normalize(frame, frame, 0, 80, cv2.NORM_MINMAX)
            time.sleep(5)

            if ret == False:
                # failed to capture image, return the last recorded occupancy
                # record = records.find({'room': room}).sort([('time', -1)]).limit(1)
                # return jsonify(record[0]['occupancy'])
                break

            cv2.imwrite(image_path, frame)

            cap.release()
            cv2.destroyAllWindows()
            occupancy = pc.count_people_in_image(image_path)
            # return jsonify(rs.create_and_notify(room, occupancy))
    except Exception as e:
        # failed, return the last recorded occupancy
        print(e)
        # record = records.find({'room': room}).sort([('time', -1)]).limit(1)
        # return jsonify(record['occupancy'])

    print(occupancy)

process_room()

