import * as M from "materialize-css";
import HistoryNavigationHistoryLine from "./HistoryNavigationHistoryLine";
import {addHistoryEntry, getHistoryController, setGoalTree} from "../history_nav";

export default {
  name: "HistoryNavigationPopout", props:["dataFunc"], template: `
  <div>
    <ul id="histNav" class="sidenav">
      <li>
        <a class="subheader">History Tree</a>
      </li>
      <li v-if="displayPage">
        <div class="tree">
          <HistoryNavigationHistoryLine v-if="displayPage&&historyController" v-bind:historyLine="historyController.mainLine"></HistoryNavigationHistoryLine>
        </div>
      </li>
    </ul>
  </div>  
  `,data(){
    return {
      display:false, historyController:null,
    }
  }, computed: {
    displayPage: function(){
      if(this.display===true){
        return true;
      }
      return false;
    }
  },  mounted() {
    M.AutoInit();
    let data=this.dataFunc();
    addHistoryEntry(data[0]);
    setGoalTree(data[1]);
    this.historyController=getHistoryController();
    this.display=true;
  }, components:{
    HistoryNavigationHistoryLine,
  },
};