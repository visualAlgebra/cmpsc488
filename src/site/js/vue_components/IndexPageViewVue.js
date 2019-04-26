import TwoSvg from "./TwoSvg";
import {Literal} from "../expression_tree";
import ExpressionTree from "./ExpressionTree";

export default {
  name: "IndexPageViewVue",

  template: `
<div class="container">
  <header class="index-header">
    <div class="index-header-title">
      <TwoSvg/>
      <h1>VisualAlgebra</h1>
    </div>
    <h2 class="subtitle">A graphical, interactive, algebraic playground.</h2>
  </header>
  
  <p class="flow-text">
    Learn algebraic laws by solving challenges! Given a start expression, your job is to transform it into an equivalent goal expression.
  </p>
  
  <div style="display: flex; justify-content: center;  box-sizing: border-box;">
    <div
      style="border: solid 0.5rem rgba(255,255,255,0.1); border-radius: 0.5rem;"
    >
      <img
        class="materialboxed"
        width="600px"
        src="http://localhost:8080/src/site/assets/Distribute.gif"
      >
    </div>
  </div>
    
  <div class="row">
    <h4 class="center-align">
      <a href="http://localhost:8080/algebra/problems/Getting_started">Click here</a> to get started!
    </h4>
  </div>
  
  <p class="flow-text">
     We simplify algebra by basing our graphical system on ℤ3, an algebraic field with <strong>only three numbers.</strong> Rather than getting bogged down in arithmetic, we want you to focus on the algebraic laws common to all kinds of algebras.
  </p>
  
  <section class="row literal-row" style="margin-top: 5rem; margin-bottom: 5rem;">
    <div class="col s4">
      <div class="expr-tree-box hoverable">
        <ExpressionTree :tree="zero()" />
      </div>
    </div>
    <div class="col s4">
      <div class="expr-tree-box hoverable">
        <ExpressionTree :tree="one()" />
      </div>
    </div>
    <div class="col s4">
      <div class="expr-tree-box hoverable">
        <ExpressionTree :tree="two()" />
      </div>
    </div>
  </section>
  
  <p class="flow-text">
    Solve puzzles on the <a href="http://localhost:8080/algebra/problems/Getting_started">Algebra page</a> by transforming one expression into another.
  </p>
  <p class="flow-text">
    Create problems on the <a href="http://localhost:8080/creator">Creator page</a> and share them with your friends.
  </p>
  <p class="flow-text">
    Browse problems created by other students on the <a href="http://localhost:8080/explorer">Explorer page</a>.
  </p>
</div>  
  `,

  mounted() {
    M.AutoInit();
  },

  methods: {
    zero: () => new Literal(0),
    one: () => new Literal(1),
    two: () => new Literal(2),
  },

  components: {
    TwoSvg,
    ExpressionTree,
  },
};
