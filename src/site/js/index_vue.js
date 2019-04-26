import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import IndexPageViewVue from "./vue_components/IndexPageViewVue";
import {addListenerForUser} from "./user_system";
import Footer from "./vue_components/Footer";
import InvalidPage from "./vue_components/InvalidPage";

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
  <InvalidPage v-if="!display"></InvalidPage>
  <IndexPageViewVue v-if="display"/>
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
  }, mounted(){
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
    IndexPageViewVue,
    Footer, InvalidPage,
  },
});

