// Function to toggle the wiggle animation class
function toggleWiggle() {
    const wiggleLines = document.getElementById('wiggleLines');
    wiggleLines.classList.toggle('wiggle-active');
  }
  
  // Simulating the start and stop of audio recording (replace with actual logic)
  function startRecording() {
   
    toggleWiggle(); 
  }
  
  function stopRecording() {
    // Perform actions to stop recording
    toggleWiggle(); // Turn off wiggle animation
  }
  
  function changeButtonColor() {
    var recordButton = document.getElementById('recordButton');
    // Add a class to the button when it's clicked
    recordButton.classList.toggle('clicked');
  }
  
  // Example: Trigger startRecording() and stopRecording() functions when the button is clicked
  const recordButton = document.getElementById('recordButton');
  recordButton.addEventListener('click', function() {
    if (!recordButton.classList.contains('recording')) {
      changeButtonColor(); 
      startRecording();
      recordButton.classList.add('recording');
    } else {
      stopRecording();

      recordButton.classList.remove('recording');
    }
  });
  