export default {
  name: "AboutProfile",
  props: {
    name: String,
    roles: Array,
    links: Array,
  },
  template: `
<div class="row">
  <div class="col">
    <div class="card">
      <div class="card-content black-text">
        <span class="card-title">
          {{name}}
          <span v-for="role of roles" class="new badge">{{role}}</span>
        </span>
        <p>
          <slot></slot>
        </p>
      </div>
      <div class="card-action">
        <a v-for="[url, siteName] of links" :href="url">{{siteName}}</a>
      </div>
    </div>
  </div>
</div>
  `,
};