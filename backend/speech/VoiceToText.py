import keyboard
#from google.cloud import speech
from google.cloud import speech
import pyaudio
import wave
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "backend/key.json"   ###PUT YOUR MANAGER JSON IN MAIN


def MakeUserFile():
    FORMAT = pyaudio.paInt16
    CHANNELS = 1  # Mono
    RATE = 44100  # Sample rate (samples per second)
    #####   RECORD_SECONDS = 5  # Duration of recording in seconds

    # Initialize PyAudio
    audio = pyaudio.PyAudio()

    # Set up the audio stream
    stream = audio.open(format=FORMAT, channels=CHANNELS,
                        rate=RATE, input=True,
                        frames_per_buffer=1024)

    print("Recording...")

    frames = []

    # Record audio

    while(not keyboard.is_pressed(' ')):
        data = stream.read(1024)
        frames.append(data)

    print("Finished recording")

    # Stop and close the audio stream
    stream.stop_stream()
    stream.close()

    # Terminate PyAudio
    audio.terminate()

    # Save the recorded audio to a file
    with wave.open("Input.mp3", 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(audio.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))

    print(f"Audio saved as Input.mp3")

def GetUserInput():             #be sure this file is download as input.mp3
    client = speech.SpeechClient.from_service_account_json('backend/key.json')

    MakeUserFile()

    fileName = "Input.mp3"

    with open(fileName, 'rb') as f:
        mp3d = f.read()

    audio_file = speech.RecognitionAudio(content = mp3d)

    config = speech.RecognitionConfig(sample_rate_hertz = 44100,
                                  enable_automatic_punctuation = False,
                                  language_code= 'en')

    response = client.recognize(config=config, audio=audio_file)
    userSays = response.results[0].alternatives[0].transcript
    return userSays


GetUserInput()