import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import Footer from "./vue_components/Footer";

export const about_vue = new Vue({
  name: "Root",
  el: "#vue-app",
  template: `
<main>
  <NavigationBar
    :user="userStruct"
    :oauth_user_getter="oauth_user_getter"
    :oauth_user_remover="oauth_user_remover"
    :logged="logged"
  ></NavigationBar>
  <Footer/>
</main>
  `,

  components: {
    NavigationBar,
    Footer,
  },
});