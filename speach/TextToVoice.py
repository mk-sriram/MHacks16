import os
import shutil
import requests
import elevenlabs




def GetVoice(TextInput):
    url = "https://api.elevenlabs.io/v1/text-to-speech/GBv7mTt0atIp3Br8iCZE/stream"                                  #of a voice id
    
    CHUNK_SIZE = 1024
    headers ={
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": "c01acba6c6d83101dd159464a89cbbbd"           #Put your API key here
    }

    data ={
        "text": TextInput,                 #Text input will contain the wikipedia Paragraph
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
            }
        }
    response = requests.post(url, json=data, headers=headers, stream=True)

    with open(f"speach/out/output.mp3", 'wb') as f:
        for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
            if chunk:
                f.write(chunk)
        
    os.startfile("out/output.mp3")



GetVoice("Hi I am thomas, what is your name")