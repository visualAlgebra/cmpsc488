import * as M from "materialize-css";
import HistoryNavigationHistoryLine from "./HistoryNavigationHistoryLine";
import {addHistoryEntry, getHistoryController, setGoalTree} from "../history_nav";

export default {
  name: "HistoryNavigationPopout", props:["dataFunc", "setWorkTree"], template: `
  <div>
    <ul id="histNav" class="sidenav">
      <li>
        <a class="subheader">History Tree</a>
      </li>
      <li v-if="display">
        <div class="tree">
          <ul>
            <HistoryNavigationHistoryLine v-if="display&&historyController" v-bind:historyLine="historyController.mainLine" v-bind:index="0" v-bind:setWorkTree="setWorkTree"></HistoryNavigationHistoryLine>
          </ul>
        </div>
      </li>
    </ul>
  </div>  
  `,data(){
    return {
      display:false, historyController:null,
    }
  }, mounted() {
    M.AutoInit();
    let data=this.dataFunc();
    addHistoryEntry(data[0], "herro");
    setGoalTree(data[1]);
    this.historyController=getHistoryController();
    this.display=true;
  }, components:{
    HistoryNavigationHistoryLine,
  },
};
