<template>
  <f7-app v-bind="f7params">
    <!-- <video class="app__video" id="app__video" playsinline autoplay></video> -->
    <video
      class="app__video"
      id="app__video"
      ref="videoRef"
      playsinline
      autoplay
    ></video>

    <img
      class="app__img"
      id="app__img"
      ref="imageRef"
      width="224"
      height="224"
    />

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>
  </f7-app>
</template>
<script>
import { onMounted, ref } from 'vue';
import { f7, f7ready } from 'framework7-vue';

import routes from '../js/routes';
import blinkCapture from '../js/blinkPrediction';
import { useBlinkStore } from '../store/blinkStore';

export default {
  setup() {
    // Framework7 Parameters
    const f7params = {
      name: 'Blink-To-Text', // App name
      theme: 'auto', // Automatic theme detection
      routes, // App routes
    };
    const imageRef = ref(null);
    const videoRef = ref(null);

    // Loading model and starting capturing blinking
    onMounted(() => {
      f7ready(async () => {
        let predictionStarted = false;

        await blinkCapture.loadModel();
        await setUpCamera();

        // Moved after loading model to have time to initialize Pinia
        const blinkStore = useBlinkStore();

        const predict = async () => {
          let result;

          if (isMobile() && imageRef.value.src) {
            result = await blinkCapture.startPrediciton(imageRef.value);
          } else if (videoRef.value.srcObject != null) {
            result = await blinkCapture.startPrediciton(videoRef.value);
          }
          if (result) {
            if (result.longBlink) {
              console.log('long blink');
              blinkStore.setBlinkSequence('-');
            } else if (result.blink) {
              blinkStore.setBlinkSequence('.');
              console.log('short blink');
            }
          }
          if (!predictionStarted) {
            predictionStarted = true;
            f7.views.current.router.navigate('/predicting', {
              transition: 'f7-dive',
              clearPreviousHistory: true,
            });
          }
          requestAnimationFrame(predict);
        };

        predict();
      });
    });

    const isAndroid = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(userAgent)) return true;
      return false;
    };

    const isIos = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/iPad|iPhone|iPod/i.test(userAgent)) return true;
      return false;
    };

    const isMobile = () => window.cordova && (isAndroid() || isIos());

    const readImageFile = (data) => {
      // set file protocol
      const protocol = 'file://';
      let filepath = '';
      if (isAndroid()) {
        filepath = protocol + data.output.images.fullsize.file;
      } else {
        filepath = data.output.images.fullsize.file;
      }
      // read image from local file and assign to image element
      window.resolveLocalFileSystemURL(
        filepath,
        async (fileEntry) => {
          fileEntry.file(
            (file) => {
              const reader = new FileReader();
              reader.onloadend = async () => {
                const blob = new Blob([new Uint8Array(reader.result)], {
                  type: 'image/png',
                });
                imageRef.value.src = window.URL.createObjectURL(blob);
              };
              reader.readAsArrayBuffer(file);
            },
            (err) => {
              console.log('read', err);
            },
          );
        },
        (error) => {
          console.log(error);
        },
      );
    };

    const setUpCamera = async () => {
      if (isMobile()) {
        const options = {
          canvas: {
            width: 224,
            height: 224,
          },
          capture: {
            width: 224,
            height: 224,
          },
          use: 'file',
          fps: 30,
          hasThumbnail: false,
          cameraFacing: 'front',
        };
        window.plugin.CanvasCamera.start(
          options,
          async (err) => {
            console.log('Something went wrong!', err);
          },
          async (stream) => {
            await readImageFile(stream);
          },
        );
      } else {
        const constraint = {
          audio: false,
          video: {
            facingMode: 'environment',
            width: 224,
            height: 224,
          },
        };

        const handleSuccess = (stream) => {
          videoRef.value.srcObject = stream;
        };

        const handleError = (error) => {
          alert(error.message);
          console.log(
            'navigator.MediaDevices.getUserMedia error: ',
            error.message,
            error.name,
          );
        };

        navigator.mediaDevices
          .getUserMedia(constraint)
          .then(handleSuccess)
          .catch(handleError);

        return new Promise((resolve) => {
          videoRef.value.onloadedmetadata = () => {
            resolve();
          };
        });
      }
    };

    return {
      f7params,
      imageRef,
      videoRef,
    };
  },
};
</script>
