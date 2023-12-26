const video = document.getElementById('video')

function startVideo() {
  navigator.getUsedMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

startVideo