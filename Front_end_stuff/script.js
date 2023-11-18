
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
        type: 'audio/webm'
      };
      const audioBlob = new Blob(recordedChunks, options);
      
      if (videoStream) {
        const videoTrack = videoStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);
        try {
          const photoBlob = await imageCapture.takePhoto();
          // Use the captured photo and audioBlob as needed (e.g., save locally, display, etc.)
          console.log("Captured photo:", photoBlob);
          console.log("Captured audio:", audioBlob);
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

  // Example: Trigger startRecording() and stopRecording() functions when the button is clicked
  const recordButton = document.getElementById('recordButton');
  // let isRecording = false;
  recordButton.addEventListener('click', async function() {
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
  
  
const chatboxInput = document.querySelector(".chatInput text");
const sendChatBtn = document.querySelector(".chatInput sendButton");

let userMessage;

const handleChat = () =>{
  userMessage = chatboxInput.value.trim();
  console.log(userMessage);
}

sendChatBin.addEventListener("click", handleChat);