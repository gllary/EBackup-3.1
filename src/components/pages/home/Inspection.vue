<template>
  <div :id="id" style="height: 300px"></div>
</template>
<script>
import { fetchInspectRecords } from '@/api/inspection';
import Dount from '@/components/pages/home/Dount';
import themeMixin from '@/components/mixins/themeMixins';
export default {
  name: 'Inspection',
  props: ['inspect', 'id'],
  mixins: [Dount, themeMixin],
  data() {
    return {

    }
  },
  mounted() {
    this.draw();
  },
  watch: {
    inspect: {
      handler() {
        this.draw();
      },
      deep: true
    },
    theme() {
      this.draw();
    },
  },
  methods: {
    draw() {
      const inspectData = [{
        label: '立即',
        color: '#1ABD9E',
        value: this.inspect.jobCountByOne
      }, {
        label: '按月',
        color: '#7F7F7F',
        value: this.inspect.jobCountByMonth
      }, {
        label: '按季度',
        color: '#ccac68',
        value: this.inspect.jobCountByQuarter
      }]
      var svg = this.$d3.select(`#${this.id}`).append('svg').attr('width', '100%').attr('height', '100%');
      svg.append('g').attr('id', 'inspection');
      this.donut3D('inspection', inspectData, 150, 110, 80, 70, 20, 0);
    }
  }
}
</script>
