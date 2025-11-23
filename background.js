import {
  functionDeclarations,
  functionImplementations
} from './functions.js';

const GEM_API_KEY = `insert api key here`;
// function saveKey() {
//   const key = 'sk-AIzaSyCFNgJBbM-R0Uptk1UAIGPcNk1rQxJL7A8';
//   if (key && key.startsWith('sk-')) {
//     chrome.storage.local.set({'GEM_API_KEY': key}, () => {
//       console.log('API key saved.');
//     });
//   } else {
//     console.error('key invalid');
//   }
// }
// self.saveKey = saveKey;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "transcribe") {
    // Convert base64 back to blob
    fetch(request.audioData)
      .then(res => res.blob())
      .then(blob => transcribeAudio(blob))
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async
  } else if (request.action === "send_prompt") {
    callAI(request.prompt);
    console.log("What is the prompt? " + request.prompt);
    return true; // Keep channel open for async
  }
});




async function transcribeAudio(audioBlob) {
  const fishApiKey = `AIzaSyCHR0L-P6dX3rjas5mJcWeF7fI_8v5RX6Q`;
  
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
        if (p.functionCall || p.function_call) {
          return [p.functionCall || p.function_call];
        }
      }
    }
  }
  return [];
}

const model = "gemini-2.0-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const tools = [
  {
    functionDeclarations: functionDeclarations,
  }
]
async function callAI(prompt) {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      tools: tools,
    };

    try{ 
      const response = await fetch (API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEM_API_KEY
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Body: ${errorText}`);
      }

      const data = await response.json();
      console.log(data);
      const functionCalls = extractFunctionCalls(data);
      console.log("Background: Function calls:", functionCalls);

      if (functionCalls.length > 0) {
        for (const funcCall of functionCalls) {
          let args = funcCall.args ?? funcCall.arguments;
          console.log("Args: " + args);
          if (typeof args !== 'object' || args === null) continue;
          const funcToRun = functionImplementations[funcCall.name];
          if (funcToRun) {
            const executionArgs = Object.values(args);
            funcToRun(...executionArgs);
          } else {
            console.warn(`Background: No implementation found for function: ${funcCall.name}`);
          }
        }
      } else {
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResponse) {
          console.log("AI text: ", textResponse);
        } else {
          console.warn("Response contains no function call nor text:", data);
        }
      }
    } catch (error) {
      console.error("AI Call Failed", error);
  }
}

