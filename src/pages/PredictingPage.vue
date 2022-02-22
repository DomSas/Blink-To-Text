<template>
  <f7-page name="PredictingPage">
    <div class="predicting-page">
      <h3 class="predicting-page__title">Blink-To-Text</h3>
      <p class="predicting-page__description">Use <a href="/morse-code">Morse Code</a> method: <br/> Short blink - dot <br/> Long blink - dash</p>
      <video class="predicting-page__video" id="predicting-page__video" playsinline></video>

      <p class="predicting-page__recognized-blink-title">Recognized blink:</p>
      <div class="predicting-page__recognized-blink-container">

      </div>

      <p class="predicting-page__recognized-text-title">Recognized text:</p>
      <div class="predicting-page__recognized-text-container">
        <p class="predicting-page__recognized-text-p"></p>
      </div>

      <div class="predicting-page__btns-container">
        <button class="predicting-page__start-capturing-btn" @click="playVideo">Start Capturing</button>
        <button class="predicting-page__remove-letter-btn">Remove Letter</button>
      </div>

    </div>

  </f7-page>
</template>

<script>
export default {
  mounted() {
    const video = document.getElementById('predicting-page__video');

    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: 500,
        height: 500,
      },
    })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log('Something went wrong!', err);
      });
  },
  methods: {
    playVideo() {

    },
  },
};
</script>
