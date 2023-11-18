
let mediaRecorder;
let recordedChunks = [];

// Check browser compatibility
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.error('getUserMedia is not supported on your browser');
}

// Function to start recording
function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(function (stream) {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      mediaRecorder.start();
      videoStream = stream; // Save video stream reference
    })
    .catch(function (err) {
      console.error('Error accessing microphone and camera:', err);
    });
}

// Function to stop recording
function stopRecordingAndSend() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    mediaRecorder.onstop = function () {
      const options = {
        type: 'audio/webm'
      };
      const audioBlob = new Blob(recordedChunks, options);

      // Capture a photo using the user's camera
      if (videoStream) {
        const videoTrack = videoStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);
        imageCapture.takePhoto()
          .then(photoBlob => {
            // Create a FormData object to send the photo and audio file
            const formData = new FormData();
            formData.append('photo', photoBlob);
            formData.append('audioFile', audioBlob, 'recorded_audio.webm');

            // Send the photo and audio file to the server using fetch
            fetch('/postmp3', {
              method: 'POST',
              body: formData
            })
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('Network response was not ok.');
            })
            .then(data => {
              console.log('Server response:', data);
              // Handle the server response as needed
            })
            .catch(error => {
              console.error('There was a problem with the fetch operation:', error);
            });
          })
          .catch(error => {
            console.error('Error capturing photo:', error);
          });
      }

      // Clean up video stream
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
      }

      // Clean up
      recordedChunks = [];
    };
  }
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
  
  