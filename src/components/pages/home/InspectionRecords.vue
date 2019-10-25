<template>
  <section>
  <div :id="id" style="height: 300px"></div>
  </section>
</template>
<script>
import themeMixin from '@/components/mixins/themeMixins';
export default {
  name: 'InspectionRecords',
  mixins: [themeMixin],
  props: ['id', 'record'],
  mounted() {
    this.draw();
  },
  watch: {
    record: {
        handler() {
            this.draw();
        },
        deep: true
    },
    theme() {
        this.draw();
    }
  },
  methods: {
    draw() {
      let recordChart = this.$echarts.init(document.getElementById(this.id))
      recordChart.setOption({
          color: '#1abd9e',
          tooltip: {
              trigger: 'item',
              formatter: "{b} : {c} ",
              confine: true
          },
          grid: {
              top: 20,
              left:160
          },
          xAxis: [{
              type: 'value',
              minInterval: 1,
              color: 'red',
              axisLabel: {
                  show:true,
                  color: this.themeColor.echartsLabelColor,
              },
              axisLine: {
                  lineStyle: {
                      color: this.themeColor.echartsLabelColor
                  }
              }
          }],
          yAxis: [{
              type: 'category',
              data: ['正在巡检', '巡检完成,正在生成报告', '巡检失败', '巡检完成,报告已生成', '巡检完成,生成报告失败'],
              axisLabel: {
                  show:true,
                  fontSize: 14,
                  color: this.themeColor.echartsLabelColor,
              },
              splitLine: {
                color: this.themeColor.echartsLabelColor,
              },
              axisLine: {
                  lineStyle: {
                      color: this.themeColor.echartsLabelColor
                  }
              }
          }],
          series: [{
              type: 'bar',
              barMinHeight: 5,
              data: [
                this.record.recordCountOnRunning,
                this.record.recordCountOnReportGenerating,
                this.record.recordCountOnFail,
                this.record.recordCountOnSuccess,
                this.record.recordCountOnReportGenerateFail
              ],
              label: {
                  normal:{
                      show: true,
                      position: 'right',
                      textStyle: {
                          color: this.themeColor.echartsLabelColor,
                          fontSize: 16
                      }
                  }
              }
          }]
      });
      window.addEventListener("resize", function () {
        recordChart.resize();
      });
    }
  }
}
</script>
