export default {
  name: "Footer",

  template: `
<footer class="page-footer our-page-footer">
  <div class="container">
    <div class="row">
      <div class="col l6 s12">
        <h5 class="white-text">VisualAlgebra</h5>
        <p class="grey-text text-lighten-4">
          Contact us at <a href="mailto:visualalgebra@gmail.com">VisualAlgebra@gmail.com</a>
        </p>
      </div>
      <div class="col l4 offset-l2 s12">
        <ul class="footer-links">
          <li><a href="http://localhost:8080/">Home</a></li>
          <li><a href="http://localhost:8080/creator">Create</a></li>
          <li><a href="http://localhost:8080/algebra/problems/Getting_started">Algebra</a></li>
          <li><a href="http://localhost:8080/explorer">Explore</a></li>
          <li><a href="http://localhost:8080/profile">Profile</a></li>
          <li><a href="http://localhost:8080/about">About</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="footer-copyright">
    <div class="container">
<!-- © --> 2019 VisualAlgebra
    <a class="grey-text text-lighten-4 right" href="https://github.com/visualAlgebra/cmpsc488">GitHub Repo</a>
    </div>
  </div>
</footer>
  `,
};