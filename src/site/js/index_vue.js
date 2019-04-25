import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import IndexPageViewVue from "./vue_components/IndexPageViewVue";
import {addListenerForUser} from "./user_system";
import Footer from "./vue_components/Footer";

export const index_vue = new Vue({
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
  <a download href="http://localhost:8080/documentation/Phase_1/Domain Model.pdf"> Domain Model </a>
  <IndexPageViewVue/>
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
    IndexPageViewVue,
    Footer,
  },
});

