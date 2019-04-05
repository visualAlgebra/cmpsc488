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

export const creator_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar></NavigationBar>
    <InvalidPage v-if="!display"></InvalidPage>
    <CreatorNavigationButtons
      v-if="display"
      :goToNextStage="goToNextStage"
      :stage="stage"
      :setWorkTree="setWorkTree"
      v-bind:clearTree="clearTree"
      v-bind:lessonID="lessonID"
    ></CreatorNavigationButtons>
    <CreatorSpecificActionButtons
      v-if="display"
      :mouse="mouse"
    ></CreatorSpecificActionButtons>
    <ManipulatorWindow v-if="display&&workTree" :tree="workTree"></ManipulatorWindow>
  </div>
  `,
  data: () => ({
    stage: "build",
    display: true,
    workTree: null,
    startTree: null,
    problemID: "",
    desc:"",
    time:"",
    goalTreeStr: null,
    mouse: new Mouse(this),
    lessonID: null,
  }),
  mounted() {
    M.AutoInit();
    if(this.getURL()!==null){
      getProblemFromDBVue(this.problemID,this.distribute);
    }
  },
  methods: {
    getURL(){
      let argArr=(window.location.href).split('/');
      if(argArr.length>=3){
        this.problemID=argArr[4];
        if(argArr[7]!==undefined){
          this.lessonID=argArr[6];
        }
        if(argArr[6]!==undefined){
          this.problemID+='/'+argArr[5];
        }
      }else{
        return null;
      }
      return this.problemID;
    }, goToNextStage() {
      this.stage = "manip";
      this.startTree = this.workTree.toString();
    }, clearTree() {
      this.workTree=null;
    }, distribute(res, code) {
      if(code===2) {//start
        this.workTree = Deserialize(res);
        this.display = true;
      }
    },
    setWorkTree(tree) {
      this.workTree = tree;
    },
  },
  components: {
    NavigationBar,
    CreatorSpecificActionButtons,
    CreatorNavigationButtons,
    ManipulatorWindow,
    InvalidPage,
  },
});
