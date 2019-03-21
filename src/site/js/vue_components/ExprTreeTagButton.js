export default {
  name: "ExprTreeTagButton",

  props: ["hoverable"],

  template: `
  <div
    xmlns="http://www.w3.org/1999/xhtml"
    class="tag-button-column"
   >
    <div xmlns="http://www.w3.org/1999/xhtml" :class="classes"></div>
  </div>
  `,

  computed: {
    classes() {
      return [
          "tag-button",
          this.hoverable ? "hoverable" : "",
      ]
    },
  },
};