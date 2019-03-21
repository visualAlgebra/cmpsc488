import Vue from "vue";
import ExpressionTree from "./vue_components/ExpressionTree";
import {Variable} from "./expression_tree";
import NavigationBar from "./vue_components/NavigationBar";

export const profile_vue = new Vue({
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
