import Vue from "vue";
import ExpressionTree from "./vue_components/ExpressionTree";
import NavigationBar from "./vue_components/NavigationBar";
import ExplorerPageTop from "./vue_components/ExplorerPageTop";
import ProblemsHolder from "./vue_components/ProblemsHolder";
import {get_problems_from_db} from "./database_management";
import {addListenerForUser} from "./user_system";
import ExplorerAIGenerationModal from "./vue_components/ExplorerAIGenerationModal";
import Footer from "./vue_components/Footer";
import InvalidPage from "./vue_components/InvalidPage";
import {singleExpressionDecompression} from "./display_feature";
import {Deserialize} from "./expression_tree";

export const explorer_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-bind:user="userStruct" v-bind:oauth_user_getter="oauth_user_getter" v-bind:oauth_user_remover="oauth_user_remover" v-bind:logged="logged"></NavigationBar>
    <InvalidPage v-if="!display"></InvalidPage>
    <div class="container">
      <ExplorerPageTop v-if="display"></ExplorerPageTop>
      <ProblemsHolder v-if="display&&problemsToDisplay&&amtConfirmed===(problemsToDisplayCount*2)" v-bind:problems="problemsToDisplay" v-bind:type="'explorer'"></ProblemsHolder>
      <ExplorerAIGenerationModal v-bind:userStruct="userStruct"></ExplorerAIGenerationModal>
    </div>
    <Footer/>
  </div>
  `, data(){
    return {
      display:false, problemsToDisplayCount: 10, problemsToDisplay: null, userStruct:null, logged:false, amtConfirmed:0
    };
  }, created(){
    addListenerForUser(this.oauth_user_getter);
  }, mounted(){
    get_problems_from_db(this.problemsToDisplayCount, res=>{
      this.problemsToDisplay=res;
      for(let x=0; x<this.problemsToDisplay.length; x++){
        singleExpressionDecompression(this.problemsToDisplay[x].expression_goal, res => {
          this.problemsToDisplay[x].expression_goal = Deserialize(res);
          this.amtConfirmed++;
        });
        singleExpressionDecompression(this.problemsToDisplay[x].expression_start, res => {
          this.problemsToDisplay[x].expression_start = Deserialize(res);
          this.amtConfirmed++;
        });
      }
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
    ExpressionTree, NavigationBar, ExplorerPageTop, ProblemsHolder, ExplorerAIGenerationModal, Footer, InvalidPage,
  },
});
