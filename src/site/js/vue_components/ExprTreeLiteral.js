export default {
  name: "ExprTreeLiteral",

  props: ["tree"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" class="literal">
    {{ tree.value }}
  </div>
  `,
};