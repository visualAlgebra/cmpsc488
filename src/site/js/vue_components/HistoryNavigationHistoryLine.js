import {displayExpressionTree} from "../display_feature";

export default {
  name: "HistoryNavigationHistoryLine", props: ["historyLine", "index", "setWorkTree", "curLoc"], template: `
  <li v-if="historyLine.line[index]!==undefined">
    <div v-on:click="redisplay" v-bind:class="currentClass()">
      {{(historyLine.line[index].msg)}}
    </div>
    <ul>
      <HistoryNavigationHistoryLine v-bind:historyLine="historyLine" v-bind:index="index+1" v-bind:setWorkTree="setWorkTree" v-bind:curLoc="curLoc"></HistoryNavigationHistoryLine>
      <HistoryNavigationHistoryLine v-for="(line, index) in historyLine.line[index].refs" v-bind:key="index" v-bind:historyLine="line" v-bind:index="0" v-bind:curLoc="curLoc" v-bind:setWorkTree="setWorkTree"></HistoryNavigationHistoryLine>
    </ul>
  </li>
  `, methods: {
    redisplay() {
      this.setWorkTree(this.historyLine.line[this.index].setLoc());
    }, currentClass(){
      let temp=this.curLoc===this.historyLine.line[this.index].id?'currentHist':'';
      return temp;
    }
  }, mounted() {
    M.AutoInit();
  },
};
