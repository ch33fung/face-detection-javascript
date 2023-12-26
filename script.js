const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUrl('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUrl('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUrl('/models'),
  faceapi.nets.faceExpressionNet.loadFromUrl('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  setInterval
})