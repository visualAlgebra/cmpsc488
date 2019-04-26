import ExpressionTree from "./ExpressionTree";
import SvgPanZoom from "vue-svg-pan-zoom";
import {ExpressionTree as JsExpressionTree} from '../expression_tree';

export default {
  name: "SingleExpressionDisplay",

  props: {
    tree: {
      required: true,
      type: JsExpressionTree,
    },
    height: {
      required: false,
      default: "100%",
      type: String,
    },
    width: {
      required: false,
      default: "100%",
      type: String,
    },
    worldHeight: {
      required: false,
      default: "1000",
      type: String,
    },
    worldWidth: {
      required: false,
      default: "3000",
      type: String,
    },
  },

  template: `
  <div>
    <SvgPanZoom
      :zoomScaleSensitivity="0.1"
      @svgpanzoom="registerSvgPanZoom"
    >
      <svg
        :height="height"
        :width="width"
        style="border-style:solid; border-color: rgba(200,200,200,0.2); border-width: 0.5rem; border-radius: 1rem;"
      >
        <foreignObject
          :height="worldHeight"
          :width="worldWidth"
        >
          <ExpressionTree v-bind:tree="tree"></ExpressionTree>
        </foreignObject>
      </svg>
    </SvgPanZoom>
  </div>
  `, methods: {
    registerSvgPanZoom(svgpanzoom) {
      this.svgpanzoom = svgpanzoom;
    },
  }, components: {
    ExpressionTree, SvgPanZoom,
  },
};
