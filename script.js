const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  // faceapi.loadSsdMobilenetv1Model.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

function getLabeledFaceDescriptions() {

  console.log("labeling faces") 
  const labels = ["cheefung"];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 1; i++) {
        const img = await faceapi.fetchImage(`/labels/${label}/${i}.jpg`);
        const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptor()
          descriptions.push(detections.descriptor);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

var detectionTimer = 0;
var labeledFaceDescriptors;
var faceMatcher;
var canvas;
var displaySize;
video.addEventListener('play', async () => {
  console.log("video started") 
  /*
  labeledFaceDescriptors = await getLabeledFaceDescriptions();
  var labeledFaceDescriptorsJsonObj = labeledFaceDescriptors.map(x=>x.toJSON())
  var labeledFaceDescriptorsJson = JSON.stringify(labeledFaceDescriptorsJsonObj)
  console.log(labeledFaceDescriptorsJson)
  */
  var labeledFaceDescriptorsJson = JSON.parse('[{"label":"cheefung","descriptors":[[-0.1368684023618698,0.09361958503723145,0.10230833292007446,-0.0014651576057076454,-0.05133257806301117,-0.053066104650497437,-0.0658598244190216,-0.17837733030319214,0.06599295884370804,-0.0650678351521492,0.2776595950126648,-0.0884867012500763,-0.19434480369091034,-0.1332128494977951,-0.05412815511226654,0.21287865936756134,-0.1518806368112564,-0.10858902335166931,-0.06093791872262955,-0.009702911600470543,0.058672547340393066,0.0003044275799766183,0.04071442037820816,0.03355288505554199,-0.04838097468018532,-0.3204135000705719,-0.10140734165906906,-0.09200481325387955,-0.014044268056750298,-0.03006976842880249,-0.06971801817417145,0.01730354130268097,-0.18662138283252716,-0.0750913992524147,0.01975127123296261,0.0775439664721489,-0.0739583745598793,-0.09080205857753754,0.17482633888721466,-0.059219300746917725,-0.16381151974201202,0.005930922459810972,0.11373557150363922,0.21631057560443878,0.13688082993030548,0.05787510797381401,0.04661015421152115,-0.13507889211177826,0.07783211767673492,-0.12630751729011536,0.036335501819849014,0.13190950453281403,0.11405180394649506,0.08834730088710785,0.04108427092432976,-0.14494623243808746,0.0025975313037633896,0.10988936573266983,-0.07510004192590714,0.03408735617995262,0.0813797116279602,-0.02420945279300213,-0.03686199337244034,-0.14056675136089325,0.2995973527431488,0.08965429663658142,-0.15911027789115906,-0.11733939498662949,0.12108717113733292,-0.05157371982932091,-0.08210954070091248,0.030519915744662285,-0.17119814455509186,-0.1854175180196762,-0.2817494571208954,0.059463195502758026,0.36230599880218506,0.04449089989066124,-0.2199658900499344,0.00785168819129467,-0.050148624926805496,-0.006965328939259052,0.08793065696954727,0.16668701171875,-0.008042522706091404,0.0319029875099659,-0.06903152167797089,-0.050175465643405914,0.18442003428936005,-0.07850628346204758,0.006656346842646599,0.2059382051229477,-0.024691613391041756,0.032884418964385986,-0.0011415433837100863,0.003939025569707155,-0.060244061052799225,0.054130811244249344,-0.12776531279087067,0.00992226880043745,0.01848987117409706,-0.04803894832730293,-0.005203587934374809,0.07226096093654633,-0.08903665095567703,0.05318890139460564,0.028452793136239052,0.061866387724876404,0.032104797661304474,-0.0035754472482949495,-0.1328432857990265,-0.10140760242938995,0.10606067627668381,-0.21616734564304352,0.20628167688846588,0.13348394632339478,0.04372208192944527,0.11310510337352753,0.14384551346302032,0.18035988509655,-0.005738220177590847,0.024112725630402565,-0.17486681044101715,-0.008604798465967178,0.14483262598514557,-0.01133741158992052,0.04441087692975998,0.023812005296349525]]}]')
  
  labeledFaceDescriptors = labeledFaceDescriptorsJson.map( x=>faceapi.LabeledFaceDescriptors.fromJSON(x) );
  console.log(labeledFaceDescriptors)
  faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
  canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)

  displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  console.log("ready to detect")
    startDetection()
})

function startDetection(){
  detectionTimer = setTimeout(matchFaces, 100)
}

async function matchFaces(){   
  console.log("matching face")
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({inputSize:160}))
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors()
  console.log("after detect")
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

      let results = resizedDetections.map((d) => {
        if (d.descriptor){
           let label = faceMatcher.findBestMatch(d.descriptor);
           const options = { label }
           const drawBox = new faceapi.draw.DrawBox(d.detection.box, options)
           drawBox.draw(canvas)
           return label
        }
      });
      console.log(results)

      startDetection()
}