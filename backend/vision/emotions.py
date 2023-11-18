from google.cloud import vision
import os
def get_emotion_from_image(path):
    """Detects faces in an image."""  
    client = vision.ImageAnnotatorClient.from_service_account_json('backend/key.json')
    with open(path, "rb") as image_file:
        content = image_file.read()
    image = vision.Image(content=content)
    response = client.face_detection(image=image)
    faces = response.face_annotations
    if len(faces) == 0:
        return None
    face = faces[0]

    emotions = {'joy': face.joy_likelihood,
               'anger': face.anger_likelihood,
               'sorrow': face.sorrow_likelihood,
               'surprise': face.surprise_likelihood}
    
    # return highest likelihood emotion
    emotion = None
    max_likelihood = 0
    for key in emotions:
        if emotions[key] > max_likelihood:
            max_likelihood = emotions[key].value
            emotion = key
    return emotion, max_likelihood