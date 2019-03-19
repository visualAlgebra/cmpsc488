export default {
  name: "ExprTreeVariable",

  props: ["tree"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" class="variable">
    {{ "x" + tree.value }}
  </div>
  `,
};