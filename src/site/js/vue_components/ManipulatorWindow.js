import ExpressionTree from "./ExpressionTree";
import SvgPanZoom from "vue-svg-pan-zoom";
import {Mouse} from "../gui";

export default {
  name: "ManipulatorWindow",

  props: ["tree", "mouse"],

  template: `
<div
  @dblclick="center()"
>
  <SvgPanZoom
    :maxZoom="3"
    :minZoom="0.5"
    :zoomScaleSensitivity="0.1"
    :dblClickZoomEnabled="false"
    @svgpanzoom="registerSvgPanZoom"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="500px"
    >
      <foreignObject width="2000" height="1000">
        <ExpressionTree
          v-if="tree"
          :tree="tree"
          interactive
          :mouse="mouse"
        ></ExpressionTree>
      </foreignObject>
    </svg>
  </SvgPanZoom>
</div>
  `,

  data: () => ({
    svgpanzoom: null,
  }),

  mounted() {
    this.center();
  },

  methods: {
    registerSvgPanZoom(svgpanzoom) {
      this.svgpanzoom = svgpanzoom;
    },

    center() {
      this.svgpanzoom.center();
      this.svgpanzoom.resetZoom();
      this.svgpanzoom.pan({x:300, y:200});
    },
  },

  components: {
    ExpressionTree,
    SvgPanZoom,
  },
}