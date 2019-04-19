import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import CreatorSpecificActionButtons from "./vue_components/CreatorSpecificActionButtons";
import CreatorNavigationButtons from "./vue_components/CreatorNavigationButtons";
import ManipulatorWindow from "./vue_components/ManipulatorWindow";
import * as M from "materialize-css";
import {getProblemFromDBVue} from "./display_feature";
import {Deserialize} from "./expression_tree";
import {Mouse} from "./gui";
import InvalidPage from "./vue_components/InvalidPage";
import {addListenerForUser, signIn} from "./user_system";
import PublishProblemModal from "./vue_components/PublishProblemModal";
import CreatorWindow from "./vue_components/CreatorWindow";

export const creator_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-bind:user="userStruct" v-bind:oauth_user_getter="oauth_user_getter" v-bind:oauth_user_remover="oauth_user_remover" v-bind:logged="logged"></NavigationBar>
    <InvalidPage v-if="!display"></InvalidPage>
    <CreatorNavigationButtons
      v-if="display"
      :stage="stage"
      :clearTree="clearTree"
      :problemIsSavable="problemIsSavable()"
      :editStartTree="editStartTree"
      :saveProblem="saveProblem"
    ></CreatorNavigationButtons>
    <CreatorSpecificActionButtons
      v-if="display"
      :mouse="mouse"
    ></CreatorSpecificActionButtons>
    <ManipulatorWindow
      v-if="display&&workTree"
      :tree="workTree"
      :mouse="mouse"
    ></ManipulatorWindow>
    <CreatorWindow
      v-if="stage === 'build'"
      :tree="workTree"
      :useCreatedTree="setStartTree"
    ></CreatorWindow>
    <PublishProblemModal
      v-if="finish"
      v-bind:closeFinish="closeFinish"
      v-bind:createdProblem="createdProblem"
      v-bind:userStruct="userStruct"
    ></PublishProblemModal>
  </div>
  `,
  data: () => ({
    stage: "build", display: true,workTree: null, startTree: null, createdProblem:[null,null], desc:"",time:"",mouse: null, lessonID: null, userStruct:null, logged:false, finish:false, problemID:null,
  }), created(){
    addListenerForUser(this.oauth_user_getter);
    this.mouse = new Mouse(this);
  }, mounted() {
    M.AutoInit();
    if(this.getURL()!==null){
      getProblemFromDBVue(this.problemID,this.distribute);
    }
  },
  methods: {
    problemIsSavable(){
      return this.startTree !== null
          && this.workTree !== null
          && !this.startTree.equals(this.workTree);
    }, oauth_user_getter(user){
      this.userStruct=user;
      this.logged = true;
    }, oauth_user_remover(){
      this.usersStruct=null;
      this.logged=false;
    }, resolveFinishProblem(){
    }, getURL(){
      let argArr=(window.location.href).split('/');
      if(argArr.length>=5){
        this.problemID=argArr[4];
        if(argArr[6]!==undefined){
          this.lessonID=argArr[6];
        }
        if(argArr[5]!==undefined){
          this.problemID+='/'+argArr[5];
        }
      }else{
        return null;
      }
      return this.problemID;
    }, closeFinish(res){
      this.finish=false;
      window.location.href="http://localhost:8080/manipulator/problems/"+res
    }, clearTree() {
      this.workTree=null;
    }, distribute(res, code) {
      if(code===2) {//start
        this.workTree = Deserialize(res);
        this.display = true;
      }
    }, setStartTree(tree){
      this.startTree=tree.clone();// Save a copy as the start tree.
      this.workTree=tree;
      this.stage="manip";
    }, editStartTree(){
      this.workTree=this.startTree;// We can reuse startTree obj since workTree is overwritten.
      this.stage="build";
    }, saveProblem(){
      this.createdProblem = [this.startTree.toString(), this.workTree.toString()];
      this.finish=true;
      window.setTimeout(() => {
        const modal = document.getElementById('finishProblemModal');
        M.Modal.getInstance(modal).open();
      }, 0);
    }
  },
  components: {
    NavigationBar,
    CreatorSpecificActionButtons,
    CreatorNavigationButtons,
    ManipulatorWindow,
    InvalidPage,
    PublishProblemModal,
    CreatorWindow,
  },
});
