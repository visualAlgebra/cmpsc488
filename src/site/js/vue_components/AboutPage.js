import AboutProfile from "./AboutProfile";

export default {
  name: "AboutPage",
  template: `
<section class="container">
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
    :links="[['https://www.google.com', 'Google']]"
    :roles="['my-role']"
  >
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate facilis iusto magnam magni, nulla omnis perspiciatis recusandae similique? Atque beatae deserunt dolore dolores dolorum eligendi pariatur placeat possimus quia veniam?
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
    :links="[['https://www.google.com', 'Google']]"
    :roles="['my-role']"
  >
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, adipisci atque aut commodi cupiditate eaque eveniet explicabo fugiat magnam minus molestias omnis pariatur praesentium quas quisquam rerum, unde veniam voluptate!
  </AboutProfile>
  
  <AboutProfile
    name="Gideon Buckwalter"
    :links="[['https://github.com/eignnx/', 'GitHub'], ['https://eignnx.github.io/', 'Website']]"
    :roles="['Front End', 'UI']"
  >
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto cum earum ex harum iusto molestiae natus, nisi non reiciendis tenetur! Accusantium at dolores enim pariatur rem. Exercitationem iste omnis sint.
  </AboutProfile>
</section>
  `,

  components: {
    AboutProfile,
  },
};