export default {
  name: "ProfilePageTop", props: ["bio", "time", "problemCount"], template: `
  <div>
    <div class="row">
      <div class="col s12 m12">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title" id="userAccountIdField">UPDATED_TEST_USER_1</span>
            <p>Bio: {{bio}}</p>
            <p>Creation Date: {{time}}</p>
            <p>Problems: {{problemCount}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>  
  `
};