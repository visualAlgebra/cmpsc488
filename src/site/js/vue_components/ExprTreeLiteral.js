export default {
  name: "ExprTreeLiteral",

  props: ["tree", "hoverable"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" :class="classes">
    {{ tree.value }}
  </div>
  `,

  computed: {
    classes() {
      return [
          "literal",
          this.hoverable ? "hoverable" : "",
      ]
    },
  },
};