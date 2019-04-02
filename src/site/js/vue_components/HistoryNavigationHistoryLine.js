import * as M from "materialize-css";

export default {
  name: "HistoryNavigationHistoryLine", props: ["historyLine"], template: `
  <ul v-if="historyLine!==null">
    <li v-for="(block, index) in historyLine.line">
      <div v-if="display">
        <a v-if="setData(historyLine.line[index].data)">{{(historyLine.line[index].id===1?"Start":historyLine.line[index].id)}}</a>
      </div>
      <HistoryNavigationHistoryLine v-if="display" v-bind:historyLine="historyLine.line[index].refs"></HistoryNavigationHistoryLine>
    </li>
  </ul>  
  `, data() {
    return {
      display: false, data: "",
    }
  }, methods: {
    setData(data) {
      this.data = data;
      return true;
    }
  }, mounted() {
    M.AutoInit();
    if (this.historyLine !== null) {
      this.display = true;
    }
  },
};
