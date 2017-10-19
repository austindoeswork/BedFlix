import cv2
import freenect
import numpy as np

#Get RGB image
def get_frame():
    buf,_ = freenect.sync_get_video()
    buf = cv2.cvtColor(buf, cv2.COLOR_RGB2BGR)
    return buf

#Get Depth Image
def get_depth():
    buf,_ = freenect.sync_get_depth()
    buf = buf.astype(np.uint8)
    return buf

if __name__ == "__main__":
    while True:
        frame = get_frame()
        depth = get_depth()
        #display rgb
        cv2.imshow("RGB", frame)
        #display depth
        cv2.imshow("Depth", depth)

        k = cv2.waitKey(5) & 0xFF
        if k == 27:
            break
    cv2.destroyAllWindows()
