export default {
  name: "IndexPageViewVue", template: `
  <div>
    <div class="container">
      <div class="row">
        <a class="waves-effect waves-light btn" href="http://localhost:8080/manipulator/problems/Getting%20Started">
          <i class="material-icons left">file_download</i>
          Get Started!
        </a>
      </div>
    </div>
    <div class="container">
      <h4>Why we created VisualAlgebra</h4>
      <div class="row wavecard">
        <div class="col m3">
          <img class="materialboxed" src="http://localhost:8080/src/site/assets/example_image.png" width="50">
        </div>
        <div class="col m9">
          <p>Our project members are dedicated to create a new and interesting algebra revolving around visual graphics and
            simple to understand operations!</p>
        </div>
      </div>
      <div class="row wavecard">
        <div class="col m9">
          <p>Our (not yet) implemented auto solving algorithm will help any user find the next step to complete their
            problem!</p>
        </div>
        <div class="col m3">
          <img class="materialboxed" src="http://localhost:8080/src/site/assets/example_image.png" width="50">
        </div>
      </div>
      <div class="row wavecard">
        <div class="col m3">
          <img class="materialboxed" src="http://localhost:8080/src/site/assets/example_image.png" width="50">
        </div>
        <div class="col m9">
          <p>Visit our explorer page to find new problems created by teachers or other lesson and problem creators!</p>
        </div>
      </div>
      <div class="row wavecard">
        <div class="col m9">
          <p>Please visit us at GitHub to get introducted to the process of creating our webpage and implementing all our
            algebraic actions!</p>
        </div>
        <div class="col m3">
          <img class="materialboxed" src="http://localhost:8080/src/site/assets/example_image.png" width="50">
        </div>
      </div>
    </div>    
  </div>  
  `, mounted(){
    M.AutoInit();
  }
};