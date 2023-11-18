
let mediaRecorder;
let recordedChunks = [];

// Check browser compatibility
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.error('getUserMedia is not supported on your browser');
}

// Function to start recording
function startRecording() {
  naxsvigator.mediaDevices.getUserMedia({ audio: true })
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
function stopRecording() {
  mediaRecorder.stop();
  mediaRecorder.onstop = function () {
    const options = {
      type: 'audio/mp3'
    };
    const blob = new Blob(recordedChunks, options);
    const audioURL = URL.createObjectURL(blob);
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = audioURL;
    downloadLink.download = 'recorded_audio.mp3';
    document.body.appendChild(downloadLink);
    
    // Trigger download
    downloadLink.click();

    // Clean up
    URL.revokeObjectURL(audioURL);
    document.body.removeChild(downloadLink);
    
    recordedChunks = [];
  };
}



function toggleWiggle() {
    const wiggleLines = document.getElementById('wiggleLines');
    wiggleLines.classList.toggle('wiggle-active');
  }
  
  
  // Example: Trigger startRecording() and stopRecording() functions when the button is clicked
  const recordButton = document.getElementById('recordButton');
    let isRecording = false;

recordButton.addEventListener('click', function() {
  if (!isRecording) {
    startRecording();
    isRecording = true;
    recordButton.classList.add('recording');
    recordButton.style.backgroundColor = "red";
  } else {
    stopRecording();
    isRecording = false;
    recordButton.classList.remove('recording');
    recordButton.style.backgroundColor = "transparent";
  }
});
  