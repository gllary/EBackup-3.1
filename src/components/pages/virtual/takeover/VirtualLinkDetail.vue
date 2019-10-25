<template>
  <section>
    <header class="detail-header header"
            v-if="link">
      <el-row type="flex"
              justify="space-around">
        <el-col :span="7">
          <section>
            <h4 class="title">
              <el-tooltip content="提供服务中"
                          placement="top"
                          effect="light">
                <i-icon name="service"
                        class="link-service"
                        v-if="[0, 1].includes(link.state)"></i-icon>
              </el-tooltip>
              <router-link class="primaryLink"
                           :to="`/virtual/${type}/${link.sourceVirtual.id}`">
                {{link.sourceVirtual.vmName}}
              </router-link>
            </h4>
            <el-form size="small"
                     label-width="100px"
                     label-position="right"
                     class="item-info">
              <el-row>
                <el-col :offset="4"
                        :span="18">
                  <el-form-item label="虚拟机IP">
                    <span>{{ link.sourceVirtual.ip }}</span>
                  </el-form-item>
                  <el-form-item label="虚拟机类型">
                    <span>{{ link.sourceVirtual.type | vmTypeFilter }}</span>
                  </el-form-item>
                  <el-form-item label="所属物理主机">
                    <span>{{ link.sourceVirtual.vmHostName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </section>
        </el-col>
        <el-col :span="10">
          <section class="linkSection">
            <div style="position: relative; height: 3em; display: inline-block"
                 v-if="link.state === 0 || (link.state === 1 && link.currentSyncStatus === 1)">
              <div class="rightMask"></div>
              <i-icon :name="linkIcon(link)"
                      class="linkIcon"></i-icon>
            </div>
            <div style="position: relative; height: 3em; display: inline-block"
                  v-else-if="link.state === 3">
                <div class="leftMask"></div>
                <i-icon :name="linkIcon(link)"
                        class="linkIcon"></i-icon>
            </div>
            <i-icon :name="linkIcon(link)"
                    class="linkIcon"
                    v-else></i-icon>
            <div>
              <el-tag :type="link.state | linkStateStyleFilter"
                      style="margin-left: 10px"
                      size="mini">{{ link.state | linkStateFilter }}</el-tag>
            </div>
            <div v-if="link.linkMessage">
              <div class="linkMsg">
                {{link.linkMessage}}
              </div>
            </div>
            <el-form size="small"
                     label-width="120px"
                     label-position="right"
                     class="item-info">
              <el-row type="flex"
                      style="text-align: left">
                <el-col :span="16"
                        :offset="8">
                  <el-form-item label="同步策略">
                    <span>{{ link.strategyConfig.syncTimeStrategy | syncStrategyFilter }}</span>
                  </el-form-item>
                  <el-form-item label="同步周期"
                                v-if="[1, 2].includes(link.strategyConfig.syncTimeStrategy)">
                    <span>{{ link.strategyConfig.syncTimeInterval  }}{{ link.strategyConfig.syncTimeStrategy === 1 ? '分钟' : '小时' }}</span>
                  </el-form-item>
                  <el-form-item label="星期"
                                v-if="link.strategyConfig.syncTimeStrategy === 4">
                    <el-tag class="infoTag"
                            v-for="week in link.strategyConfig.weekDays"
                            :key="week"
                            size="mini">{{ weekMapping[week] }}</el-tag>
                  </el-form-item>
                  <el-form-item label="时间"
                                v-if="[3, 4].includes(link.strategyConfig.syncTimeStrategy)">
                    <el-tag class="infoTag"
                            size="mini">{{ link.strategyConfig.syncRunTime }}</el-tag>
                  </el-form-item>
                  <el-form-item label="下次同步时间"
                                v-if="link.strategyConfig.nextSyncTime">
                    <span>{{ link.strategyConfig.nextSyncTime }}</span>
                  </el-form-item>
                  <el-form-item label="初始化持续时间"
                                v-if="link.initTime">
                    <timer v-if="link.state === 0" :val="link.initTime"></timer>
                    <span v-else>{{ link.initTime | durationFilter }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </section>
        </el-col>
        <el-col :span="7">
          <section>
            <h4 class="title">
              <el-tooltip content="提供服务中"
                          placement="top"
                          effect="light">
                <i-icon name="service"
                        class="link-service"
                        v-if="[2, 3].includes(link.state)"></i-icon>
              </el-tooltip>
              {{link.targetVirtual.vmName}}
            </h4>
            <el-form size="small"
                     label-width="100px"
                     label-position="right"
                     class="item-info">
              <el-row>
                <el-col :span="18"
                        :offset="4">
                  <el-form-item label="虚拟机IP">
                    <span>{{ link.targetVirtual.ip | ipFilter }}</span>
                  </el-form-item>
                  <el-form-item label="虚拟机类型">
                    <span>{{ link.targetVirtual.type | vmTypeFilter }}</span>
                  </el-form-item>
                  <el-form-item label="所属物理主机">
                    <span>{{ link.targetVirtual.vmHostName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </section>
        </el-col>
      </el-row>
    </header>
    <h3>操作记录</h3>
    <el-table :data="records"
              style="width: 100%">
      <el-table-column prop="type"
                       label="类型"
                       align="center"
                       min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.type | syncOperationFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       prop="state"
                       align="center"
                       min-width="60">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | operationStateStyleFilter"
                  size="mini">
            {{ scope.row.state | operationStateFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="信息"
                       prop="content"
                       align="center"
                       min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.content ? scope.row.content : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间"
                       prop="time"
                       align="center"
                       min-width="80"></el-table-column>
      <el-table-column label="持续时间"
                       align="center"
                       min-width="80">
        <template slot-scope="scope">
          <!-- <span>{{ scope.$index }}</span> -->
          <span v-if="scope.$index % 2 === 0">-</span>
          <span v-else>{{ calcTime(records[scope.$index].time, records[scope.$index-1].time) | durationFilter }}</span>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import {
  vmTypeMapping,
  syncLinkMapping,
  weekMapping,
  syncStragegyMapping,
  syncOperationMapping,
  syncOperationStateMapping
} from '@/utils/constant';
import { fetchOperationRecords, fetchLinks } from '@/api/virtuals';
import baseMixin from '@/components/mixins/baseMixins';
import Timer from '@/components/Timer';
import dayjs from 'dayjs';

export default {
  name: 'VirtualLinkDetail',
  props: ['id'],
  mixins: [baseMixin],
  components: {
    Timer
  },
  data() {
    return {
      records: [],
      link: null,
      weekMapping
    }
  },
  filters: {
    vmTypeFilter(type) {
      return vmTypeMapping[type];
    },
    linkStateFilter(type) {
      return syncLinkMapping[type];
    },
    ipFilter(value) {
      return value ? value : '暂无';
    },
    syncStrategyFilter(type) {
      return syncStragegyMapping[type];
    },
    syncOperationFilter(type) {
      return syncOperationMapping[type];
    },
    operationStateStyleFilter(state) {
      if (state === 0) {
        return 'success';
      } else if (state === 1) {
        return 'warning';
      } else if (state === 2) {
        return 'danger';
      }
      return '';
    },
    operationStateFilter(state) {
      return syncOperationStateMapping[state];
    },
    linkStateStyleFilter(type) {
      switch(type) {
        case 0:
        case 1:
          return 'warning';
        case 2:
        case 3:
        case 4:
          return 'danger';
        default:
          return 'primary';
      }
    },
    linkIconFilter(state) {
      switch(state) {
        case 0:
          return 'switch-1';
        case 1:
          return 'transportationRight';
        case 2:
          return 'transportationRight-warning';
        case 3:
          return 'transportationLeft-warning';
        case 4:
          return 'switch-3';
        default:
          return '';
      }
    }
  },
  created() {
    this.fetchData();
  },
  computed: {
    type() {
      const path = this.$route.path;
      return this.$route.path.split('/')[2];
    },
    linkId() {
      return Number(this.id);
    }
  },
  methods: {
    fetchData() {
      fetchOperationRecords(this.linkId)
        .then(res => {
          const { data: records } = res.data;
          this.records = records.sort((a, b) => this.calcTime(a.time, b.time));
        })
        .catch(error => {
          this.$message.error(error);
        })
      fetchLinks()
        .then(res => {
          const { data: links } = res.data;
          this.link = links.find(link => link.id === this.linkId);
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    calcTime(pre, next) {
      return dayjs(pre).unix() - dayjs(next).unix();
    },
    linkIcon(link) {
      if (link.state === 0 || (link.state === 1 && link.currentSyncStatus === 1)) {
        return 'transportationRight';
      } else if (link.state === 1 && link.currentSyncStatus === 0) {
        return 'switch-2';
      } else if (link.state === 2 && link.latestOperationInfo.type === 0 && link.latestOperationInfo.state === 1) {
        return 'link-exchange';
      } else if (link.state === 2) {
        return 'link-stop';
      } else if (link.state === 3) {
        return 'transportationLeft-warning';
      } else if (link.state === 4) {
        return 'switch-3';
      }
      return '';
    },
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
@import '@/style/color.scss';
</style>
<style lang="scss" scoped>
@import '@/assets/theme/variable.scss';
.header {
  padding-bottom: 10px;
}
.linkIcon {
  width: 3em;
  height: 3em;
  vertical-align: -0.5em;
}
.linkSection {
  font-size: 0.8em;
  text-align: center;
}
.linkMsg {
  display: inline-block;
  text-align: left;
  margin-top: 10px;
}
.title {
  text-align: center;
  display: block;
}
.infoTag {
  margin: 0 2px;
}
.rightMask,
.leftMask {
  animation: move 2s infinite;
  position: absolute;
  height: 3em;
  width: 100px;
  right: -20px;
  background: #fff;
  @include host-link-content-color;
}
.leftMask {
  left: -20px;
}
@keyframes move {
  from {
    width: 100px;
  }
  to {
    width: 0;
  }
}
.link-service {
  vertical-align: -0.3em;
  transition: all 0.5s ease;
}
.link-service:hover {
  transform: scale(1.2);
  cursor: pointer;
}
</style>
