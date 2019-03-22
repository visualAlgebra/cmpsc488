import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import InvalidPage from "./vue_components/InvalidPage";
import ManipulatorNavigationButtons from "./vue_components/ManipulatorNavigationButtons";
import ManipulatorSpecificActionButtons from "./vue_components/ManipulatorSpecificActionButtons";
import {getProblemFromDBVue, singleExpressionDecompression} from "./display_feature";
import {Deserialize} from "./expression_tree";
import ExpressionTree from "./vue_components/ExpressionTree";
import SingleExpressionDisplay from "./vue_components/SingleExpressionDisplay";
import ManipulatorWindow from "./vue_components/ManipulatorWindow";

export const manipulator_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar></NavigationBar>
    <InvalidPage v-if="!displayPage"></InvalidPage>
    <ManipulatorNavigationButtons v-if="displayPage&&workTree&&goalTreeStr" v-bind:dataFunc="getTreeData"></ManipulatorNavigationButtons>
    <ManipulatorSpecificActionButtons v-if="displayPage"></ManipulatorSpecificActionButtons>
    <ManipulatorWindow v-if="displayPage&&workTree" :tree="workTree"></ManipulatorWindow>
    <SingleExpressionDisplay v-if="displayPage&&goalTree" v-bind:tree="goalTree" v-bind:hoverable="false"></SingleExpressionDisplay> 
  </div>
  `, data(){
    return {
      display: false, goalTree: null, workTree:null, dbInfo:0, problemID: "", desc:"", time:"", goalTreeStr: null,
    };
  }, mounted(){
    if(this.getURL()===null){
      return;
    }
    getProblemFromDBVue(this.problemID,this.distribute);
  }, methods: {
    getURL(){
      let problem=(window.location.href).substr((window.location.href).indexOf('/manipulator'));
      if(problem.indexOf('/manipulator/problems')=== -1||problem==='null'||problem===''||problem==='undefined'){
        return null;
      }
      this.problemID=problem.substring(problem.indexOf('/manipulator')+'/manipulator/problems/'.length, problem.length);
      return this.lessonID;
    }, distribute(res, code){
      if(code===1){
        this.desc=res.description;
        this.time=res.timeCreated;
      }else if(code===2){//start
        this.workTree=Deserialize(res);
      }else if(code===3){//goal
        this.goalTree=res;
        singleExpressionDecompression(this.goalTree, res=>{
          this.goalTreeStr=res;
        });
      }
      if(++this.dbInfo===3){
        this.display=true;
      }
    }, getTreeData(){
      return [this.workTree.toString(), this.goalTreeStr.toString()];
    }
  }, computed: {
    displayPage: function(){
      if(this.display===true){
        return true;
      }
      return false;
    }
  }, components: {
    NavigationBar, InvalidPage, ManipulatorNavigationButtons, ManipulatorSpecificActionButtons, ExpressionTree, SingleExpressionDisplay, ManipulatorWindow
  },
});
