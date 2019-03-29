export default {

  name: "InsertButtons",

  template: `
<div>
  <section>
    <div class="card-panel row">
      <div class="col">
        <button class="btn waves-effect waves-light">
          <i class="material-icons left">add</i>
          East-West
        </button>
      </div>
      <div class="col">
        <button class="btn waves-effect waves-light">
          <i class="material-icons left">add</i>
          North-South
        </button>
      </div>
      <div class="col">
        <button class="btn waves-effect waves-light">
          <i class="material-icons left">add</i>
          0
        </button>
        <button class="btn waves-effect waves-light">
          <i class="material-icons left">add</i>
          1
        </button>
        <button class="btn waves-effect waves-light">
          <i class="material-icons left">add</i>
          2
        </button>
      </div>
      <div class="col">
        <button class="btn waves-effect waves-light">
          <i class="material-icons left">add</i>
          x1
        </button>
        <button class="btn waves-effect waves-light">
          <i class="material-icons left">add</i>
          x2
        </button>
        <button class="btn waves-effect waves-light">
          <i class="material-icons left">add</i>
          x3
        </button>
        <button class="btn waves-effect waves-light">
          <i class="material-icons left">add</i>
          x4
        </button>
        <button class="btn waves-effect waves-light">
          <i class="material-icons left">add</i>
          x5
        </button>
      </div>  
    </div>
  </section>
  <svg
    v-if="showGhost"
    id="drag-ghost"
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
  >
    <ellipse ry="50" rx="50" cy="50" cx="50" stroke-width="1.5" stroke="#000" fill="#EE3388"/>
  </svg>
</div>
  `,

  data: () => ({
    showGhost: true,
  }),
}