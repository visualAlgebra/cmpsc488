import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import IndexPageViewVue from "./vue_components/IndexPageViewVue";
import {addListenerForUser} from "./user_system";

export const index_vue = new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-bind:user="userStruct" v-bind:oauth="oauth_user_getter" v-bind:logged="logged"></NavigationBar>
    <IndexPageViewVue></IndexPageViewVue>
  </div>
  `,
  // mounted() {
  //   console.log("here");
  //   this.TESTPOST();
  // }, methods: {
  //   TESTPOST() {
  //     let temp = createDummyProblem(20, 2);
  //     console.log(temp);
  //     post_problem_from_site(temp);
  //   }
  // },
  data(){
    return{
      userStruct:null, logged:false,
    };
  }, created(){
    addListenerForUser(this.oauth_user_getter);
  },
  methods: {
    oauth_user_getter(user) {
      this.userStruct = user;
      this.logged = true;
    },
  },
  components:
    {
      NavigationBar, IndexPageViewVue,
    }
  ,
});

