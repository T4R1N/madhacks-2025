import { GoogleGenAI } from "google/genai";

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

const ai = new GoogleGenAI({GEM_API_KEY});

const PROMPT = "";

function extractFunctionCalls(response) {
  if (Array.isArray(response.functionCalls) && response.functionCalls.length > 0) {
    return response.functionCalls;
  }

  let candidates;
  if (response.candidates && response.candidates.length > 0) {
    candidates = response.candidates;
  } else {
    candidates = response;
  }

  if (Array.isArray(candidates)) {
    for (const cand of candidates) {
      const parts = cand?.content?.parts || cand?.content?.parts || cand?.content;
      if (!parts) continue;
      for (const p of parts) {
        if (p.functionCall || p.functoin_call) {
          returnr [p.functionCall || p.function_call];
        }
      }
    }
  }
  return [];
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "trigger-ai") {
    console.log("Command 'trigger-ai' received — running simple test");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: PROMPT,
      config: {
        tools: [{
          functionDeclarations: functions,
        }],
        toolConfig: {
          functionCallingConfig: {
            mode: "AUTO",
          }
        }
      }
    });
    const functionCalls = extractFunctionCalls(response);
      if (functionCalls.length == 0) {
        console.log("No function call", response.text || response);
      } else {
        for (const funcCall of functionCalls) {
          let args = funcCall.arguments ?? funcCall.args ?? funcCall.argumentsJson ?? null;
          if (typeof args === "string") {
            try { args = JSON.parse(args); }
            catch (e) { console.error("Error parsing function call arguments", e); args = null;}          
          }
          
          switch (funcCall.name) {
            case "createNewTab": 
              const url = args?.url;
              const active = args?.active;
              if (url && active) createNewTab(url, active);
              else if (url) createNewTab(url, true);
              else console.log("Function call missing parameter", funcCall);
              break;
            case "closeActiveTab": 
              closeActiveTab();
              break;
            case "muteActiveTab": 
              muteActiveTab();
              break;
            case "unmuteActiveTab": 
              unmuteActiveTab();
              break;
            case "pinActiveTab": 
              pinActiveTab();
              break;
            case "unpinActiveTab": 
              unpinActiveTab();
              break;
          }
          const url = args?.url;
          if (url) createNewTab(url);
          else console.log("Function call missing url", funcCall);
        }
      }
    }
});