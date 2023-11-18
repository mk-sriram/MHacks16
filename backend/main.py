from speech.TextToVoice import *
from speech.VoiceToText import *
from therapy import get_therapist_message, post_user_message
from flask import Flask, jsonify, request, send_file,render_template,send_file
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': "Reached Server!"})

#Test Function

@app.route('/postmp3', methods=['POST'])
def handle_mp3_data():
    try:
        data = request.get_json()
        mp3_data = data['mp3Data']

        # Process the MP3 data as needed
        # Example: Save the MP3 data to a file
        with open('backend/speech/in/user_response.mp3', 'wb') as f:
            f.write(mp3_data.decode('base64'))

        user_text = GetUserInput()
        post_user_message(user_text)
        therapist_text = get_therapist_message()
        give_speech(therapist_text)


        return jsonify({'success': True, 'message': therapist_text})
    except Exception as e:
        print("Are you sure you provided an MP3?")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/getspeech', methods = ['GET'])
def give_speech(therapist_text):
    ''' 
    Convert therapist text to speech and return the file
    '''




    
if __name__ == "__main__": 
    #app.run(host = '127.0.0.1', port = 5000)
    app.run()