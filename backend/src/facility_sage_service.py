import cv2
import time

cap = cv2.VideoCapture(0)
i = 0
while(cap.isOpened()):
    ret, frame = cap.read()

    if ret == False:
        break
    
    cv2.imwrite('../images/Frame'+str(i)+'.jpg', frame)
    i+=1
    # putting a minute for now just for testing purposes.
    time.sleep(60)

cap.release()
cv2.destroyAllWindows()