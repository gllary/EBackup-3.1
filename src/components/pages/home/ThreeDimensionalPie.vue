<template>
  <section>
    <div :id="id" style="height: 100%"></div>
  </section>
</template>
<script>
import { useTypeMapping } from '@/utils/constant';
import { keepTwoDecimalFull } from '@/utils/common';
import dashboardTabMixin from '@/components/mixins/dashboardTabMixins';
import Dount from '@/components/pages/home/Dount';
import {
  fetchBackupStatistics,
  fetchRestoreStatistics,
  fetchTakeOverStatistics
} from '@/api/home';
const operateMapping = {
  backup: fetchBackupStatistics,
  restore: fetchRestoreStatistics,
  takeover: fetchTakeOverStatistics
}
export default {
  name: 'ThreeDimensionalPie',
  mixins: [dashboardTabMixin, Dount],
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      sourceData: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      operateMapping[this.type]()
        .then(res => {
          const { data } = res.data;
          this.sourceData = data;
        })
        .then(() => {
          this.draw();
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    draw() {
      // const salesData=[
      //   { label:"basic", color:"#1ABD9E", value: 34},
      //   { label:"plus", color:"#7F7F7F", value: 66}
      // ];
      const salesData = [{
        label: `${this.type}SuccessTotal`,
        color: '#1ABD9E',
        value: this.sourceData.successTotal,
        details: this.sourceData.details.map(d => (`●&nbsp${useTypeMapping[d.type]}&nbsp;<b>${d.successNum}</b>`))
      }, {
        label: `${this.type}FailTotal`,
        color: '#7F7F7F',
        value: this.sourceData.failTotal,
        details: this.sourceData.details.map(d => (`◆&nbsp${useTypeMapping[d.type]}&nbsp<b>${d.failNum}</b>`))
      }]
      var svg = this.$d3.select(`#${this.id}`).append('svg').attr('width', '100%').attr('height', '100%');
      svg.append('g').attr('id', `${this.type}Donut`);
      this.donut3D(`${this.type}Donut`, this.type, salesData, 150, 110, 80, 70, 20, 0);
    },
  }
}
</script>
