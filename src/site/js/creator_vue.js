import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import CreatorSpecificActionButtons from "./vue_components/CreatorSpecificActionButtons";
import CreatorNavigationButtons from "./vue_components/CreatorNavigationButtons";
import ManipulatorWindow from "./vue_components/ManipulatorWindow";
import * as M from "materialize-css";
import {getProblemFromDBVue} from "./display_feature";
import {Deserialize} from "./expression_tree";

export const creator_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-if="display"></NavigationBar>
    <CreatorNavigationButtons
      v-if="display"
      :goToNextStage="goToNextStage"
      :stage="stage"
      v-bind:clearTree="clearTree"
    ></CreatorNavigationButtons>
    <CreatorSpecificActionButtons v-if="display"></CreatorSpecificActionButtons>
    <ManipulatorWindow v-if="display&&workTree" :tree="workTree"></ManipulatorWindow>
  </div>
  `,
  data: () => ({
    stage: "build",
    display: false,
    workTree: null,
    startTree: null,
    dbInfo:0,
    problemID: "",
    desc:"",
    time:"",
    goalTreeStr: null,
  }),
  mounted() {
    M.AutoInit();
    let url=this.getURL();
    if(url===null||this.problemID===null){
      this.display = true;
      return;
    }
    getProblemFromDBVue(this.problemID,this.distribute);
  },
  methods: {
    getURL(){
      let problem=(window.location.href).substr((window.location.href).indexOf('/creator'));
      if(problem.indexOf('/creator/')=== -1||problem==='null'||problem===''||problem==='undefined'){
        return null;
      }
      this.problemID=problem.substring(problem.indexOf('/creator')+'/creator/'.length, problem.length);
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
  },
  components: {
    NavigationBar, CreatorSpecificActionButtons, CreatorNavigationButtons, ManipulatorWindow,
  },
});
