<template>
  <section>
    <div :id="id" :style="{marginTop: '-30px', width: '100%', height: '300%'}"></div>
  </section>
</template>

<script>
import { useTypeMapping } from '@/utils/constant';
import { keepTwoDecimalFull } from '@/utils/common';
import dashboardTabMixin from '@/components/mixins/dashboardTabMixins';
import themeMixin from '@/components/mixins/themeMixins';
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
  name: 'DrawPie',
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    echartsName: {
      type: String,
      default: ''
    },
  },
  mixins: [dashboardTabMixin, themeMixin],
  data() {
    return {
      sourceData: {},
      position: {},
      chart: null
    }
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.$nextTick(() => {
      const ele = document.querySelector(`#${this.id}`);
      this.position = { left: ele.getBoundingClientRect().left, top: ele.getBoundingClientRect().top };
    })
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.sizeFun);
  },
  computed: {
    tooltip() {
      return {
        trigger: 'item',
        backgroundColor:'rgba(255,255,255,0.8)',
        color:'black',
        borderWidth:'1',
        borderColor:'gray',
        textStyle: {
          color: 'black'
        },
        position: this.tooltipPosition,
        formatter: res => {
          const total = res.data.explain === 'success' ? this.sourceData.successTotal : this.sourceData.failTotal;
          const num = res.data.explain === 'success' ? 'successNum' : 'failNum';
          res.color = typeof res.color === 'string' ? res.color : '#1abb9c';
          const marker = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${res.color};"></span>`
          if(total <= 0) {
            return `<p>${marker}无</p>`;
          } else {
            let rootElement = document.createElement('p');
            rootElement.id = 'rootElement';
            const details = this.sourceData.details;
            for (let i = 0, j = details.length; i < j; i++) {
              if (details[i][num] > 0) {
                let p = document.createElement('p');
                p.style = "margin: 8px 0"
                p.innerHTML = `${marker}${useTypeMapping[details[i].type]}: <b>${details[i][num]}</b>`
                rootElement.appendChild(p);
              }
            }
            return rootElement.innerHTML;
          }
        }
      };
    },
    title() {
      return {
        text: this.calcPercent(this.sourceData.successTotal, this.sourceData.successTotal + this.sourceData.failTotal) + '%',
        subtext: '成功率',
        x: 'center',
        y: '45%',
        textStyle: {
          color: '#1abb9c',
          fontSize: 30
        }
      };
    },
    options() {
      if (this.theme === 'default') {
        return {
          tooltip: this.tooltip,
          title: this.title,
          series: [
            {
              name: this.echartsName,
              type: 'pie',
              radius: ['45%', '55%'],
              hoverAnimation: false,
              color: ['#1abb9c', '#7F7F7F'],
              data: [
                {
                  value: this.sourceData.successTotal,
                  name: '成功',
                  dataType: 1,
                  label: {
                    normal: {
                      formatter: '{b} : {c}',
                      position: 'inner'
                    }
                  },
                  explain: 'success'
                },
                {
                  value: this.sourceData.failTotal,
                  name: '失败',
                  label: {
                    normal: {
                      formatter: '{b} : {c}',
                      position: 'inner'
                    }
                  },
                  explain: 'fail'
                }
              ]
            }
          ]
        };
      } else if (this.theme === 'deepBlue') {
        return {
          tooltip: this.tooltip,
          title: this.title,
          series: [
            {
              name: this.echartsName,
              type: 'pie',
              radius: ['45%', '55%'],
              hoverAnimation: false,
              data: [
                {
                  value: this.sourceData.successTotal,
                  name: '成功',
                  dataType: 1,
                  label: {
                    normal: {
                      formatter: '{b} : {c}',
                      color: '#63c587',
                      position: 'inner'
                    }
                  },
                  itemStyle: {
                    color: {
                      colorStops: [{
                        offset: 0, color: '#2fb099'
                      }, {
                        offset: 1, color: '#206a3d'
                      }]
                    },
                  },
                  explain: 'success'
                },
                {
                  value: this.sourceData.failTotal,
                  name: '失败',
                  itemStyle: {
                    color: 'rgba(102, 102, 102, 0.5)',
                  },
                  label: {
                    normal: {
                      formatter: '{b} : {c}',
                      position: 'inner'
                    }
                  },
                  explain: 'fail'
                }
              ]
            },
            {
              type: 'pie',
              name: '',
              radius: ['0%', '65%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              silent: true,
              label: {
                show: false
              },
              data: [
                {
                  value: 1,
                  itemStyle: {
                    normal: {
                      color: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.5,
                        colorStops: [
                          {
                            offset: 0,
                            color: 'rgba(21, 43, 66, 0.5)'
                          },
                          {
                            offset: 0.9,
                            color: 'rgba(21, 43, 66, 0.1)'
                          },
                          {
                            offset: 1,
                            color: 'rgba(160,247,255,0.23)'
                          }
                        ],
                        globalCoord: false
                      }
                    }
                  }
                }
              ]
            },
          ]
        }
      } else if (this.theme === 'yellow') {
        return {
          tooltip: this.tooltip,
          title: this.title,
          series: [
            {
              name: this.echartsName,
              type: 'pie',
              radius: ['45%', '55%'],
              hoverAnimation: false,
              data: [
                {
                  value: this.sourceData.successTotal,
                  name: '成功',
                  dataType: 1,
                  itemStyle: {
                    color: {
                      colorStops: [{
                        offset: 0, color: '#2fb099'
                      }, {
                        offset: 1, color: '#206a3d'
                      }]
                    },
                  },
                  label: {
                    normal: {
                      formatter: '{b} : {c}',
                      color: '#63c587',
                      position: 'inner'
                    }
                  },
                  explain: 'success'
                },
                {
                  value: this.sourceData.failTotal,
                  name: '失败',
                  itemStyle: {
                    color: '#7b7b7b',
                  },
                  label: {
                    normal: {
                      formatter: '{b} : {c}',
                      position: 'inner'
                    }
                  },
                  explain: 'fail'
                }
              ]
            },
            {
              type: 'pie',
              name: '',
              radius: ['58%', '60%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              silent: true,
              label: {
                show: false
              },
              data: [
                {
                  value: 1,
                  itemStyle: {
                    normal: {
                      color: {
                        colorStops: [{
                          offset: 0, color: '#63c587'
                        }, {
                          offset: 1, color: '#008000'
                        }]
                      }
                    }
                  }
                }
              ]
            },
          ]
        }
      }
    },
  },
  watch: {
    theme() {
      this.setChart();
    }
  },
  methods: {
    fetchData() {
      operateMapping[this.type]()
        .then(res => {
          const { data } = res.data;
          this.sourceData = data;
        })
        .then(() => {
          this.setChart();
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    sizeFun() {
      this.chart&&this.chart.resize();
    },
    calcPercent(diviver, dividend) {
      if(Number(dividend) === 0) {
        return 100;
      }
      if(Number(diviver) < 0) {
        return 0;
      }
      return keepTwoDecimalFull((diviver/dividend)*100);
    },
    jumpToMoreState(params, successPath, errorPath) {
      if(params.name.includes('成功')) {
        this.$router.push({path: 'morestate', query: { type: successPath } });
      } else if(params.name.includes('失败')) {
        this.$router.push({path: 'morestate', query: { type: errorPath } });
      }
    },
    tooltipPosition(point, params, dom, rect, size) {
      var x = 0; // x坐标位置
      var y = 0; // y坐标位置
      var pointX = point[0];
      var pointY = point[1];
      // 提示框大小
      var boxWidth = size.contentSize[0];
      var boxHeight = size.contentSize[1];
      // boxWidth > pointX 说明鼠标左边放不下提示框
      if (boxWidth > pointX) {
        x = 150;
      } else { // 左边放的下
        x = pointX - boxWidth-15;
      }
      // boxHeight > pointY 说明鼠标上边放不下提示框
      if (boxHeight > pointY) {
        y = 0;
      } else { // 上边放得下
        y = pointY - boxHeight;
      }
      // dom.style.position = 'fixed';
      return [x, y];
    },
    draw(option) {
      this.chart = this.$echarts.init(document.getElementById(this.id));
      this.chart.setOption(option, true);
      window.addEventListener("resize", this.sizeFun);
      this.chart.on('click', params => {
        this.jumpToMoreState(params, `${this.type}Success`, `${this.type}Fail`);
      });
    },
    setChart() {
      let option = this.options;
      this.draw(option);
    }
  }
}
</script>