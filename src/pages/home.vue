<template>
  <f7-page name="home">
    <!-- Top Navbar -->
    <f7-navbar>
      <f7-nav-title>My App</f7-nav-title>
      <f7-nav-right>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="right"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <!-- Page content-->
    <f7-block-title class="text-align-center">Hello World!</f7-block-title>
    <f7-block>
      <f7-row>
        <f7-col></f7-col>
        <f7-col><f7-button large small fill @click="alertOnClick()">Click Me!</f7-button></f7-col>
        <f7-col></f7-col>
      </f7-row>
    </f7-block>
  </f7-page>
</template>

<script>
import { f7, f7ready } from "framework7-vue";

export default {
  methods: {
    alertOnClick() {
      f7.dialog.alert("This is a Framework7 alert notification test.", "Alert") 
    },
  },
};
</script>