<template>
  <section>
    <div :id="id" :ref="id" :style="{width: '100%', height: '300%',marginLeft:'0px', 'text-align': 'center'}">
    </div>
    <div :style="{width: '100%', height: '300%',marginTop: '10px', 'text-align': 'center'}">
      <span v-if="title ? title.show : false" :style="title.style" >{{title.text}}</span>
      <br/>
      <span v-if="subTitle ? subTitle.show : false" :style="subTitle.style" >{{subTitle.text}}</span>
    </div>
  </section>
</template>
<script>
import cax from 'cax';
import Cylinder from './index';
export default {
  name: 'backupPlans',
  props: {
    data: {
      type: Object,
      stage: null
    }
  },
  created() {
    this.draw();
  },
  computed: {
    subTitle() {
      return this.data ? this.data.subTitle : '';
    },
    title() {
      return this.data ? this.data.title : '';
    },
    id() {
      return this.data ? this.data.id : 'canvas';
    },
    color() {
      return this.data && this.data.color ? this.data.color : ['#04C1F9','#C3E9F5'];
    }
  },
  // watch: {
  //   data(){
  //     this.test();
  //   }
  // },
  updated() {
    this.$nextTick(() => {
      this.draw();
    })
  },
  methods: {
    draw() {
      if(!this.data) {
        return;
      }
      if (this.stage) {
        this.$refs[this.id].innerHTML = null;
        this.stage = null;
      }
      let width = this.data && this.data.width ? Math.round(this.data.width / 3) : 0;
      const height = this.data && this.data.height ? this.data.height : 0;
      width = width > 120 ? 120 : width;
      this.stage = new cax.Stage((width + 20), (height + 10), `#${this.id}`);
      this.stage.empty();
      for (let i = 0; i < 1; i++) {
        let cy = new Cylinder(width, height - width / 2, this.data && this.data.value ? this.data.value : 0, this.color[0], this.color[1]);
        cy.x = 10;
        cy.y = (width + 20) / 4;
        let text = new cax.Text(Math.round(cy.value * 10000) / 100 + '%', {
          font: '20px Arial',
          color: '#020B14',
        });
        text.x = cy.x + cy.width / 2 - text.getWidth() / 2;
        // text.y = cy.y + cy.surfaceY;
        text.y = height / 2;
        this.stage.add(cy, text);
      }
      cax.tick(this.stage.update.bind(this.stage));
    },
  },
};
</script>

<style>
canvas {
  /* border: 1px solid #ccc; */
  margin-top: 40px;
  margin-left: 0;
  margin-right: 0;
  padding: 0;
  /* width: 200px; */
  /* background-color: white; */
}
</style>

