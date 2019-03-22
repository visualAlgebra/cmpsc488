import * as M from "materialize-css";
import HistoryNavigationHistoryLine from "./HistoryNavigationHistoryLine";

export default {
  name: "HistoryNavigationPopout", template: `
  <div>
    <ul id="histNav" class="sidenav">
      <li>
        <a class="subheader">History Tree</a>
      </li>
      <li v-if="displayPage">
        <div class="tree">
          <HistoryNavigationHistoryLine v-if="displayPage&&mainLine" v-bind:historyLine="mainLine"></HistoryNavigationHistoryLine>
        </div>
      </li>
    </ul>
  </div>  
  `,data(){
    return {
      display:false, mainLine:null,
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
  }, components:{
    HistoryNavigationHistoryLine,
  },
};