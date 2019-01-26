// const record = document.querySelector('#record');
// const stop = document.querySelector('#stop');
// const soundClips = document.querySelector('#sound-clips');
// const canvas = document.querySelector('#visualizer');
// const mainSection = document.querySelector('#main-controls');

// // disable stop button while not recording

// stop.disabled = true;

// // visualiser setup - create web audio api context and canvas Not done yet.

// // const audioCtx = new (window.AudioContext || webkitAudioContext)();
// // const canvasCtx = canvas.getContext("2d");

// //main block for doing the audio recording

// if (navigator.mediaDevices.getUserMedia) {
//     console.log('getUserMedia supported.');

//     let chunks = [];

//     const onSuccess = (stream) => {

//         const mediaRecorder = new MediaRecorder(stream);

//         record.onclick = function () {
//             mediaRecorder.start();
//             stop.disabled = false;
//             record.disabled = true;
//             canvas.innerText = 'Cool waveform indicates recording here.'
//         }

//         stop.onclick = function () {
//             mediaRecorder.stop();
//             stop.disabled = true;
//             record.disabled = false;
//             canvas.innerText = ''
//         }

//         mediaRecorder.onstop = function (e) {
//             let clipContainer = document.createElement('article');
//             let audio = document.createElement('audio');
//             let deleteButton = document.createElement('button');
//             let saveButton = document.createElement('button')

//             clipContainer.classList.add('clip');
//             audio.setAttribute('controls', '');
//             deleteButton.textContent = 'Delete';
//             deleteButton.className = 'delete';
//             saveButton.textContent = 'Save File';
//             saveButton.className = 'save';

//             clipContainer.appendChild(audio);
//             clipContainer.appendChild(deleteButton);
//             clipContainer.appendChild(saveButton)
//             soundClips.appendChild(clipContainer);

//             audio.controls = true;
//             let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
//             chunks = [];
//             let audioURL = window.URL.createObjectURL(blob);
//             audio.src = audioURL;
//             console.log("recorder stopped");

//             deleteButton.onclick = (e) => {
//                 evtTgt = e.target;
//                 evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
//             }

//             saveButton.onclick = (e) => {
//                 console.log(blob)
//                 alert(`Save sends this ${blob.size}-bit audio blob to server`)
//             }
//         }

//         mediaRecorder.ondataavailable = function (e) {
//             chunks.push(e.data);
//         }
//     } // onSuccess

//     const onError = (err) => {
//         console.log('The following error occured: ' + err);
//     }

//     navigator.mediaDevices.getUserMedia({ audio: true }).then(onSuccess, onError);

// } else {
//     console.log('getUserMedia not supported on your browser!');
// }

let recorder
const recordButton = document.querySelector("#record")
const stopButton = document.querySelector("#stop")
const audio = document.querySelector("audio")

recordButton.addEventListener('click', () => {
    // Request permissions to record audio
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        recorder = new MediaRecorder(stream)

        // Set record to <audio> when recording will be finished
        recorder.addEventListener('dataavailable', e => {
            audio.src = URL.createObjectURL(e.data)
        })

        // Start recording
        recorder.start()
    })
})

stopButton.addEventListener('click', () => {
    // Stop recording
    recorder.stop()
    // Remove “recording” icon from browser tab
    recorder.stream.getTracks().forEach(i => i.stop())
})