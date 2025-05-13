import threading, time, cv2, os
from deepface import DeepFace

class FaceRecon:

    def __init__(self, source:int, face_image:str):
        self.cap = cv2.VideoCapture(source, cv2.CAP_DSHOW)

        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        self.counter = 0

        self.reference_img = cv2.imread(face_image)
        os.remove(face_image)

        self.face_match = False


    def check_face(self, frame):
        try:
            if DeepFace.verify(frame, self.reference_img.copy())['verified']:
                self.face_match = True
            else:
                self.face_match = False
        except ValueError:
            self.face_match = False

    def isAuthorized(self):

        while True:
            ret, frame = self.cap.read()

            if ret:

                # cv2.imshow('Facial Recognition Console', frame)

                if self.counter % 30 == 0:
                    try:
                        threading.Thread(target=self.check_face, args=(frame.copy(),)).start()
                    except ValueError:
                        pass

                self.counter += 1

                if self.face_match:
                    print('Face Recognized')
                    return True
                else:
                    # return True
                    cv2.waitKey(1)
                    time.sleep(0.2)


    # TODO FLET APPLICATION SNPPET (CAUTION ⚠️)

    # def main(self, page:ft.Page):

    #     self.page = page

    #     self.page.title = "Flet OpenCV Camera"

    #     # Create an Image control
    #     self.img_control = ft.Image(src_base64="", width=640, height=480)
    #     self.page.add(self.img_control)

    #     # Run the video capture in a separate thread
    #     threading.Thread(target=self.isAuthorized, args=(self.page, self.img_control), daemon=True).start()

    #     self.page.update()
    
    

    # def console_gui(self):
    #     pass

# if name == main
if __name__ == "__main__":
    f = FaceRecon(1, f'core/ok.jpg')
    r = 1 if f.isAuthorized() else 0
    print(r)