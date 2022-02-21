<template>
  <f7-page name="PredictingPage">
        <f7-button large small fill @click="alertOnClick()">Click Me!</f7-button>
        <f7-col></f7-col>
    <h1 class="hi">Predicting</h1>
  </f7-page>
</template>

<script>
export default {
  methods: {
    alertOnClick() {
      console.log('wee');
    },
  },
};
</script>
