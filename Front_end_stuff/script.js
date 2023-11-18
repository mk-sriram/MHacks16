
let mediaRecorder;
let recordedChunks = [];

// Check browser compatibility
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.error('getUserMedia is not supported on your browser');
}

// Function to start recording
function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      mediaRecorder.start();
    })
    .catch(function (err) {
      console.error('Error accessing microphone:', err);
    });
}

// Function to stop recording
function stopRecordingAndSend() {
  mediaRecorder.stop();
  mediaRecorder.onstop = function () {
    const options = {
      type: 'audio/mp3'
    };
    const blob = new Blob(recordedChunks, options);

    // Create a FormData object to send the audio file
    const formData = new FormData();
    formData.append('audioFile', blob, 'recorded_audio.mp3');

    // Send the audio file to the server using fetch

    // fetch('/postmp3', {
    //   method: 'POST',
    //   body: formData,
    // })
    // .then(response => response.json()) // Assuming the server responds with JSON
    // .then(data => {
    //   console.log('Server response:', data);
    // })
    // .catch(error => {
    //   console.error('Error sending the file:', error);
    // });

    fetch('/postmp3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mp3Data: recordedChunks }), // Assuming recordedChunks contains the recorded audio data
    })
    .then(response => response.json())
    .then(data => {
      console.log('Server response:', data);
      // Process the server response as needed
    })
    .catch(error => {
      console.error('Error sending the file:', error);
    });
  

    // Clean up
    recordedChunks = [];
  };
}


function toggleWavyAnimation() {
  const wiggleLines = document.getElementById('wiggleLines');
  wiggleLines.classList.toggle('wavy');
}
  
  
  // Example: Trigger startRecording() and stopRecording() functions when the button is clicked
  const recordButton = document.getElementById('recordButton');
  let isRecording = false;
  recordButton.addEventListener('click', function() {
    if (!isRecording) {
      isRecording = true;
      recordButton.classList.add('recording');
      recordButton.style.backgroundColor = 'red';
      startRecording();
    } else {
      isRecording = false;
      recordButton.classList.remove('recording');
      recordButton.style.backgroundColor = 'transparent';
      stopRecordingAndSend();
    }
  });
  
  