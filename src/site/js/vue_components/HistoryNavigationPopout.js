import HistoryNavigationHistoryLine from "./HistoryNavigationHistoryLine";
import {getHistoryController} from "../history_nav";
import SvgPanZoom from "vue-svg-pan-zoom";

export default {
  name: "HistoryNavigationPopout", props:["addHistory", "setWorkTree"], template: `
  <div>
    <ul id="histNav" class="modal modal-fixed-footer">
      <div class="modal-content">
        <SvgPanZoom :zoomScaleSensitivity="0.1" @svgpanzoom="registerSvgPanZoom" :fit="false">
          <svg height="3000" width="3000" style="border-style:solid; border-color: rgba(200,200,200,0.2); border-width: 0.5rem; border-radius: 1rem;">
            <foreignObject height="3000" width="3000">
              <li v-if="display">
                <div class="tree">
                  <ul>
                    <HistoryNavigationHistoryLine v-if="display&&historyController" v-bind:historyLine="historyController.mainLine" v-bind:index="0" v-bind:setWorkTree="setWorkTree" v-bind:curLoc="curLoc"></HistoryNavigationHistoryLine>
                  </ul>
                </div>
              </li>
            </foreignObject>
          </svg>
        </SvgPanZoom>
      </div>
    </ul>
  </div>
  `,data(){
    return {
      display:false, historyController:null,
    }
  }, methods: {
    registerSvgPanZoom(svgpanzoom) {
      this.svgpanzoom = svgpanzoom;
    },
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
    HistoryNavigationHistoryLine, SvgPanZoom
  },
};
