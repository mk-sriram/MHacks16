import keyboard
#from google.cloud import speech
from google.cloud import speech
import pyaudio
import wave
import os
from pydub import AudioSegment
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "backend/key.json"   ###PUT YOUR MANAGER JSON IN MAIN

def transcribe(mp3_path):             #be sure this file is download as input.mp3
    audio = AudioSegment.from_mp3(mp3_path)
    
    audio = audio.set_frame_rate(44100)
    audio.export(mp3_path, format="mp3")
    
    client = speech.SpeechClient.from_service_account_json('backend/key.json')
    
    with open(mp3_path, 'rb') as f:
        mp3d = f.read()

    audio_file = speech.RecognitionAudio(content = mp3d)
    
    config = speech.RecognitionConfig(sample_rate_hertz = 44100,
                                  enable_automatic_punctuation = True,
                                  language_code= 'en')
    
    response = client.recognize(config=config, audio=audio_file)
    print(type(response))
    print(response)
    if len(response.results) == 0:
        return "Sorry, I didn't quite catch that. Could you repeat that?"
    else:
        userSays = response.results[0].alternatives[0].transcript
        return userSays
