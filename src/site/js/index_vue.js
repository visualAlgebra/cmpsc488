import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import IndexPageViewVue from "./vue_components/IndexPageViewVue";

export const explorer = new Vue({
  name: "Root",

  el: "#vue-app",

  template: `
  <div>
    <NavigationBar></NavigationBar>
    <IndexPageViewVue></IndexPageViewVue>
  </div>
  `,

  data() {
    return {
    };
  },

  components: {
    NavigationBar,
    IndexPageViewVue,
  },
});
