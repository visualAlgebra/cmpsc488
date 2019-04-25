import ExprTreeListenerMixin from "./vue_mixins/ExprTreeListenerMixin";
import {ClickTargetKind} from "../gui";
import {ExpressionTree} from "../expression_tree";
import {Drag, Drop} from "vue-drag-drop";

export default {
  name: "ExprTreeLiteral",

  props: {
    tree: ExpressionTree,
    path: Array,
  },

  mixins: [ExprTreeListenerMixin],

  template: `
<drop @drop="handleDrop">
  <drag
    @dragstart="handleDragStart"
    :hide-image-html="true"
    :image="null"
    :transferData="guiObj"
    :draggable="interactive"
  >
    <svg
      v-on="listeners"
      :class="classes"
      width="70"
      height="70"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg"
    >
     <g
      v-if="tree.value === 0"
     >
      <title>Zero</title>
      <g transform="rotate(-90, 34.2275, 35.6263)" id="svg_12">
       <circle id="svg_13" r="14.97575" cy="52.215609" cx="34.227538" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
       <circle id="svg_14" r="14.975754" cy="19.036907" cx="34.227538" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
       <circle id="svg_15" r="9.300453" cy="36.062818" cx="34.227539" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
      </g>
     </g>
     
     <g
      v-if="tree.value === 1"
     >
      <title>One</title>
      <g id="svg_12">
       <circle id="svg_13" r="14.97575" cy="52.215609" cx="33.990233" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
       <circle id="svg_14" r="14.975754" cy="19.036907" cx="33.990233" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
       <circle id="svg_15" r="9.300453" cy="36.062818" cx="33.990234" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
      </g>
     </g>
     
     <g
      v-if="tree.value === 2"
     >
      <title>Two</title>
      <g id="svg_11">
       <circle id="svg_4" r="14.975752" cy="53.402134" cx="19.84864" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
       <circle id="svg_6" r="14.97576" cy="20.223432" cx="19.84864" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
       <circle id="svg_7" r="9.300453" cy="37.249343" cx="19.84864" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
      </g>
      <g id="svg_12">
       <circle id="svg_13" r="14.97575" cy="53.164828" cx="49.889648" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
       <circle id="svg_14" r="14.975754" cy="19.986125" cx="49.889648" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
       <circle id="svg_15" r="9.300453" cy="37.012036" cx="49.889648" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="4" :stroke="stroke" :fill="fill"/>
      </g>
     </g>
    </svg>
  </drag>
</drop>
  `,

  data() {
    return {
      guiObj: {
        kind: ClickTargetKind.Literal,
        tree: this.tree,
        path: this.path,
      }
    };
  },

  computed: {
    classes() {
      return [
          // "literal",
          this.interactive ? "hoverable" : "",
      ]
    },

    fill() {
      return "#63c0bb";
    },

    stroke() {
      return "#92d7da";
    },
  },

  components: {
    Drag,
    Drop,
  },
};