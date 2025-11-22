//document.addEventListener('keydown', (e) => {
 // if (e.key === 'A') {
   // alert("you pressed A");
   // console.log("you pressed A");
 // }
//});


import { FishAudioClient } from "fish-audio";
import { createReadStream } from "fs";

const fishAudio = new FishAudioClient({ apiKey: "bcda3e3389e54ae2bcc965572a75288d" });

const result = await fishAudio.speechToText.convert({
  audio: createReadStream("welcome.mp3"),
});

console.log(result.text);
console.log("Duration (s):", result.duration);