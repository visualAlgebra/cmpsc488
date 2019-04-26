import {delete_account_from_db} from "../database_management";
import {signOut} from "../user_system";

export default {
  name: "ProfilePageTop", props: ["bio", "time", "problemCount", "accountID", "userStruct"], template: `
  <div>
    <div class="row">
      <div class="col s12 m12">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title" id="userAccountIdField">{{accountID}}
            <button class="dropdown-trigger btn waves-effect waves-light right" data-target="dropdown">
              <i class="material-icons right">X</i>
              Delete Account
            </button>
            <ul id='dropdown' class='dropdown-content'>
              <li><a>Are you sure?</a></li>
              <li><a>No</a></li>
              <li><a v-on:click="deleteAccount">Yes</a></li>
            </ul>
            </span>
            <p>Creation Date: {{new Date(time)}}</p>
            <p>Problems: {{problemCount}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>  
  `,methods:{
    deleteAccount(){
      delete_account_from_db(this.accountID, this.userStruct, signOut(()=>{
        alert("Account successfully deleted");
        window.document.href="http://localhost:8080/index.html";
      }));
    },
  },mounted(){
    M.AutoInit();
  }
};
