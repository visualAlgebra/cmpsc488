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
import GoalExpression from "./vue_components/GoalExpression";
import * as M from "materialize-css";
import {clearHist} from "./history_nav";
import {Mouse} from "./gui";

export const manipulator_vue = new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar></NavigationBar>
    <InvalidPage v-if="!display"></InvalidPage>
    <ManipulatorNavigationButtons v-if="display&&workTree&&goalTreeStr" v-bind:dataFunc="getTreeData" v-bind:restart="restart" v-bind:setWorkTree="setWorkTree" v-bind:lessonID="lessonID"></ManipulatorNavigationButtons>
    <ManipulatorSpecificActionButtons v-if="display" :mouse="mouse"></ManipulatorSpecificActionButtons>
    <ManipulatorWindow v-if="display&&workTree" :tree="workTree" :mouse="mouse"></ManipulatorWindow>
    <GoalExpression
      v-if="display&&goalTree"
      :tree="goalTree"
    ></GoalExpression>
  </div>
  `, data(){
    return {
      display: false, goalTree: null, workTree:null, dbInfo:0, problemID: "", desc:"", time:"", goalTreeStr: null, workTreeData:null, mouse: new Mouse(this), lessonID: null,
    };
  }, mounted(){
    M.AutoInit();
    if(this.getURL()!==null){
      getProblemFromDBVue(this.problemID,this.distribute);
    }
  }, methods: {
    getURL(){
      let argArr=(window.location.href).split('/');
      if(argArr.length===6) {
        this.problemID=argArr[5];
      }else if(arrArr.length===7) {
        this.problemID=argArr[5]+'/'+argArr[6];
      }else if(arrArr.length===8) {
        this.problemID=argArr[5]+'/'+argArr[6];
        this.lessonID=argArr[7];
      }else{
        return null;
      }
      return this.problemID;
    }, distribute(res, code){
      if(code===1){
        this.desc=res.description;
        this.time=res.timeCreated;
      }else if(code===2){//start
        this.workTree=Deserialize(res);
        this.workTreeData=res;
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
    }, setWorkTree(tree){
      if(tree!==null) {
        this.workTree = Deserialize(tree.toString());
      }
    }, restart(){
      this.workTree=Deserialize(this.workTreeData);
      clearHist();
    }
  }, components: {
    NavigationBar,
    InvalidPage,
    ManipulatorNavigationButtons,
    ManipulatorSpecificActionButtons,
    ExpressionTree,
    SingleExpressionDisplay,
    ManipulatorWindow,
    GoalExpression,
  },
});
