import keyboard
#from google.cloud import speech
from google.cloud import speech
import pyaudio
import wave
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "backend/key.json"   ###PUT YOUR MANAGER JSON IN MAIN

def transcribe(mp3_path):             #be sure this file is download as input.mp3
    client = speech.SpeechClient.from_service_account_json('backend/key.json')
    with open(mp3_path, 'rb') as f:
        mp3d = f.read()

    audio_file = speech.RecognitionAudio(content = mp3d)

    config = speech.RecognitionConfig(sample_rate_hertz = 44100,
                                  enable_automatic_punctuation = False,
                                  language_code= 'en')

    response = client.recognize(config=config, audio=audio_file)
    userSays = response.results[0].alternatives[0].transcript
    return userSays
