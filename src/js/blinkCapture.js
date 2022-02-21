import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';

let model; let video; let
  event;
const VIDEO_SIZE = 500;
let blinkCount = 0;
let rendering = true;
const EAR_THRESHOLD = 0.27;

// Loading model from Tensorflow.js
const loadModel = async () => {
  model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
    { maxFaces: 1 },
  );
};

const setUpCamera = async (videoElement) => {
  video = videoElement;
  const mediaDevices = await navigator.mediaDevices.enumerateDevices();

  const defaultWebcam = mediaDevices.find(
    (device) => device.kind === 'videoinput' && device.label.includes('Built-in'),
  );

  const cameraId = defaultWebcam ? defaultWebcam?.deviceId : undefined;

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
      deviceId: cameraId,
      width: VIDEO_SIZE,
      height: VIDEO_SIZE,
    },
  });

  video.srcObject = stream;
  video.play();
  video.width = VIDEO_SIZE;
  video.height = VIDEO_SIZE;

  // Change it, since it does not expect anything to return
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
};

function stopPrediction() {
  rendering = false;
}

// Calculate the position of eyelid to predict a blink
function getEAR(upper, lower) {
  function getEucledianDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

  return (
    (getEucledianDistance(upper[5][0], upper[5][1], lower[4][0], lower[4][1])
      + getEucledianDistance(
        upper[3][0],
        upper[3][1],
        lower[2][0],
        lower[2][1],
      ))
    / (2
      * getEucledianDistance(upper[0][0], upper[0][1], upper[8][0], upper[8][1]))
  );
}

async function renderPrediction() {
  if (rendering) {
    // Sending video to model for prediction
    const predictions = await model.estimateFaces({
      input: video,
    });

    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        // Right eye parameters
        const lowerRight = prediction.annotations.rightEyeUpper0;
        const upperRight = prediction.annotations.rightEyeLower0;
        const rightEAR = getEAR(upperRight, lowerRight);
        // Left eye parameters
        const lowerLeft = prediction.annotations.leftEyeUpper0;
        const upperLeft = prediction.annotations.leftEyeLower0;
        const leftEAR = getEAR(upperLeft, lowerLeft);

        // True if the eye is closed
        const blinked = leftEAR <= EAR_THRESHOLD && rightEAR <= EAR_THRESHOLD;

        // Determine how long you blinked
        if (blinked) {
          event = {
            blink: false,
            longBlink: false,
          };
          blinkCount += 1;
        } else {
          event = {
            blink: blinkCount <= 5 && blinkCount !== 0,
            longBlink: blinkCount > 5,
          };
          blinkCount = 0;
        }
      });
    }
  }
  return event;
}

const blinkCapture = {
  loadModel,
  setUpCamera,
  stopPrediction,
  getBlinkPrediction: renderPrediction,
};

export default blinkCapture;
