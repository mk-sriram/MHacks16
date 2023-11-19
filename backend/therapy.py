from openai import OpenAI
client = OpenAI(api_key="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")
 # This is the API key for the OpenAI API REMOVE IT BEFORE COMMITTING

user_msg = ''
messages=[
    {"role": "system", "content": "You are an experienced therapist. You will inquire about the user's problems and provide guidance to the user. Be brief and let the user do most of the talking."}
]
emotions =[]
def add_emotion(emotion):
    emotions.append(emotion)
def get_therapist_message():
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    messages.append({"role": "system", "content": completion.choices[0].message.content})
    return completion.choices[0].message.content

def post_user_message(msg, use_emotion=False):
    if use_emotion:
        msg += 'My current emotion is ' + emotions[-1] + '.'
    messages.append({"role": "user", "content": msg})


def GetPicToDisplay(msg, use_emotion= False):
    mess = [
        {"role": "system",
         "content": "You will be given a prompt and an emotion, based on how you belive, you will say either anger, glee, negative, nuetral, positive, or suprised. Do not use any punctuation. Do not use uppercase letters:" },
        {"role": "user", "content": msg}
    ]
    imageChoice = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=mess
    )
    print(imageChoice.choices[0].message.content)
    ret = {"anger": "backend/expressions/anger.png",
           "glee": "backend/expressions/glee.png",
           "negative": "backend/expressions/negative.png",
           "nuetral": "backend/expressions/nuetral.png",
           "positive": "backend/expressions/postive.png",
           "suprised": "backend/expressions/suprised.png",
           "neutral": "backend/expressions/neutral.png"}
    return ret[imageChoice.choices[0].message.content]
