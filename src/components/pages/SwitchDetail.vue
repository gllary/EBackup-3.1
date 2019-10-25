<template>
  <section>
    <el-row type="flex"
            justify="end"
            :gutter="10">
      <el-col :span="1">
        <i-icon :name="databaseType"
                :class="$style.databaseType"></i-icon>
      </el-col>
      <el-col :span="23">
        <h1 :class="$style.planTitle">
          {{ plan.name }}
        </h1>
      </el-col>
    </el-row>
    <el-card v-for="link in links"
             :key="link.id"
             style="margin-bottom: 20px;">
      <div slot="header" :class="$style.clearfix">
        <el-row type="flex"
                justify="space-around">
          <el-col :span="10">
            <div :class="$style.hostInfo">
              <el-popover placement="right"
                          trigger="hover"
                          width="150"
                          :open-delay="200">
                <p :class="$style.hostIp">{{ link.primaryHost.vip }}</p>
                <p v-for="vip in sonNodeVip(link)"
                   :key="vip.id"
                   :class="$style.hostIp">{{ vip }}</p>
                <i-icon :class="$style.vipIcon"
                        name="vip"
                        slot="reference"
                        v-if="link.vipIpMark && link.vipIpMark === 1 "></i-icon>
              </el-popover>
              <i-icon name="ip"
                      :class="$style.hostIpIcon"></i-icon>
              <el-tooltip :content="'生产设备：'+`${link.primaryHost.name}`"
                          placement="right"
                          effect="light">
                <span :class="$style.hostIp">{{ link.primaryHost.hostIp }}</span>
              </el-tooltip>
              <el-tooltip v-show="link.serviceIpMark === 1 && link.primaryHost.osName === 'Linux'"
                          placement="right"
                          effect="light">
                <div slot="content">
                  提供服务中
                  <br/>服务IP：{{ link.primaryHost.serviceIp }}
                </div>
                <i-icon :class="$style.serviceIcon"
                        name="service"></i-icon>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="4" style="text-align: center">
            <el-tooltip v-show="link.serviceIpMark === 1 && link.primaryHost.osName === 'Windows'"
                        placement="right"
                        effect="light">
              <div slot="content">
                提供服务中
                <br/>临时IP：{{ link.primaryHost.serviceIp }}
              </div>
              <i-icon :class="$style.templateIcon"
                      name="service"></i-icon>
            </el-tooltip>
          </el-col>
          <el-col :span="10">
            <div :class="$style.hostInfo">
              <el-popover placement="right"
                          trigger="hover"
                          width="150"
                          :open-delay="200">
                <p :class="$style.hostIp">{{ link.primaryHost.vip }}</p>
                <p v-for="vip in sonNodeVip(link)"
                   :key="vip.id"
                   :class="$style.hostIp">{{ vip }}</p>
                <i-icon :class="$style.vipIcon"
                        name="vip"
                        slot="reference"
                        v-if="link.vipIpMark && link.vipIpMark === 2 "></i-icon>
              </el-popover>
              <i-icon name="ip"
                      :class="$style.hostIpIcon"></i-icon>
              <el-tooltip :content="'易备设备：'+`${link.viceHost.name}`"
                          placement="right"
                          effect="light">
                <span :class="$style.hostIp">{{ link.viceHost.hostIp }}</span>
              </el-tooltip>
              <el-tooltip v-show="link.serviceIpMark === 2 && link.viceHost.osName === 'Linux'"
                          placement="right"
                          effect="light">
                <div slot="content">
                  提供服务中
                  <br/>服务IP：{{ link.viceHost.serviceIp }}
                </div>
                <i-icon :class="$style.serviceIcon"
                        name="service"></i-icon>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </div>
      <div :class="$style.plan">
        <el-row v-for="record in link.switch"
                :key="record.id">
          <el-col :span="7">
            <el-tooltip :content="record.type===1?'切实例':'切IP'"
                        placement="right">
              <span>
                <i-icon name="switchDatabase"
                        v-if="record.type===1"
                        :class="$style.switchType"></i-icon>
                <i-icon name="switchIp"
                        v-else
                        :class="$style.switchType"></i-icon>
                <span>{{ record.name }}</span>
              </span>
            </el-tooltip>
          </el-col>
          <el-col :span="11"><div style="min-height: 14px;">{{ record.content }}</div></el-col>
          <el-col :span="6">
            <span :class="$style.switchRecordTime"><i :class="switchStateIconClass(record.state)"></i></span>
            <span :class="$style.switchRecordState">{{ record.switchTime }}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </section>
</template>
<script>
import { fetchOne } from '../../api/switch'
import { switchTypeMapping, databaseTypeMapping } from '../../utils/constant'
import IIcon from '../IIcon'
export default {
  name: 'SwitchDetail',
  data() {
    return {
      plan: {},
      timer: null,
    }
  },
  computed: {
    links() {
      if(this.plan.alreadySwitch) {
        // 切IP在切实例之后
        return this.plan.alreadySwitch.map(item => {
          item.switch.sort((a, b) => a.type-b.type)
          return item
        })
      } else {
        return []
      }
    },
    databaseType() {
      return databaseTypeMapping[this.plan.dbType]
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.setTimer();
  },
  destroyed() {
    this.clearTimer();
  },
  methods: {
    fetchData() {
      const path = this.$route.path
      const id = path.substring(path.lastIndexOf('/')+1)
      fetchOne(id)
        .then(res => {
          const { data } = res.data;
          this.plan = data
        })
    },
    sonNodeVip(hostLink) {
      if(hostLink.primaryNodes)
        return hostLink.primaryNodes.map(node => node.vip)
      return []
    },
    setTimer() {
      this.clearTimer();
      this.timer = setInterval(() => {
        this.fetchData();
      }, 20000);
    },
    clearTimer() {
      clearInterval(this.timer);
    },
    switchStateIconClass(value) {
      switch (value) {
        case 0:
          return ['el-icon-time', this.$style.waitingColor];
        case 1:
          return ['el-icon-loading'];
        case 2:
          return ['el-icon-success', this.$style.successColor];
        case 3:
          return ['el-icon-error', this.$style.errorColor];
      }
    }
  },
  components: {
    IIcon
  }
}
</script>

<style lang="scss" module>
@import '../../style/common.scss';
@import '../../style/color.scss';
@import '@/assets/theme/variable.scss';
$primary-color: #409eff;
$vice-color: #6d6d6d;
.plan {
  font-size: 14px;
}
.databaseType {
  width: 2em;
  height: 2em;
  float: right;
}
.planTitle {
  margin-top: 0;
  line-height: 30px;
  @include primary-color;
}
.clearfix {
  margin-top: -20px;
  margin-bottom: -20px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.hostInfo {
  text-align: center;
  margin: 1em 0;
  position: relative;
}
.hostIcon {
  vertical-align: -0.3em;
  width: 2em;
}
.hostIpIcon {
  width: 2em;
  display: inline-block;
  vertical-align: -0.3em;
  margin-top: 10px;
}
.vipIcon {
  position: absolute;
  top: 12px;
  left: 110px;
}
.hostIp {
  color: #909399;
  font-style: italic;
  font-size: 0.9em;
}
.serviceIcon {
  position: absolute;
  margin-left: 30px;
  margin-top: 0.5em;
  width: 1.5em;
  height: 1.5em;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.templateIcon {
  margin-top: 1.5em;
  margin-left: 0;
  width: 1.5em;
  height: 1.5em;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.switchRecordTime {
  float: right;
  display: inline-block;
  width: 30px;
}
.switchRecordState {
  float: right;
  display: inline-block;
  width: 180px;
}
.switchType {
  vertical-align: middle;
}
</style>


