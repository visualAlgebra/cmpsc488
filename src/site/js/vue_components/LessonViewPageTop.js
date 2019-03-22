export default {
  name: "LessonViewPageTop", props:["creatorID", "desc", "time", "lessonID", "problemCount"], template: `
  <div>
    <div class="row">
      <div class="col s12 m12">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title" id="userAccountIdField">{{lessonID}}</span>
            <p>Created by: {{creatorID}}
              <a :href="getURL(creatorID)" class="secondary-content">
                <i class="material-icons">send</i>
              </a>
            </p>
            <p>Creation Date: {{new Date(time)}}</p>
            <p>Description: {{desc}}</p>
            <p>Problems: {{problemCount}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>  
  `, methods: {
    getURL(creatorAccId){
      return "http://localhost:8080/profile/accounts/"+creatorAccId;
    }
  },
};