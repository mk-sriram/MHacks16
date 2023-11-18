
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
// Function to stop recording
function stopRecording() {
  mediaRecorder.stop();
  mediaRecorder.onstop = function () {
    const options = {
      type: 'audio/mp3'
    };
    const blob = new Blob(recordedChunks, options);
    Recorder.forceDownload(blob, 'recorded_audio.mp3'); // Download the MP3 file
    recordedChunks = [];
  };
}


function toggleWiggle() {
    const wiggleLines = document.getElementById('wiggleLines');
    wiggleLines.classList.toggle('wiggle-active');
  }
  
  
  // Example: Trigger startRecording() and stopRecording() functions when the button is clicked
  const recordButton = document.getElementById('recordButton');
  recordButton.addEventListener('click', function() {
    if (!recordButton.classList.contains('recording')) {
      startRecording();
      recordButton.classList.add('recording');
      recordButton.style.backgroundColor = "red";
    } else {
      recordButton.style.backgroundColor = "transparent";
      stopRecording();
      recordButton.classList.remove('recording');
      
    }
  });
  