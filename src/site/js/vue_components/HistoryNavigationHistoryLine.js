import * as M from "materialize-css";
import {displayExpressionTree} from "../display_feature";

export default {
  name: "HistoryNavigationHistoryLine", props: ["historyLine", "index"], template: `
  <li v-if="historyLine.line[index]!==undefined">
    <div v-on:click="redisplay">
      {{(historyLine.line[index].msg)}}
    </div>
    <ul>
      <HistoryNavigationHistoryLine v-bind:historyLine="historyLine" v-bind:index="index+1"></HistoryNavigationHistoryLine>
      <HistoryNavigationHistoryLine v-for="(line, index) in historyLine.line[index].refs" v-bind:key="index" v-bind:historyLine="line" v-bind:index="0"></HistoryNavigationHistoryLine>
    </ul>
  </li>
  `, methods: {
    redisplay() {
      displayExpressionTree(this.data, "canvasContainer");
      console.log("hi");
    }
  }, mounted() {
    M.AutoInit();
  },
};
