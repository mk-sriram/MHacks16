from speach.TextToVoice import *
from speach.VoiceToText import *
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
        with open('backend/speech/user_response.mp3', 'wb') as f:
            f.write(mp3_data.decode('base64'))

        GetUserInput();

        return jsonify({'success': True, 'message': 'MP3 data received and processed'})
    except Exception as e:
        print("Are you sure you provided an MP3?")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/getmp3', methods = ['GET'])
def give_mp3():

    
if __name__ == "__main__": 
    #app.run(host = '127.0.0.1', port = 5000)
    app.run()