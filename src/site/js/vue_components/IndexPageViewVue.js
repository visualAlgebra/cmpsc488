import * as M from "materialize-css";
import TwoSvg from "./TwoSvg";

export default {
  name: "IndexPageViewVue",

  template: `
<div class="container">
  <div class="index-header">
    <div class="index-header-title">
      <TwoSvg/>
      <h1>VisualAlgebra</h1>
    </div>
    <h2 class="subtitle">A graphical, interactive, algebraic playground.</h2>
  </div>
  <p class="flow-text">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis excepturi repellat repellendus! Ad, culpa dolorem eveniet illo laborum molestias quisquam voluptatum? A consequuntur earum esse placeat qui sunt tempora ullam!
  </p>
  <p class="flow-text">
     We simplify algebra by basing our graphical system on ℤ3, an algebraic field with <strong>only three numbers.</strong> Rather than getting bogged down in arithmetic, we want you to focus on the algebraic laws common to all kinds of algebras.
  </p>
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

  components: {
    TwoSvg,
  },
};
