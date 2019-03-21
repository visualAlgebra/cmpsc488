export default {
  name: "ExprTreeVariable",

  props: ["tree", "hoverable"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" :class="classes">
    {{ "x" + tree.value }}
  </div>
  `,

  computed: {
    classes() {
      return [
        "variable",
        this.hoverable ? "hoverable" : "",
      ]
    },
  },
};