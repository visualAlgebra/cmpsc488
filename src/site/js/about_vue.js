import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import Footer from "./vue_components/Footer";
import AboutPage from "./vue_components/AboutPage";
import {addListenerForUser} from "./user_system";
import InvalidPage from "./vue_components/InvalidPage";

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
  <InvalidPage v-if="!display"></InvalidPage>
  <AboutPage v-if="display"/>
  <Footer/>
</main>
  `,

  data() {
    return {
      display:false, userStruct: null, logged: false,
    };
  },

  created() {
    addListenerForUser(this.oauth_user_getter);
  },mounted(){
    this.display=true;
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
    Footer, InvalidPage,
  },
});
