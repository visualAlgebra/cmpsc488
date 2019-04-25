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
    :links="[['https://github.com/mitzeljw', 'Github']]"
    :roles="['Server, Database, User Accounts']"
  >
    Jake enjoys working on back-end systems, using Python, Java, C++, and C.  He has experience working with SQL and NoSQL databases as well. However, he enjoys learning new systems and does so quickly.
  </AboutProfile>
  
  <AboutProfile
    name="Joshua Fisher"
    :links="[['https://www.google.com', 'Google']]"
    :roles="['my-role']"
  >
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eum expedita magni quisquam! Aliquid amet deleniti, dicta eligendi et maxime. Adipisci assumenda cum id impedit omnis qui quisquam vero voluptates.
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