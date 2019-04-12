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
import CreateProblemModal from "./vue_components/CreateProblemModal";
import CreatorWindow from "./vue_components/CreatorWindow";

export const creator_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-bind:user="userStruct" v-bind:oauth="oauth_user_getter" v-bind:logged="logged"></NavigationBar>
    <InvalidPage v-if="!display"></InvalidPage>
    <CreatorNavigationButtons
      v-if="display"
      :clearStartStage="clearStartStage"
      :clearGoalStage="clearGoalStage"
      :setWorkTree="setWorkTree"
      :stage="stage"
      :clearTree="clearTree"
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
    <CreateProblemModal v-if="finish" v-bind:closeFinish="closeFinish"></CreateProblemModal>
    <CreatorWindow
      v-if="stage === 'build' && workTree !== null"
      :mouse="mouse"
      :tree="workTree"
      :useCreatedTree="setWorkTree"
    ></CreatorWindow>
  </div>
  `,
  data: () => ({
    stage: "build",display: true,workTree: null,createdProblem:[null,null], desc:"",time:"",mouse: new Mouse(null), lessonID: null, userStruct:null, logged:false, finish:false, problemID:null,
  }), created(){
    addListenerForUser(this.oauth_user_getter);
  }, mounted() {
    M.AutoInit();
    if(this.getURL()!==null){
      getProblemFromDBVue(this.problemID,this.distribute);
    }
    this.mouse = new Mouse(this);
  },
  methods: {
    oauth_user_getter(user){
      this.userStruct=user;
      this.logged = true;
    }, resolveFinishProblem(){
      this.finish=true;
      window.setTimeout(() => {M.Modal.getInstance(document.getElementById('finishProblemModal')).open(); } , 0);
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
    }, closeFinish(){
      this.finish=false;
    }, clearStartStage() {
      if(this.workTree===null){
        alert("There must be at least some problem to continue to making goal expression");
        return;
      }
      this.stage = "manip";
      this.createdProblem[0] = this.workTree.toString();
    }, clearGoalStage() {
      if(this.workTree===null){
        alert("Goal expression must contain atleast some element");
        return;
      }
      if(this.createdProblem[0]===this.workTree.toString()){
        alert("Problem Must not be exactly the same as start expression");
        return;
      }
      this.stage = "build";
      this.createdProblem[1] = this.workTree.toString();
      this.resolveFinishProblem();
    }, clearTree() {
      this.workTree=null;
    }, distribute(res, code) {
      if(code===2) {//start
        this.workTree = Deserialize(res);
        console.log("ADFASDFASDF", this.workTree);
        this.display = true;
      }
    }, setWorkTree(tree) {
      this.workTree = tree;
    },
  },
  components: {
    NavigationBar,
    CreatorSpecificActionButtons,
    CreatorNavigationButtons,
    ManipulatorWindow,
    InvalidPage,
    CreateProblemModal,
    CreatorWindow,
  },
});
