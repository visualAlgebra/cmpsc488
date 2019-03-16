import Vue from "vue";
import {Orientation, Quadrant} from "./expression_tree";


Vue.component("expr-tree-tag-quadrant", {
  props: ["quadrant", "values"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" :class="classes">
    <div
      xmlns="http://www.w3.org/1999/xhtml"
      v-for="subtree in values"
      class="tag-element-container"
    >
      <expression-tree :tree="subtree"></expression-tree>
    </div>
  </div>
  `,

  computed: {
    classes() {
      return [
        this.quadrant === Quadrant.NW ? "north-west" : "south-east",
      ];
    },
  },
});

Vue.component("expr-tree-tag-button", {
  template: `
  <div
    xmlns="http://www.w3.org/1999/xhtml"
    class="tag-button-column"
   >
    <div xmlns="http://www.w3.org/1999/xhtml" class="tag-button"></div>
  </div>
  `,
});

Vue.component("expr-tree-tag", {
  props: ["tree"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" :class="classes">
    
    <expr-tree-tag-quadrant
      :quadrant="Quadrant.NW"
      :values="tree.NW"
    >
    </expr-tree-tag-quadrant>
    
    <expr-tree-tag-button></expr-tree-tag-button>
    
    <expr-tree-tag-quadrant
      quadrant="Quadrant.SE"
      :values="tree.SE"
    >
    </expr-tree-tag-quadrant>
    
  </div>
  `,

  data() {
    return {
      Quadrant: Quadrant
    };
  },

  computed: {
    classes() {
      return [
        this.tree.orientation === Orientation.NS ? "north-south" : "east-west",
        "tag"
      ];
    },
  },
});

Vue.component("expr-tree-variable", {
  props: ["tree"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" class="variable">
    {{ "x" + tree.value }}
  </div>
  `,
});

Vue.component("expr-tree-literal", {
  props: ["tree"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" class="literal">
    {{ tree.value }}
  </div>
  `,
});

Vue.component("expression-tree", {

  props: ["tree"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml">
    <expr-tree-tag
      v-if="tree.kind === 'tag'"
      :tree="tree"
    >
    </expr-tree-tag>
    <expr-tree-variable
      v-else-if="tree.kind === 'variable'"
      :tree="tree"
    >
    </expr-tree-variable>
    <expr-tree-literal
      v-else-if="tree.kind === 'literal'"
      :tree="tree"
    >
    </expr-tree-literal>
  </div>
  `,

});

export const manipulatorWindow = new Vue({

  el: "#vueCanvasContainer",

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml">
    <expression-tree v-if="workingExpressionTree" :tree="workingExpressionTree"></expression-tree>
  </div>
  `,

  data() {
    return {
      workingExpressionTree: null,
    };
  },

});
