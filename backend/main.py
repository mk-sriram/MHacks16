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
        post_user_message(user_text)              #give the chatgpt 
        therapist_text = get_therapist_message()       

        GetVoice(therapist_text)

        directory_path = os.path.join(os.getcwd(), "backend", "speech", "out", "output.mp3")
        print(directory_path)

        return send_file(directory_path, as_attachment=True)
    except Exception as e:
        print("Are you sure you provided an MP3?")
        return jsonify({'success': False, 'error': str(e)})

    
if __name__ == "__main__": 
    #app.run(host = '127.0.0.1', port = 5000)
    app.run()