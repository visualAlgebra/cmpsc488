import SingleProblemDisplay from "./SingleProblemDisplay";

export default {
  name: "ProblemsHolder", props: ["problems", "deleteProblem", "type", "userStruct", "accountID"], template: `
  <div>
    <SingleProblemDisplay v-for="(problem, index) in problems" 
      :key="index"
      v-bind:problemID="problems[index].problemID"
      v-bind:start="problems[index].expression_start"
      v-bind:goal="problems[index].expression_goal"
      v-bind:deleteProblem="deleteProblem"
      v-bind:type="type"
      v-bind:userStruct="userStruct"
      v-bind:accountID="accountID">
    </SingleProblemDisplay>
  </div>
  `, components: {
    SingleProblemDisplay,
  }
};
