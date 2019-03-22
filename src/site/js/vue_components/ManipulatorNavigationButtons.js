import {drawCanvas, historyAction, restart} from "../manipulator";
import {globals} from "../gui";
import HistoryNavigationPopout from "./HistoryNavigationPopout";
import ExpressionTree from "./ExpressionTree";
import { solve } from "../solver";
import { Deserialize } from "../expression_tree";

export default {
  name: "ManipulatorNavigationButtons", props:["dataFunc"], template: `
  <div>
    <div class="row">
      <a class="tab waves-effect waves-light btn col" v-on:click="hint()">
          <i class="material-icons left">compare_arrows</i>
          Hint
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="share()">
          <i class="material-icons left">share</i>
          Share
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="restart()">
          <i class="material-icons left">rotate_left</i>
          Restart
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="undo()">
          <i class="material-icons left">undo</i>
          Undo
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="redo()">
          <i class="material-icons left">redo</i>
          Redo
      </a>
      <a class="tab waves-effect waves-light btn col sidenav-trigger" data-target="histNav" v-on:click="drawCanvas()">
          <i class="material-icons left">subdirectory_arrow_right</i>
          History tree
      </a>
      <a class="tab waves-effect waves-light btn col" v-on:click="DEBUG_INSTANCES()">
          <i class="material-icons left">bug_report</i>
          DEBUG INSTANCES
      </a>
      <!--<HistoryNavigationPopout></HistoryNavigationPopout>-->
    </div>
  </div>  
  `, methods: {
    hint(){
      let problems = this.dataFunc();
      solve(Deserialize(problems[0]), Deserialize(problems[1]));
    }, share(){
      console.log("tehehehe");
    }, restart(){
      restart();
    }, undo(){
      historyAction(true);
    }, redo(){
      historyAction(true);
    }, historyTree(){
      drawCanvas();
    }, DEBUG_INSTANCES(){
      console.log('_DEBUG_TRIGGERED');
      console.log(this.dataFunc());
      console.log('_DEBUG_FINISHED');
    },
  }
};