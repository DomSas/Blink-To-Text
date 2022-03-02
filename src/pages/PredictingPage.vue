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
        class="predicting-page__video"
        id="predicting-page__video"
        playsinline
        autoplay
      ></video>

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

export default {
  setup() {
    const videoRef = ref(null);

    const blinkStore = useBlinkStore();

    const playVideo = () => {
      const video = document.getElementById('predicting-page__video');

      if (!isMobile()) {
        navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: {
              facingMode: 'user',
              width: 500,
              height: 500,
            },
          })
          .then((stream) => {
            video.srcObject = stream;
          })
          .catch((err) => {
            console.log('Something went wrong!', err);
          });
      }
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

    onMounted(() => {
      playVideo();
    });

    return {
      blinkStore,
      videoRef,
      startCapturing,
      stopCapturing,
      removeLastLetter,
    };
  },
};
</script>
