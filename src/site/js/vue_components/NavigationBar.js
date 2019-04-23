import {signIn, signOut} from "../user_system";

export default {
  name: "NavigationBar", props: ["user", "oauth_user_getter", "oauth_user_remover", "logged"], template: `
  <div>
    <nav>
      <div class="nav-wrapper">
        <a href="http://localhost:8080/index.html" class="brand-logo">VisualAlgebra</a>
        <a href="#" class="sidenav-trigger" data-target="navbarSidenav">
          <i class="material-icons">menu</i>
        </a>
        <ul class="right hide-on-med-and-down" id="nav-mobile">
          <li>
            <a href="http://localhost:8080/">Home</a>
          </li>
          <li>
            <a href="http://localost:8080/creator.html">Create</a>
          </li>
          <li>
            <a href="http://localhost:8080/algebra/problems/Getting_started">Algebra</a>
          </li>
          <li>
            <a href="http://localhost:8080/explorer.html">Explore</a>
          </li>
          <li>
            <a href="http://localhost:8080/profile.html">User Profile</a>
          </li>
          <li>
            <a v-if="!logged" v-on:click="signInNow()">Login</a>
          </li>
          <li>
            <a v-if="logged" v-on:click="signOutNow()">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
    <ul class="sidenav" id="navbarSidenav">
      <nav>
        <div class="nav-wrapper">
          <a class="brand-logo" href="http://localhost:8080/index.html">VisualAlgebra</a>
        </div>
      </nav>
      <li>
        <a href="http://localhost:8080/">Home</a>
      </li>
      <li>
        <a href="http://localhost:8080/creator.html">Create</a>
      </li>
      <li>
        <a href="http://localhost:8080/algebra/problems/Getting_started">Algebra</a>
      </li>
      <li>
        <a href="http://localhost:8080/explorer.html">Explore</a>
      </li>
      <li>
        <a href="http://localhost:8080/profile.html">User Profile</a>
      </li>
      <li>
        <a v-if="!logged" v-on:click="signInNow()">Login</a>
      </li>
      <li>
        <a v-if="logged" v-on:click="signOutNow()">Logout</a>
      </li>
    </ul>
  </div>  
  `, mounted() {
    M.AutoInit();
  },
  methods: {
    signInNow(){
      signIn(this.oauth_user_getter);
    }, signOutNow(){
      signOut(this.oauth_user_remover);
    }
  }
};
