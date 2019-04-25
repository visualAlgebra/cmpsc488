import Vue from "vue";
import ExpressionTree from "./vue_components/ExpressionTree";
import NavigationBar from "./vue_components/NavigationBar";
import ExplorerPageTop from "./vue_components/ExplorerPageTop";
import ProblemsHolder from "./vue_components/ProblemsHolder";
import {get_problems_from_db} from "./database_management";
import {addListenerForUser} from "./user_system";
import ExplorerAIGenerationModal from "./vue_components/ExplorerAIGenerationModal";
import Footer from "./vue_components/Footer";

export const explorer_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-bind:user="userStruct" v-bind:oauth_user_getter="oauth_user_getter" v-bind:oauth_user_remover="oauth_user_remover" v-bind:logged="logged"></NavigationBar>
    <ExplorerPageTop></ExplorerPageTop>
    <ProblemsHolder v-if="display&&problemsToDisplay" v-bind:problems="problemsToDisplay" v-bind:type="'explorer'"></ProblemsHolder>
    <ExplorerAIGenerationModal v-bind:userStruct="userStruct"></ExplorerAIGenerationModal>
    <Footer/>
  </div>
  `, data(){
    return {
      display:false, problemsToDisplayCount: 10, problemsToDisplay: null, userStruct:null, logged:false,
    };
  }, created(){
    addListenerForUser(this.oauth_user_getter);
  }, mounted(){
    get_problems_from_db(this.problemsToDisplayCount, res=>{
      this.problemsToDisplay=res;
      this.display=true;
    });
  },
  methods: {
    oauth_user_getter(user) {
      this.userStruct = user;
      this.logged = true;
    }, oauth_user_remover(){
      this.usersStruct=null;
      this.logged=false;
    },
  }, components: {
    ExpressionTree, NavigationBar, ExplorerPageTop, ProblemsHolder, ExplorerAIGenerationModal, Footer,
  },
});
