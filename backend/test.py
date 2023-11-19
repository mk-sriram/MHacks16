import requests
import base64
from io import BytesIO

url = 'http://127.0.0.1:5000/postinput'  # Update the URL with your server's URL
headers = {'Content-Type': 'application/json'}

# Simulate audio file data
with open('backend/speech/in/user_response.mp3', 'rb') as audio_file:
    audio_data = base64.b64encode(audio_file.read()).decode('utf-8')

# Simulate photo file data
with open('backend/vision/in/user_image.jpeg', 'rb') as photo_file:
    photo_data = base64.b64encode(photo_file.read()).decode('utf-8')

# Create a JSON payload
data = {'audioFile': audio_data, 'photo': photo_data}

# Send the POST request with JSON payload
response = requests.post(url, json=data, headers=headers)

print(response.status_code)
print(response.json())
