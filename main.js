async function transcribeAudio(audioBlob) {
  const fishApiKey = "bcda3e3389e54ae2bcc965572a75288d";
  
  console.log("Starting transcription...");
  
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');

  try {
    const response = await fetch('https://api.fish.audio/v1/asr', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${fishApiKey}`
      },
      body: formData
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    console.log("Transcription result:", result);
    alert(result.text);
    console.log("Duration (s):", result.duration);
    
    return result;
    
  } catch (error) {
    console.error("Transcription failed:", error);
    alert("Transcription error: " + error.message);
  }
}