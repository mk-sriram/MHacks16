from backend.speech.TextToVoice import convert_to_voice
from backend.speech.VoiceToText import transcribe
from backend.therapy import get_therapist_message, post_user_message, add_emotion
from flask import Flask, jsonify, request, send_file,render_template,send_file
from backend.vision.emotions import get_emotion_from_image
import os
import json
from pydub import AudioSegment
import io
app = Flask(__name__, static_url_path='/static')

@app.route('/', methods=['GET'])
def index():
    curr_dir = os.getcwd()
    return render_template('Wireframe1.html', curr_dir=curr_dir)
@app.route('/posttext', methods=['POST'])
def handle_text_input():
    try:
        user_text = request.json['userText']
        post_user_message(user_text, use_emotion=False)
        therapist_text = get_therapist_message()       

        convert_to_voice(therapist_text)

        directory_path = os.path.join(os.getcwd(), "backend", "speech", "out", "output.mp3")

        #return send_file(directory_path, as_attachment=True)
        return jsonify({'success': True})
    except Exception as e:
        print("Are you sure you provided an MP3?")
        return jsonify({'success': False, 'error': str(e)})


@app.route('/postinput', methods=['POST'])
def handle_recorded_input():
    ''''''
    print("Got a request!")
    files = request.files
    
    try:
        audio_file = files['audioFile'] # type is werkzeug.datastructures.FileStorage
        
        photo_file = files['photo']

        # Convert audio data to MP3 using pydub
        audio_data = io.BytesIO(audio_file.read())
        audio_segment = AudioSegment.from_file(audio_data, format="webm")  # Adjust the format if needed

        audio_filepath = 'backend/speech/in/user_response.mp3'
        audio_segment.export(audio_filepath, format="mp3")

        photo_file.save('backend/vision/in/user_image.jpg')

        emotion, likelihood = get_emotion_from_image('backend/vision/in/user_image.jpg')
        add_emotion(emotion)

        user_text = transcribe('backend/speech/in/user_response.mp3')
    
        post_user_message(user_text, use_emotion=True)              #give the chatgpt 
        therapist_text = get_therapist_message()      

        convert_to_voice(therapist_text)

        directory_path = os.path.join(os.getcwd(), "backend", "speech", "out", "output.mp3")
        print(directory_path)

        print(therapist_text)

        return send_file(directory_path, as_attachment=True)
    except Exception as e:
        print("Are you sure you provided an MP3?")
        print(e)
        return jsonify({'success': False, 'error': str(e)})

if __name__ == "__main__": 
    app.run(debug=True, port=5000)
