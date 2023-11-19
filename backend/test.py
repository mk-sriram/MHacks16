import requests
import base64
from io import BytesIO

url = 'http://127.0.0.1:5000/postinput'  # Update the URL with your server's URL
headers = {'Content-Type': 'application/json'}


#open mp3 file and encode it
with open('backend/speech/in/user_response-test.mp3', 'rb') as f:
    audio_data = base64.b64encode(f.read()).decode('utf-8')
# open image file and encode it
with open('backend/vision/in/user_image-test.jpeg', 'rb') as f:
    photo_data = base64.b64encode(f.read()).decode('utf-8')

# Create a JSON payload
data = {'audioFile': audio_data, 'photo': photo_data}

# Send the POST request with JSON payload
response = requests.post(url, json=data, headers=headers)

print(response.status_code)
print(response.json())
