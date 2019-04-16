import {Literal, Orientation, Tag, Variable} from "../expression_tree";
import ExpressionTree from "./ExpressionTree";
import InsertButton from "./InsertButton";
import {Mouse} from "../gui";

export default {

  name: "InsertionButtons",

  props: {
    mouse: Mouse,
    clickFirstNode: Boolean,
    chooseRootNode: Function,
  },

  template: `
<div class="row insertion-btn-row">
  <InsertButton
    :tree="makeEWTag()"
    :mouse="mouse"
    :clickable="clickFirstNode"
    @click="chooseRootNode"
  ></InsertButton>
  <InsertButton
    :tree="makeNSTag()"
    :mouse="mouse"
    :clickable="clickFirstNode"
    @click="chooseRootNode"
  ></InsertButton>
  <InsertButton
    :tree="makeLit(0)"
    :mouse="mouse"
    :clickable="clickFirstNode"
    @click="chooseRootNode"
  ></InsertButton>
  <InsertButton
    :tree="makeLit(1)"
    :mouse="mouse"
    :clickable="clickFirstNode"
    @click="chooseRootNode"
  ></InsertButton>
  <InsertButton
    :tree="makeLit(2)"
    :mouse="mouse"
    :clickable="clickFirstNode"
    @click="chooseRootNode"
  ></InsertButton>
  <InsertButton
    :tree="makeVar(1)"
    :mouse="mouse"
    :clickable="clickFirstNode"
    @click="chooseRootNode"
  ></InsertButton>
  <InsertButton
    :tree="makeVar(2)"
    :mouse="mouse"
    :clickable="clickFirstNode"
    @click="chooseRootNode"
  ></InsertButton>
  <InsertButton
    :tree="makeVar(3)"
    :mouse="mouse"
    :clickable="clickFirstNode"
    @click="chooseRootNode"
  ></InsertButton>
</div>
  `,

  methods: {
    makeEWTag: () => new Tag(Orientation.EW, [], []),
    makeNSTag: () => new Tag(Orientation.NS, [], []),
    makeVar: x => new Variable(x),
    makeLit: x => new Literal(x),
  },

  components: {
    ExpressionTree,
    InsertButton,
  },
}