//const mic_btn = document.getElementById('speech_button');
//mic_btn.addEventListener("click", recordAudio);

let can_record = false;
let is_recording = false;
let recorder = null;
let chunks = [];

function SetupAudio() {
  console.log("1. SetupAudio called");
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("2. getUserMedia is available");
    navigator.mediaDevices
      .getUserMedia({
        audio: true
      })
      .then(stream => {
        console.log("3. Microphone access granted", stream);
        SetupStream(stream);
      })
      .catch(err => {
        console.error("4. ERROR getting microphone:", err);
        alert("Microphone error: " + err.message);
      });
  } else {
    console.error("getUserMedia not supported");
    alert("Your browser doesn't support audio recording");
  }
}
SetupAudio();

function SetupStream(stream) {
  console.log("5. SetupStream called");
  
  const mimeTypes = [
    'audio/webm',
    'audio/webm;codecs=opus',
    'audio/ogg;codecs=opus',
    'audio/mp4'
  ];
  
  let supportedMimeType = '';
  for (let mimeType of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      supportedMimeType = mimeType;
      console.log("6. Supported MIME type:", mimeType);
      break;
    }
  }
  
  recorder = new MediaRecorder(stream, supportedMimeType ? {mimeType: supportedMimeType} : {});
  console.log("7. MediaRecorder created with mimeType:", recorder.mimeType);

  recorder.ondataavailable = e => {
    console.log("8. Data available, size:", e.data.size, "bytes");
    chunks.push(e.data);
  }
  
  recorder.onstop = async (e) => { // Make it async again
  console.log("9. Recording stopped. Total chunks:", chunks.length);
  
  if (chunks.length === 0) {
    alert("No audio data recorded!");
    return;
  }
  
  const blob = new Blob(chunks, {type: recorder.mimeType});
  console.log("10. Blob created, size:", blob.size, "bytes, type:", blob.type);
  chunks = [];
  
  // Convert blob to base64
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64Audio = reader.result;
    
    console.log("Sending to background for transcription...");
    let prompt;
    
    chrome.runtime.sendMessage(
      { 
        action: "transcribe", 
        audioData: base64Audio,
        mimeType: blob.type 
      },
      (response) => {
        if (response && response.success) {
          prompt = response.result.text;
          console.log("Transcription: " + prompt);
          console.log("Duration:", response.result.duration);
          chrome.runtime.sendMessage(
          {
            action:"send_prompt",
            prompt: prompt
          },
          (response) => {
            console.log("Received response from send_prompt: " + response);
          }
        )} else {
          alert("Transcription failed: " + (response?.error || "Unknown error"));
          console.error("Error:", response);
        }
      }
    );

    
  };
  reader.readAsDataURL(blob);

    console.log("17. Download triggered");
  }
  
  can_record = true;
  console.log("18. Setup complete, can_record =", can_record);
}

function recordAudio() {
  console.log("19. recordAudio called, can_record:", can_record, "is_recording:", is_recording);
  
  if(!can_record) {
    alert("Microphone not ready - check console");
    return;
  }
  
  is_recording = !is_recording;
  
  if (is_recording && simonIsListening == true) {
    console.log("20. Starting recording...");
    chunks = [];
    recorder.start();
  } else {
    console.log("21. Stopping recording...");
    recorder.stop(); // This will trigger onstop which sends to background
  }
}