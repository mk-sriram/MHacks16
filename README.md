# Mindscape: Revolutionizing Mental Well-being Support

## Inspiration
The inspiration for Mindscape stems from a collective desire to revolutionize mental well-being support. We envisioned a tool that seamlessly integrates AI counseling with personalized features to create a truly empathetic and supportive experience.

## What it does
Mindscape acts as a constructive counselor, utilizing AI to guide users through emotional challenges. With real-time emotion analysis from computer vision technology, the AI counselor can craft dynamic prompts based on the direction in which the users' emotions are leading the conversation.

## How we built it
- **Front-end:** Bootstrap and JavaScript
- **Back-end:** Flask
- **AI Services:**
  - Google Cloud Vision AI API for sentiment analysis
  - Google Cloud Speed to Text for speech input
  - Eleven Labs Text to Speech for AI-generated text-to-speech
  - Fine-tuned OpenAI's GPT4-Turbo to operate as a counselor

The client has the option to either record their response, which includes audio recording and snapshots, or simple text chatting. The AI counselor will then use the client's sentiment and prompt to guide the conversation in a constructive direction via text and realistic speech output.

## Challenges we ran into
- "Lack of sleep"
- "Windows"
- "Formatting"
- "Not enough Red Bulls"
- "Styling"
- "Everything"

On a serious note, we spent a lot of time connecting our JS frontend to Flask backend to send the images and mp3 in the correct formats.

## Accomplishments that we're proud of
We achieved all the goals we set for this hackathon. We wanted to implement the pipeline of speech to text, which was then fed into the LLM along with sentiment analysis of the user's face from Google Vision, which was then fed into text to speech and sent back to the user. In addition, our UI integrated these features in an orderly manner.

## What we learned
Having an idea that we are passionate about can lead to serious drive for success. We also learned the power of strong technical skills to back our big ideas. Additionally, we gained insights into integrating various data formats between front-end and back-end.

## What's next for Mindscape
- Train on large datasets approved by medical professionals to one day operate as a licensed counselor
- Integrate a group chat feature that includes multiple real users with an AI counselor guiding the conversation
- Add a "Reach Out" feature to let users meet with certified professionals
- Replace the .png avatars with stable diffusion avatars to mimic real human speech while our counselor is giving output
