<template>
  <f7-page name="LoadingPage">
    <div class="loading-page">
      <h1 class="loading-page__heading">Blink-To-Text</h1>

      <img
        class="loading-page__img"
        src="../static/images/blink.png"
        alt="eye_logo"
      />
      <f7-preloader
        class="loading-page__spinner"
        :size="35"
        color="white"
      ></f7-preloader>

      <h3 class="loading-page__loading-text">
        Please wait until the app<br />finishes loading...
      </h3>
      <video class="loading-page__video" id="video" playsinline></video>

      <p class="loading-page__app-info">
        Created by Asial Corporation<br />App Version: 1.0.0
      </p>
    </div>
  </f7-page>
</template>

<script>
import { f7 } from 'framework7-vue';
import blinkCapture from '../js/blinkCapture';

export default {
  async mounted() {
    const videoElement = document.querySelector('video');
    let predictionStarted = false;

    await blinkCapture.loadModel();
    await blinkCapture.setUpCamera(videoElement);

    const predict = async () => {
      const result = await blinkCapture.getBlinkPrediction();
      if (result) {
        if (result.longBlink) {
          console.log('long blink');
        } else if (result.blink) {
          console.log('short blink');
        }
      }
      if (!predictionStarted) {
        predictionStarted = true;
        f7.views.current.router.navigate('/predicting');
      }
      requestAnimationFrame(predict);
    };

    predict();
  },
};
</script>
