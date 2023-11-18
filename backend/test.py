from speech.TextToVoice import convert_to_voice
from speech.VoiceToText import transcribe
from therapy import get_therapist_message, post_user_message, add_emotion
from flask import Flask, jsonify, request, send_file,render_template,send_file
from vision.emotions import get_emotion_from_image
from flask_cors import CORS
import os
data = request.get_json()
mp3_data = data['audioFile']
image_data = data['photo']

# Process the MP3 data as needed
# Example: Save the MP3 data to a file
with open('backend/speech/in/user_response.mp3', 'wb') as f:
    f.write(mp3_data.decode('base64'))

# Process the image data as needed
# Example: Save the image data to a file
with open('backend/vision/in/user_image.jpg', 'wb') as f:
    f.write(image_data.decode('base64'))
emotion, likelihood = get_emotion_from_image('backend/vision/in/user_image.jpg')
add_emotion(emotion)

user_text = transcribe('backend/speech/in/user_response.mp3')
post_user_message(user_text)              #give the chatgpt 
therapist_text = get_therapist_message()      

print(therapist_text)

convert_to_voice(therapist_text)

directory_path = os.path.join(os.getcwd(), "backend", "speech", "out", "output.mp3")
print(directory_path)