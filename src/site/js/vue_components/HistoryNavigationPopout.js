import HistoryNavigationHistoryLine from "./HistoryNavigationHistoryLine";
import {addHistoryEntry, getHistoryController, setGoalTree} from "../history_nav";

export default {
  name: "HistoryNavigationPopout", props:["addHistory", "setWorkTree"], template: `
  <div>
    <ul id="histNav" class="modal modal-fixed-footer">
      <div class="modal-content">
        <li v-if="display">
          <div class="tree">
            <ul>
              <HistoryNavigationHistoryLine v-if="display&&historyController" v-bind:historyLine="historyController.mainLine" v-bind:index="0" v-bind:setWorkTree="setWorkTree" v-bind:curLoc="curLoc"></HistoryNavigationHistoryLine>
            </ul>
          </div>
        </li>
      </div>
    </ul>
  </div>
  `,data(){
    return {
      display:false, historyController:null,
    }
  }, mounted() {
    M.AutoInit();
    this.addHistory();
    this.historyController=getHistoryController();
    this.display=true;
  }, computed:{
    curLoc: function(){
      return this.historyController.loc.line[this.historyController.loc.index].id;
    }
  }, components:{
    HistoryNavigationHistoryLine,
  },
};
