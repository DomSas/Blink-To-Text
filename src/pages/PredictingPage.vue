<template>
  <f7-page name="PredictingPage">
    <div class="predicting-page">
      <h3 class="predicting-page__title">Blink-To-Text</h3>
      <p class="predicting-page__description">
        Use <a href="/morse-code">Morse Code</a> method: <br />
        Short blink - dot <br />
        Long blink - dash
      </p>
      <video
        v-if="!isPhone"
        class="predicting-page__video"
        id="predicting-page__video"
        ref="videoRef"
        playsinline
        autoplay
      ></video>
      <img
        v-else
        class="predicting-page__img"
        id="predicting-page__img"
        ref="imageRef"
        width="224"
        height="224"
        src="../static/images/blink.png"
      />

      <p class="predicting-page__recognized-blink-title">Recognized blink:</p>
      <div class="predicting-page__recognized-blink-container">
        <p
          class="predicting-page__recognized-blink-sequence"
          v-for="(sign, index) in blinkStore.blinkSequence"
          :key="index"
        >
          {{ sign }}
        </p>
      </div>

      <p class="predicting-page__recognized-text-title">Recognized text:</p>
      <div class="predicting-page__recognized-text-container">
        <p class="predicting-page__recognized-text-p">
          {{ blinkStore.convertedLetters }}
        </p>
      </div>

      <div class="predicting-page__btns-container">
        <a
          class="predicting-page__start-capturing-btn"
          v-if="!blinkStore.capturing"
          @click="startCapturing"
          :disabled="blinkStore.capturing"
          >Start Capturing</a
        >
        <a
          class="predicting-page__stop-capturing-btn"
          v-else
          @click="stopCapturing"
          :disabled="blinkStore.capturing"
          >Stop Capturing</a
        >
        <a class="predicting-page__remove-letter-btn" @click="removeLastLetter"
          >Remove Letter</a
        >
      </div>
    </div>
  </f7-page>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useBlinkStore } from '../store/blinkStore';
import blinkCapture from '../js/blinkPrediction';
import hybridFunctions from '../js/hybridFunctions';

export default {
  setup() {
    const videoRef = ref(null);
    const imageRef = ref(null);
    const isPhone = ref(null);
    const blinkStore = useBlinkStore();

    const playVideo = async () => {
      if (!hybridFunctions.isMobile()) {
        hybridFunctions
          .getBrowserCamera()
          .then((stream) => {
            videoRef.value.srcObject = stream;
          })
          .catch((err) => {
            console.log('Something went wrong!', err);
          });

        return new Promise((resolve) => {
          videoRef.value.onloadedmetadata = () => {
            resolve();
          };
        });
      }
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
          readImageFile(stream);
        },
      );
    };

    const readImageFile = (data) => {
      // set file protocol
      const protocol = 'file://';
      let filepath = '';
      if (hybridFunctions.isAndroid()) {
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

    const startCapturing = () => {
      blinkStore.startCapturingBlinks();
    };
    const stopCapturing = () => {
      blinkStore.stopCapturingBlinks();
    };

    const removeLastLetter = () => {
      blinkStore.removeLastLetter();
    };

    onMounted(async () => {
      isPhone.value = hybridFunctions.isMobile();
      await playVideo();

      const predict = async () => {
        let result;
        if (hybridFunctions.isMobile() && imageRef.value.src) {
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
        requestAnimationFrame(predict);
      };

      predict();
    });

    return {
      blinkStore,
      imageRef,
      videoRef,
      isPhone,
      startCapturing,
      stopCapturing,
      removeLastLetter,
    };
  },
};
</script>
