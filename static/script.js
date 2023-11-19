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
          formData.append('audioFile', audioBlob, 'recorded_audio.mp3');
          formData.append('photo', photoBlob, 'user_image.jpg');

          res = await fetch('/postinput', {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log("Fetched")
          console.log(res)

        } catch (error) {
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
      // const responseData = await response.json();
      // Handle the response here if needed

      // // Display incoming message in the chat (just an example)
      // createChatList(responseData.message, 'incoming');
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
