import cv2
import numpy as np
import imutils
import time

protopath = "resources/MobileNetSSD_deploy.prototxt"
modelpath = "resources/MobileNetSSD_deploy.caffemodel"

detector = cv2.dnn.readNetFromCaffe(protopath, modelpath)

# constants
PERSON_INDEX = 15
CONFIDENCE = 0.7
SNAPSHOT_INTERVAL = 1.0


def count_people_in_image(path):
    image = cv2.imread(path)
    image = imutils.resize(image, width=600)

    (h, w) = image.shape[:2]

    blob = cv2.dnn.blobFromImage(image, 0.007843, (w, h), 127.5)
    detector.setInput(blob)

    person_detections = detector.forward()

    people = 0
    for i in np.arange(0, person_detections.shape[2]):
        confidence = person_detections[0, 0, i, 2]
        if confidence > CONFIDENCE:
            index = int(person_detections[0, 0, i, 1])
            if index == PERSON_INDEX:
                people += 1

    print(str(people) + " people counted")
    cv2.destroyAllWindows()
    return people
