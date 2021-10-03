import cv2
import time
import os
import datetime

# dictionary for mapping room name to the camera that's
# scanning that room (only has one room for now)
room_to_camera = {
    'room 1': 0
}


def take_snapshot(room):
    cap = cv2.VideoCapture(room_to_camera[room])
    #i = 0
    image_path = '../images/{}-{}.jpg'.format(room, str(datetime.datetime.now()))
    while (cap.isOpened()):
        ret, frame = cap.read()

        if ret == False:
            break

        # takes one frame per sleep time and saving it to the image dir

        cv2.imwrite(image_path, frame)
        i += 1
        # putting a minute for now just for testing purposes.
        time.sleep(60)

    cap.release()
    cv2.destroyAllWindows()
    return image_path
