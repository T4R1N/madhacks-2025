
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "transcribe") {
    // Convert base64 back to blob
    fetch(request.audioData)
      .then(res => res.blob())
      .then(blob => transcribeAudio(blob))
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async
  }
});

async function transcribeAudio(audioBlob) {
  const fishApiKey = "bcda3e3389e54ae2bcc965572a75288d";
  
  console.log("Background: Starting transcription...");
  console.log("Background: Blob size:", audioBlob.size, "type:", audioBlob.type);
  
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');

  const response = await fetch('https://api.fish.audio/v1/asr', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${fishApiKey}`
    },
    body: formData
  });

  console.log("Background: Response status:", response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Background: API Error:", errorText);
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  console.log("Background: Transcription result:", result);
  
  return result;
}
