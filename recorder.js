let recorder
let source
const recordButton = document.querySelector("#record")
const stopButton = document.querySelector("#stop")
const audio = document.querySelector("audio")
const saveButton = document.querySelector("#save")
const canvas = document.querySelector("#visualizer")
const canvasCtx = canvas.getContext("2d")
const url = 'savepointurl'
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
const analyser = audioCtx.createAnalyser()
const WIDTH = 300
const HEIGHT = 50


recordButton.addEventListener('click', () => {
    audioCtx.resume()
    // Request permissions to record audio
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        recorder = new MediaRecorder(stream)
        source = audioCtx.createMediaStreamSource(stream)
        source.connect(analyser)
        analyser.fftSize = 2048;
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        const draw = () => {
            requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray)
            canvasCtx.fillStyle = 'rgb(255, 244, 205)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
            canvasCtx.beginPath();
            // line width
            let sliceWidth = WIDTH * 1.0 / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength - 1; i++) {

                let v = dataArray[i] / 128.0;

                let y = v * (HEIGHT / 2);

                if (i == 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }
            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();

        }
        draw();


        // Set record to <audio> when recording will be finished
        recorder.addEventListener('dataavailable', e => {
            // console.log(e.data);
            audio.src = URL.createObjectURL(e.data)
            // Add save event listener and send to server.
            saveButton.addEventListener('click', () => {
                // console.log(e.data)
                fetch(url, { method: 'POST', body: e.data })
                    .then(res => { alert('posted recording') })
                    .catch(err => alert('error ' + err))
            })
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

