from speech.TextToVoice import convert_to_voice
from speech.VoiceToText import transcribe
from therapy import get_therapist_message, post_user_message, add_emotion
from flask import Flask, jsonify, request, send_file,render_template,send_file
from vision.emotions import get_emotion_from_image
import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    curr_dir = os.getcwd()
    return render_template('Front_end_stuff/Wireframe1.html', curr_dir=curr_dir)
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
    print("Got a request!")
    try:
        data = request.json
        audio_file = data['audioFile']
        photo_file = data['photo']

        # Process the audio file and decode from base64
        with open('backend/speech/in/user_response.mp3', 'wb') as f:
            f.write(base64.b64decode(audio_file))

        # Process the photo file
        with open('backend/vision/in/user_image.jpg', 'wb') as f:
            f.write(base64.b64decode(photo_file))

        emotion, likelihood = get_emotion_from_image('backend/vision/in/user_image.jpg')
        add_emotion(emotion)

        user_text = transcribe('backend/speech/in/user_response.mp3')
        post_user_message(user_text, use_emotion=True)              #give the chatgpt 
        therapist_text = get_therapist_message()       

        convert_to_voice(therapist_text)

        directory_path = os.path.join(os.getcwd(), "backend", "speech", "out", "output.mp3")
        print(directory_path)

        return send_file(directory_path, as_attachment=True)
    except Exception as e:
        print("Are you sure you provided an MP3?")
        return jsonify({'success': False, 'error': str(e)})

if __name__ == "__main__": 
    app.run(debug=True, port=5000)
