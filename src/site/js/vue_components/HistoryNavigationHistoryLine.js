import * as M from "materialize-css";

export default {
  name: "HistoryNavigationHistoryLine", props:["historyLine"], template: `
  <ul>
    <li v-for="(block, index) in historyLine">
      <HistoryNavigationHistoryLine v-if="thisHistoryLine" v-bind:historyLine="thisHistoryLine"></HistoryNavigationHistoryLine>
    </li>
  </ul>  
  `,data(){
    return {
      display:false, thisHistoryLine: null
    }
  }, mounted() {
    M.AutoInit();
  },
};