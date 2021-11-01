import datetime

import cv2
from flask import Blueprint

import database_service
import person_counter as pc
import record_service as rs

# dictionary for mapping room name to the camera that's
# scanning that room (only has one room for now)
room_to_camera = {
    'room 1': 1
}

camera_service = Blueprint('app_camera_service', __name__)

db = database_service.connect_to_database("database")
records = db['records']


@camera_service.route('/process-room', methods=['POST'])
def process_room():
    room = request.json["room"]
    try:
        image_path = take_snapshot(room)
        occupancy = pc.count_people_in_image(image_path)
        rs.create_and_notify(room, occupancy)
    except Exception:
        # failed, return the last recorded occupancy
        recent_records = records.find({'room': room}).sort([('time', -1)]).limit(1)
        if recent_records.count() == 0:
            occupancy = 0
        else:
            occupancy = recent_records[0]['occupancy']
    return {'occupancy', occupancy}, 200


def take_snapshot(room):
    cap = cv2.VideoCapture(room_to_camera[room])
    image_path = '../images/{}-{}.jpg'.format(room, str(datetime.datetime.utcnow()))
    while True:
        ret, frame = cap.read()

        if not ret:
            # failed to capture image
            raise SnapshotError

        cv2.imwrite(image_path, frame)
        break
    cap.release()
    cv2.destroyAllWindows()
    return image_path
