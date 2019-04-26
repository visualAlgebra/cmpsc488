export default {
  name: "InvalidPage",
  props: ['remove'],
  template: `
  <div style="padding: 10rem; text-align: center;">
    <h5 v-if="waitTooLong">Woops! Looks like you visited a page that doesn't do anything!</h5>
    <div v-else class="progress">
      <div class="indeterminate"></div>
    </div>
  </div>  
  `,

  data: () => ({
    waitTooLong: false,
  }),

  mounted() {
    setTimeout(() => { this.waitTooLong = true; }, 5000);
  },
};
