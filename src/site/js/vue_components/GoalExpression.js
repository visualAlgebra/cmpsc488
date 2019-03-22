import SingleExpressionDisplay from "./SingleExpressionDisplay";

export default {
  name: "GoalExpression",

  props: {
    tree: Array,
  },

  template: `
    <div>
      <h2>Goal</h2>
      <SingleExpressionDisplay
        :tree="tree"
      ></SingleExpressionDisplay> 
    </div>
  `,

  components: {
    SingleExpressionDisplay
  }
};