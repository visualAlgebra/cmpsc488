import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import Footer from "./vue_components/Footer";
import AboutPage from "./vue_components/AboutPage";
import {addListenerForUser} from "./user_system";

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
  <AboutPage/>
  <Footer/>
</main>
  `,

  data() {
    return {
      userStruct: null, logged: false,
    };
  },

  created() {
    addListenerForUser(this.oauth_user_getter);
  },

  methods: {
    oauth_user_getter(user) {
      this.userStruct = user;
      this.logged = true;
    },

    oauth_user_remover() {
      this.usersStruct = null;
      this.logged = false;
    },
  },

  components: {
    NavigationBar,
    AboutPage,
    Footer,
  },
});