let mediaRecorder;
let recordedChunks = [];
let videoStream;

// Check browser compatibility
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.error('getUserMedia is not supported on your browser');
}




// Function to start recording
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = function (event) {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
    mediaRecorder.start();
    videoStream = stream; // Save video stream reference
  } catch (err) {
    console.error('Error accessing microphone and camera:', err);
  }
}

// Function to stop recording
async function stopRecordingAndSend() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    console.log("stopRecordingAndCapture");
    mediaRecorder.onstop = async function () {
      const options = {
        type: 'audio/mp3'
      };
      const audioBlob = new Blob(recordedChunks, options);

      if (videoStream) {
        const videoTrack = videoStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);
        try {
          const photoBlob = await imageCapture.takePhoto();

          // Use the captured photo and audioBlob as needed
          console.log("Captured photo:", photoBlob);
          console.log("Captured audio:", audioBlob);

          // Send both blobs to /postinput endpoint
          const formData = new FormData();
          formData.append('audioFile', audioBlob, 'user_response.mp3');
          formData.append('photo', photoBlob, 'user_image.jpg');

          res = await fetch('/postinput', {
            method: 'POST',
            body: formData,
          });
          console.log("Fetched from /postinput")
          console.log(res)
          if (res.ok) {
            console.log('Message sent successfully!');
            const responseData = await res.json();
            console.log(responseData)
            console.log("Therapist response: " + responseData.message)
            // Handle the response here if needed
            mp3_path = responseData.file_url
            console.log(mp3_path)
            const audio = new Audio(mp3_path);
            audio.play();
      
            // // Display incoming message in the chat (just an example)
            createChatList(responseData.message, 'incoming');
          } else {
            console.error('Failed to send message');
          }
        } 

        catch (error) {
          console.error('Error capturing photo:', error);
        }
      }

      // Clean up video stream
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
      }

      // Clean up recordedChunks
      recordedChunks = [];
    };
  }
}

// Function to handle sending chat messages
const handleChat = async () => {
  const userMessage = chatboxInput.value.trim();

  if (!userMessage) {
    return;
  }

  // Display outgoing message in the chat
  createChatList(userMessage, 'outgoing');
  console.log("sending post request");

  try {
    const response = await fetch('/posttext', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage }),
    });

    if (response.ok) {
      console.log('Message sent successfully!');
      const responseData = await response.json();
      console.log(responseData)
      console.log("Therapist response: " + responseData.message)
      // Handle the response here if needed
      mp3_path = responseData.file_url
      console.log(mp3_path)
      const audio = new Audio(mp3_path);
      audio.play();

      // // Display incoming message in the chat (just an example)
      createChatList(responseData.message, 'incoming');
    } else {
      console.error('Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }

  // Clear input after sending message
  chatboxInput.value = '';
};

// Example: Trigger startRecording() and stopRecording() functions when the button is clicked
const recordButton = document.getElementById('recordButton');
recordButton.addEventListener('click', async function () {
  if (!recordButton.classList.contains('recording')) {
    await startRecording();
    recordButton.classList.add('recording');
    recordButton.style.backgroundColor = 'red';
    console.log("started")
  } else {
    await stopRecordingAndSend();
    recordButton.classList.remove('recording');
    recordButton.style.backgroundColor = 'transparent';
  }
});

const chatboxInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendButton');
const chatBox = document.getElementById('chat-box')

// Function to create a chat message element
const createChatList = (message, className) => {
  const chatLi = document.createElement('li');
  chatLi.classList.add('chat', className);
  chatLi.innerHTML = `<p>${message}</p>`;
  chatBox.appendChild(chatLi);
};

sendChatBtn.addEventListener('click', handleChat);


const newMessage = "In the current landscape of predictive healthcare algorithms";

const typeMessageautoscroll = (message, element, speed = 50) => {
  const messages = message.split('');
  let i = 0;

  const printMessage = () => {
    if (i < messages.length) {
      element.innerHTML += messages[i];
      element.scrollTop = element.scrollHeight; // Scroll to the bottom
      i++;
      setTimeout(printMessage, speed); // Change speed here (milliseconds)
    }
  };

  printMessage();
};

const receiveMessageWithAnimation = (message) => {
  const chatBox = document.getElementById('chat-box');

  // Create a new list item for the incoming message
  const chatLi = document.createElement('li');
  chatLi.classList.add('chat', 'incoming');

  // Create a span element to contain the animated text
  const messageSpan = document.createElement('span');
  chatLi.appendChild(messageSpan);
  chatBox.appendChild(chatLi);

  // Call the typing animation function to simulate message typing
  typeMessageautoscroll(message, messageSpan);
  
  // Scroll to the bottom to show the latest message
  chatBox.scrollTop = chatBox.scrollHeight;
};


// Function to handle receiving and playing audio from the backend
const receiveAndPlayAudio = async () => {
  try {
    const response = await fetch('/getaudio', { method: 'GET' }); 

    if (response.ok) {
      const blob = await response.blob();

      // Create an audio element
      const audio = new Audio();
      audio.src = URL.createObjectURL(blob);

      // Play the received audio
      audio.play();
      
    } else {
      console.error('Failed to receive audio from the backend');
    }
  } catch (error) {
    console.error('Error fetching audio:', error);
  }
};

// Call receiveAndPlayAudio function when needed
// For example, you can call it on a button click event
const playAudioButton = document.getElementById('playAudioButton'); // Replace with your button ID
playAudioButton.addEventListener('click', receiveAndPlayAudio);


window.addEventListener('load', () => {
  const initialMessage = "Hey, how are you doing?";
  receiveMessageWithAnimation(initialMessage);
});

receiveMessageWithAnimation(newMessage);

