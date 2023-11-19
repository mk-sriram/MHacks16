from backend.speech.TextToVoice import convert_to_voice
from backend.speech.VoiceToText import transcribe
from backend.therapy import get_therapist_message, post_user_message, add_emotion, GetPicToDisplay
from flask import Flask, jsonify, request, send_file,render_template,send_file, make_response
from backend.vision.emotions import get_emotion_from_image
import os
import json
from pydub import AudioSegment
import io
app = Flask(__name__, static_url_path='/static')


def create_json_response(message, file_url):
    '''
    Creates a JSON response with the message and file URL
    :message (str): The message to send to chat
    :file_url (str): The URL of the audio
    '''
    response_data = {
        'message': message,
        'file_url': '/getmp3'  # You can use this URL to fetch the file on the frontend
    }
    print(response_data)
    response = make_response(jsonify(response_data))
    response.headers['Content-Disposition'] = 'attachment; filename=output.mp3'
    response.headers['Content-Type'] = 'application/json'
    print(response.data)
    return response
@app.route('/', methods=['GET'])
def index():
    curr_dir = os.getcwd()
    return render_template('Wireframe1.html', curr_dir=curr_dir)

@app.route('/getmp3', methods=['GET'])
def get_mp3():
    directory_path = os.path.join(os.getcwd(), "backend", "speech", "out", "output.mp3")
    return send_file(directory_path, as_attachment=True)

@app.route('/posttext', methods=['POST'])
def handle_text_input():
    print("Got a request! Text input")
    try:
        print(request.json)
        user_text = request.json['userMessage']
        print("HERE")
        post_user_message(user_text, use_emotion=False)
        
        #therapist_text = get_therapist_message() 
        therapist_text = "Tell me more about your day. It seems like you are feeling stressed."     
        print(therapist_text) 
         
        #emotionFile = GetPicToDisplay(user_text, use_emotion = False)
        
        convert_to_voice(therapist_text)

        directory_path = os.path.join(os.getcwd(), "backend", "speech", "out", "output.mp3")
        

        return create_json_response(therapist_text, directory_path)
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)})


@app.route('/postinput', methods=['POST'])
def handle_recorded_input():
    ''''''
    print("Got a request! Recorded input")
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
    
        post_user_message(user_text, use_emotion=True)   
        
        #emotionFile = GetPicToDisplay(user_text, user_emotion = True)
                   #give the chatgpt
         
        #therapist_text = get_therapist_message()  
        therapist_text = "UPDATE THIS WHEN SRI COMES BACK"   
        print(therapist_text) 

        convert_to_voice(therapist_text)

        directory_path = os.path.join(os.getcwd(), "backend", "speech", "out", "output.mp3")

        res = create_json_response(therapist_text, directory_path)
        print(res)
        return res

        
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)})





if __name__ == "__main__": 
    app.run(debug=True, port=5000)
