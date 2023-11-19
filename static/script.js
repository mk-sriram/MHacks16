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
          
          if (res.ok) {
            console.log('Message sent successfully!');
            const responseData = await res.json();
            therapist_response = responseData.message
            user_text = responseData.user_text
            createChatList(user_text, 'outgoing');
            console.log(responseData)
            console.log("User text: " + user_text)
            console.log("Therapist response: " + therapist_response)
            
            receiveAndPlayAudio();
            
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
      receiveAndPlayAudio();

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
    recordButton.style.backgroundColor = "hsla(360, 81%, 48%, 0.89)";
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


//const newMessage = "In the current landscape of predictive healthcare algorithms";

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
    const response = await fetch('/getmp3', { method: 'GET' }); 

    if (response.ok) {
      console.log('Audio fetched successfully!');
      const audioData = await response.blob();
      console.log(audioData)
      const audioUrl = URL.createObjectURL(audioData);
      console.log(audioUrl);
      const audio = new Audio(audioUrl);

      // Start playing the audio
      audio.play();

      // Add pulsing effect
      pulsingEffect(audio);

      // Add event listener to stop pulsing after audio finishes playing
      audio.addEventListener('ended', () => {
        stopPulsing();
      });

    } else {
      console.error('Failed to fetch audio');
    }
  } catch (error) {
    console.error('Error fetching audio:', error);
  }
};

// Pulsing effect function
const pulsingEffect = (audio) => {
  const pulsingImage = document.getElementById('avatar'); // Replace with the actual ID of your image
  let pulseSize = 10;

  const updatePulses = () => {
    // Check if the audio is still playing
    if (audio && !audio.paused) {
      pulsingImage.src = 'static/avatartalk.png'; 
      pulsingImage.style.boxShadow = `0 0 ${pulseSize}px #009933`;
      pulseSize += 2; // Adjust the pulsing speed by changing this value
      requestAnimationFrame(updatePulses);
    } else {
      // Stop pulsing when the audio finishes or if it's not playing
      pulsingImage.src = 'static/avatarnosmile.png'; 
      stopPulsing();
    }
  };

  // Start updating pulses
  updatePulses();
};

// Function to stop pulsing
const stopPulsing = () => {
  const pulsingImage = document.getElementById('avatar'); // Replace with the actual ID of your image
  pulsingImage.style.boxShadow = 'none';
};

// Call receiveAndPlayAudio function when needed
// For example, you can call it on a button click event
//const playAudioButton = document.getElementById('playAudioButton'); // Replace with your button ID
//playAudioButton.addEventListener('click', receiveAndPlayAudio);


window.addEventListener('load', () => {
  const initialMessage = "\tIs there anything you would like to talk about today?";
  receiveMessageWithAnimation(initialMessage);

});

// JavaScript code (existing code remains unchanged)

// Function to close the modal
const closeModal = () => {
  modal.style.display = 'none';
};

// Close the modal when clicking outside the modal content or on the close icon
window.addEventListener('click', (event) => {
  const closeButton = modal.querySelector('.close');
  if (event.target === modal || event.target === closeButton) {
    closeModal();
  }
});

const modal = document.getElementById('sessionStatsModal');
const viewStatsBtn = document.getElementById('viewStatsButton');
const viewStats = async (event) => {
  event.preventDefault(); // Prevent the default behavior of the button (e.g., page refresh)
  console.log('View Session Stats button clicked');
  // Retrieve the modal element
  if (!modal.classList.contains('loaded')) {
    console.log('Loading session statistics...');
    try {

      console.log("trying to fetch"); 
      const response = await fetch('/sessionstats', { method: 'POST' });
      console.log(response); 
      if (response.ok) {
        console.log('Session statistics fetched successfully!');
        const sessionStats = await response.json();
        console.log('Session Statistics:', sessionStats);
        
        // Correct the variable name here
        const sessionStatsImage = document.getElementById('plot_data');
        
        // Update the modal content with session statistics
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = ''; // Clear existing content
        // Replace with the appropriate HTML structure to display the statistics
        // Display the fetched image in the modal
        const imgElement = document.createElement('img');
        imgElement.src = `data:image/png;base64, ${sessionStats.plot_data}`;
        imgElement.alt = 'Session Statistics Image';
        imgElement.classList.add('img-fluid');
        modalBody.appendChild(imgElement);
      
        modal.classList.add('loaded');
        modal.style.display = 'block';
      } else {
        console.error('Failed to fetch session statistics');
      }
      
    } catch (error) {
      console.error('Error fetching session statistics:', error);
    }
  } else {
    // If the modal content has already been loaded, display the modal
    modal.style.display = 'block';
  }
  // Close the modal when the close button or outside the modal is clicked
  const viewStatsBtn = document.getElementById('viewStatsButton');
if (viewStatsBtn) {
  modal.classList.remove('loaded');
  viewStatsBtn.addEventListener('click', viewStats);

};

}

// Add an event listener to the viewStatsButton
viewStatsBtn.addEventListener('click', viewStats);



// Example: Trigger a function when the 'View Session Stats' button is clicked

// const viewStatsButton = document.getElementById('viewStatsButton');
// viewStatsButton.addEventListener('click', async function () {


  // Add your logic for handling the 'View Session Stats' button click here


  // console.log("View Session Stats button clicked");
  // You can perform actions like fetching and displaying session statistics
  // For example, you can make a fetch request to a specific endpoint
  // and handle the response accordingly.


//   const avatar = document.getElementById('avatar');
//   if (avatar.src !='static/plt.png'){
//     try {
//       const response = await fetch('/sessionstats', {
//         method: 'POST',
//       });
  
//       if (response.ok) {
//         const sessionStats = await response.json();
//         console.log('Session Statistics:', sessionStats);
//         const avatar = document.getElementById('avatar');
//         avatar.src = 'static/avatarnosmile.png'; 
//         // Add your code to display or handle the session statistics here
//       } else {
//         console.error('Failed to fetch session statistics');
//       }

//     }
//     catch (error) {
//       console.error('Error fetching session statistics:', error);
//     }
//   }
//   else{
//     console.log("Session stats already displayed")
//     // change button text to "Hide Session Stats"
//     viewStatsButton.innerHTML = "Hide Session Stats"
//     avatar.src = 'static/avatarnosmile.png';
//   }
  
// });
