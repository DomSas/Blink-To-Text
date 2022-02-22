<template>
  <f7-app v-bind="f7params">
    <video class="app__video" id="app__video" playsinline></video>
    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>
  </f7-app>
</template>
<script>
import { ref, onMounted } from 'vue';
import { f7, f7ready } from 'framework7-vue';

import routes from '../js/routes';
import blinkCapture from '../js/blinkCapture';

export default {
  setup() {
    // Framework7 Parameters
    const f7params = {
      name: 'Blink-To-Text', // App name
      theme: 'auto', // Automatic theme detection
      routes, // App routes
    };

    // Loading model and starting capturing blinking
    onMounted(() => {
      f7ready(async () => {
        const videoElement = document.getElementById('app__video');
        let predictionStarted = false;

        await blinkCapture.loadModel();
        await blinkCapture.setUpCamera(videoElement);

        const predict = async () => {
          const result = await blinkCapture.startPrediciton();
          if (result) {
            if (result.longBlink) {
              console.log('long blink');
            } else if (result.blink) {
              console.log('short blink');
            }
          }
          if (!predictionStarted) {
            predictionStarted = true;
            f7.views.current.router.navigate('/predicting', {
              transition: 'f7-dive', clearPreviousHistory: true,
            });
          }
          requestAnimationFrame(predict);
        };

        predict();
      });
    });

    const text = ref('Right panel content goes here');

    return {
      f7params,
      text,
    };
  },
};
</script>
