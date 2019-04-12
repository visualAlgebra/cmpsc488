import Vue from "vue";
import ExpressionTree from "./vue_components/ExpressionTree";
import NavigationBar from "./vue_components/NavigationBar";
import ExplorerPageTop from "./vue_components/ExplorerPageTop";
import ProblemsHolder from "./vue_components/ProblemsHolder";
import {get_problems_from_db} from "./database_management";
import {addListenerForUser} from "./user_system";
import ExplorerAIGenerationModal from "./vue_components/ExplorerAIGenerationModal";

export const explorer_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-bind:user="userStruct" v-bind:oauth="oauth_user_getter" v-bind:logged="logged"></NavigationBar>
    <ExplorerPageTop></ExplorerPageTop>
    <ProblemsHolder
      v-if="display&&problemsToDisplay"
      :problems="problemsToDisplay"
      ></ProblemsHolder>
      <ExplorerAIGenerationModal v-bind:userStruct="userStruct"></ExplorerAIGenerationModal>
  </div>
  `, data(){
    return {
      display:false, problemsToDisplayCount: 1, problemsToDisplay: null, userStruct:null, logged:false,
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
    },
  }, components: {
    ExpressionTree, NavigationBar, ExplorerPageTop, ProblemsHolder, ExplorerAIGenerationModal,
  },
});
