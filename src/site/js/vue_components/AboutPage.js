import AboutProfile from "./AboutProfile";
import Deliverables from "./Deliverables";

export default {
  name: "AboutPage",
  template: `
<section class="container">
  <section>
    <h1>About the Developers</h1>
    
    <AboutProfile
      name="Toan Nguyen"
      :links="[['https://www.google.com', 'Google']]"
      :roles="['my-role']"
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores aspernatur autem beatae, blanditiis cum cupiditate esse harum itaque maiores placeat quam quia reiciendis rerum sunt ut? Eveniet nam obcaecati praesentium.
    </AboutProfile>
    
    <AboutProfile
      name="Jacob Mitzel"
      :links="[['https://github.com/mitzeljw', 'Github']]"
      :roles="['Server', 'Database', 'User Accounts']"
    >
      Jake enjoys working on back-end systems, using Python, Java, C++, and C.  He also has experience working with SQL and NoSQL databases professionally. However, he enjoys learning new systems and does so quickly.
    </AboutProfile>
    
    <AboutProfile
      name="Joshua Fisher"
      :links="[['https://www.github.com/jfisher19335/', 'Github'], ['https://www.linkedin.com/in/joshua-fisher-57974a141/', 'LinkedIn']]"
      :roles="['AI', 'Problem Generator', 'Algebraic Actions']"
    >
      Joshua has strong interests in AI, Java, C++, and Scheme.
    </AboutProfile>
    <AboutProfile
      name="Eric Koskovich"
      :links="[['https://github.com/Fractalyst', 'Github']]"
      :roles="['History', 'HTML', 'Vue-Componentizer', 'User Profile', 'Explorer', 'Navbar']"
    >
     I like to make programs in my spare time and enjoy working with front end HTML frameworks like vue. Working on creating efficient algorithms for problems is also interesting to me.
    </AboutProfile>
    <AboutProfile
      name="Gideon Buckwalter"
      :links="[['https://github.com/eignnx/', 'GitHub'], ['https://eignnx.github.io/', 'Website']]"
      :roles="['Front-end', 'UI', 'Vue.js']"
    >
      Gideon is a computer science student who will be graduating in May, 2019. His interests include front-end web technologies, and compiler implementation.
    </AboutProfile>
  </section>
  <section>
    <h1>Deliverables</h1>
    <Deliverables/>
  </section>
</section>
  `,

  components: {
    AboutProfile,
    Deliverables,
  },
};
