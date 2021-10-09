import cv2
import time

cap = cv2.VideoCapture(0)

# This function is meant to run forever
while(cap.isOpened()):
    ret, frame = cap.read()

    if ret == False:
        break
    
    # takes one frame per sleep time and saving it to the image dir
    cv2.imwrite('../../images/CapturedFrame.jpg', frame)

    # putting a minute for now just for testing purposes.
    time.sleep(60)

cap.release()
cv2.destroyAllWindows()