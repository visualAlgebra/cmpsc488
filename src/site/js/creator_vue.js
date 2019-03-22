import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";

export const creator_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar></NavigationBar>
    <p>Welcome from vue</p>
  </div>
  `, components: {
    NavigationBar,
  },
});
