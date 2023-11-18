from google.cloud import vision

def get_emotion(image_path):
    client = vision.ImageAnnotatorClient.from_service_account_json('key.json')
    with open(image_path, 'rb') as image_file:
        content = image_file.read()
    image = vision.Image(content=content)
    response = client.face_detection(image=image)
    faces = response.face_annotations
    if len(faces) == 0:
        return 0
    face = faces[0]
    return face.anger_likelihood