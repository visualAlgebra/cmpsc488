import Vue from "vue";

export const promotional_website_vue = new Vue({
  name: "Root", el: "#vue-app", template: `
  <div class="container" style="margin-top: 3rem; margin-bottom: 3rem;">
    <section>
      <h1>Main page</h1>
      <p>Overview of product:</p>
      <p>Image <img src="http://localhost:8080/src/site/assets/FAVICON.png"></p>
      <p>Usage: 
        <li><a href="http://localhost:8080/algebra/problems/tp1">Tutorial problem 1</a></li>
        <li><a href="http://localhost:8080/algebra/problems/tp2">Tutorial problem 2</a></li>
        <li><a href="http://localhost:8080/algebra/problems/tp3">Tutorial problem 3</a></li>
        <li><a href="http://localhost:8080/algebra/problems/tp4">Tutorial problem 4</a></li>
        <li><a href="http://localhost:8080/algebra/problems/tp5">Tutorial problem 5</a></li>
        <li><a href="http://localhost:8080/algebra/problems/tp6">Tutorial problem 6</a></li>
      </p>
    </section>
    <section>
      <h1>Download / try-me page</h1>
      <li><a href="http://localhost:8080">visualalgebra.org</a></li>
    </section>
    <section>
      <h1>Support page</h1>
      <li><a href="mailto:visualalgebra@gmail.com">Email to: visualalgebra@gmail.com</a></li>
    </section>
    <section>
      <h1>System documentation</h1>
      <h3>Deliverables</h3>
      <ol>
        <li>
          <p>Phase 1</p>
          <ul>
            <li><a download href="http://localhost:8080/documentation/Phase_1/Cmpsc488UseCaseEricKoskovich">Use Case 1</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_1/CreatingALessonUseCase.pdf">Use Case 2</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_1/Domain Model.pdf">Domain Model</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_1/High-level Requirements.pdf">High-Level Requirements</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_1/Project Glossary.pdf">Project Glossary</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_1/Storyboard.pdf">Storyboard</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_1/Use Case_ Create Shareable Link to Problem.pdf">Use Case 3</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_1/Use Case_ Follow Link to a Problem.pdf">Use Case 4</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_1/Use Case_ User Requests Help.pdf">Use Case 5</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_1/UseCaseDiagram.pdf">Use Case Diagram</a></li>
          </ul>
        </li>
        <li>
          <p>Phase 2</p>
          <ul>
            <li><a download href="http://localhost:8080/documentation/Phase_2/Class Diagram">Class Diagram</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_2/Create Shareable Link Robustness Diagram.pdf">Create Shareable Link Robustness Diagram</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_2/Create Shareable Link Sequence Diagram.pdf">Create Shareable Link Sequence Diagram</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_2/CreateALessonRobustness.pdf">Create a Lesson Robustness Diagram</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_2/CreateALessonSequenceDiagram.pdf">Create a Lesson Sequence Diagram</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_2/Follow Link to a Problem.pdf">Follow Link to a Problem Robustness Diagram</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_2/Follow Link to Problem (Sequence).pdf">Follow Link to a Problem Sequence Diagram</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_2/Generate Problem Robustness Final PDF.pdf">Generate Problem Robustness Diagram</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_2/Generate Problem Sequence Final PDF.pdf">Generate Problem Sequence Diagram</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_2/List of Frameworks_Languages_etc.docx">List of Frameworks and Languages</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_2/Request Hint Robustness Diagram.png">Request Hint Robustness Diagram</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_2/Request Hint Sequence Diagram.png">Request Hint Sequence Diagram</a></li>
          </ul>
        </li>
        <li>
          <p>Phase 3</p>
          <ul>
            <li><a download href="http://localhost:8080/documentation/Phase_3/Detailed Schedule.pdf">Detailed Schedule</a></li>
            <li><a download href="http://localhost:8080/documentation/Phase_3/Gantt Chart - Sheet1.pdf">Gantt Chart</a></li>
          </ul>
        </li>
      </ol>
    </section>
    <section>
    <h1>About page</h1>
      <li>
        <a href="http://localhost:8080/about.html">About</a>
      </li>
    </section>
  </div>
  `,
});
