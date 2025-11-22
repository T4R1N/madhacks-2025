//document.addEventListener('keydown', (e) => {
 // if (e.key === 'A') {
   // alert("you pressed A");
   // console.log("you pressed A");
 // }
//});

const mic_btn = document.getElementById('speech_button');
mic_btn.addEventListener("click", recordAudio)

let can_record = false;
let is_recording = false;

let recorder = null;

let chunks = [];
function SetupAudio() {
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true
      })
      .then(SetupStream)
      .catch(err => {
        console.error(err);
      });
  }
}
SetupAudio();

function SetupStream(stream) {
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = e => {
    chunks.push(e.data);
  }
  recorder.onstop = e => {
    const blob = new Blob(chunks, {type: "audio/mp3; codecs=opus"})
    chunks = [];
    const audioURL = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = audioURL;
    a.download = `recording-${Date.now()}.mp3`;
    a.click();
  }
  can_record = true;
}

function recordAudio() {
  if(!can_record) return;
  is_recording = !is_recording;
  if (is_recording) {
    recorder.start();
  } else {
    recorder.stop();
  }
  alert("yes");
}


