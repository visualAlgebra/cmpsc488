import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";

export const manipulatorWindow = new Vue({
  name: "Root",

  el: "#vue-app",

  template: `
  <div>
    <NavigationBar></NavigationBar>
  </div>
  `,

  data() {
    return {
    };
  },

  components: {
    NavigationBar,
  },
});
