import { FishAudioClient } from "fish-audio";
import { createReadStream } from "fs";
import "dotenv/config";

console.log(`Database password is ${ process.env.FISH_API_KEY }`);

const fishAudio = new FishAudioClient({ apiKey: process.env.FISH_API_KEY });

const result = await fishAudio.speechToText.convert({
  audio: createReadStream("audio.mp3"),
});

console.log(result.text);
console.log("Duration (s):", result.duration);
