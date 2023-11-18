from openai import OpenAI
client = OpenAI()

user_msg = ''
messages=[
    {"role": "system", "content": "You are an experienced therapist. You will inquire about the user's problems and provide guidance to the user. Be brief and let the user do most of the talking. If the user is feeling more negative emotion as the conversation goes on, change your approach but stay in accordance to counsoling norms."}
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

def post_user_message(msg):
    msg += 'My current emotion is ' + emotions[-1] + '.'
    messages.append({"role": "user", "content": msg})


    

