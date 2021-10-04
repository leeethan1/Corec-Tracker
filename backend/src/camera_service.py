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
    'room 1': 1
}

camera_service = Blueprint('app_camera_service', __name__)

db = database_service.connect_to_database("database")
records = db['records']


@camera_service.route('/process-room', methods=['POST'])
def process_room():
    room = request.json['room']
    try:
        image_path = take_snapshot(room)
        occupancy = pc.count_people_in_image(image_path)
        return jsonify(rs.create_and_notify(room, occupancy))
    except SnapshotError as e:
        # failed, return the last recorded occupancy
        record = records.find({'room': room}).sort([('time', -1)]).limit(1)
        return jsonify(record['occupancy'])


class SnapshotError(Exception):
    message = "Failed to take snapshot"


def take_snapshot(room):
    # cap = cv2.VideoCapture(room_to_camera[room])
    # image_path = '../images/{}-{}.jpg'.format(room, str(datetime.datetime.now()))
    # while True:
    #     ret, frame = cap.read()
    #
    #     if not ret:
    #         # failed to capture image
    #         raise SnapshotError
    #
    #     cv2.imwrite(image_path, frame)
    #     break
    # cap.release()
    # cv2.destroyAllWindows()
    # return image_path
    cam = cv2.VideoCapture(1, cv2.CAP_DSHOW)
    image_path = '{}-{}.bmp'.format(room, str(datetime.datetime.now()))
    image = cam.read()[1]

    #cv2.imshow("image", image)
    cv2.imwrite(image_path, image)

    #cv2.waitKey(0)
    cam.release()
    cv2.destroyAllWindows()


def open_webcam():
    vid = cv2.VideoCapture(1)
    print(vid.isOpened())

    while True:

        # Capture the video frame
        # by frame
        ret, frame = vid.read()

        # Display the resulting frame
        cv2.imshow('frame', frame)

        # the 'q' button is set as the
        # quitting button you may use any
        # desired button of your choice
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # After the loop release the cap object
    vid.release()
    # Destroy all the windows
    cv2.destroyAllWindows()


if __name__ == '__main__':
    image = take_snapshot('room 1')
    #print(pc.count_people_in_image(image))
