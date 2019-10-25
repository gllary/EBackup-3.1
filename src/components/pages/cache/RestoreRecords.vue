<template>
  <section>
    <div>
      <h4>正在执行的恢复操作
        <el-tooltip content="刷新"
                    placement="top"
                    :open-delay="300">
          <i  class="el-icon-refresh"
              :class="$style.stateRefresh"
              @click="$emit('restoreinfo:refresh')"></i>
        </el-tooltip>
      </h4>
      <div v-show="plans.length === 0"
           :class="$style.noRestoreTip">
        <span>暂无操作</span>
      </div>
      <el-row v-show="plans.length > 0"
              :gutter="20"
              style="min-height: 144px;">
        <el-col :span="8"
                v-for="item in plans"
                :key="item.id">
          <el-card shadow="hover"
                   :class="$style.ongoingRestoreCard">
            <div>
              <span>
                <el-tooltip content="进行中"
                            placement="top"
                            :open-delay="300">
                  <i :class="['el-icon-loading', $style.successColor]"></i> 
                </el-tooltip>
                <el-tooltip content="已持续时间"
                            placement="top"
                            :open-delay="300">
                  <timer :val="item.consume"></timer> 
                </el-tooltip>
              </span>
              <el-tooltip content="恢复开始时间"
                            placement="top"
                            :open-delay="300">
                <span :class="[$style.restoreStartTime, 'hidden-']">{{item.startTime}}</span>
              </el-tooltip>
            </div>
            <el-row v-if="true" :class="$style.margin14">
              <el-col :span="12">
                <i-icon name="ip"
                        :class="$style.ongoingRestoreIcon"></i-icon>
                <el-tooltip content="目标设备IP"
                            placement="right"
                            :open-delay="300">
                  <span >{{ item.config.hostIp }}</span>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row :class="$style.margin14">
              <el-col :span=18>
                <el-tooltip content="数据库名"
                            placement="right"
                            :open-delay="300">
                  <div :class="$style.wordsOverFlow">
                    <i-icon name="instance"
                            :class="$style.ongoingRestoreIcon"></i-icon>
                    <span>{{item.config.detailInfo }}</span>
                  </div>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div>
      <h4>已完成恢复记录</h4>
      <el-table :data="records"
                :default-sort="{ prop: 'startTime', order: 'descending' }">
        <el-table-column prop="startTime"
                         label="开始时间"
                         align="center"
                         min-width="150px">
        </el-table-column>
        <el-table-column prop="endTime"
                         label="结束时间"
                         align="center"
                         min-width="150px">
        </el-table-column>
        <el-table-column prop="hostIp"
                         label="恢复设备IP"
                         align="center"
                         min-width="150px">
        </el-table-column>
        <el-table-column prop="detailInfo"
                         label="数据库名"
                         align="center"
                         min-width="150px">
          <template slot-scope="scope">
            <span>{{details.instanceName}}</span>
          </template>
        </el-table-column>
          
        <!-- <el-table-column prop="dbPort"
                         label="端口"
                         align="center"
                         min-width="50px"></el-table-column> -->
        <el-table-column prop="state"
                         label="状态"
                         align="center"
                         min-width="70px">
          <template slot-scope="scope">
            <el-tooltip :disabled="scope.row.state === 0"
                        :content="scope.row.errorMsg"
                        placement="right"
                        effect="light">
              <i v-if="scope.row.state === 0"
                 class="el-icon-success"
                 :class="$style.successColor"></i>
              <i v-else
                 class="el-icon-error"
                 @mouseenter="mouseenterFn(scope.row)"
                 :class="$style.errorColor"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import Timer from '@/components/Timer';
import { cancelRestoreHighlight } from '@/api/home';
export default {
  name: 'RestoreRecords',
  props: {
    restorePlan: {
      type: Array,
      required: true,
    },
    records: {
      type: Array,
      required: true,
    },
    details: {
      type: Object
    }
  },
  data() {
    return {
      machineType: 1
    }
  },
  computed: {
    // 正在进行中的恢复计划
    plans() {
      return this.restorePlan.filter(plan => plan.state === 1);
    }
  },
  methods: {
    mouseenterFn(row) {
      cancelRestoreHighlight(row.id, this.machineType).then(res => {
        // console.log('ok')
      });
    }
  },
  components: {
    IIcon,
    Timer
  },
};
</script>
<style lang="scss" module>
@import '@/style/color.scss';
.noRestoreTip {
  font-size: 4em;
  color: #c0c4cc;
  min-height: 144px;
  margin: auto;
  width: 280px;
  span {
    line-height: 2.2em;
  }
}
.ongoingRestoreCard {
  font-size: 14px;
}
.wordsOverFlow {
  white-space:nowrap;
  overflow: hidden;
  max-width: 100%;
  display: inline-block;
  text-overflow: ellipsis;
}
.restoreStartTime {
  font-size: 0.8em;
  line-height: 1.8em;
  color: #999999;
  float: right;
}
.stateRefresh {
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  }
}
.ongoingRestoreIcon {
  width: 2em;
  display: inline-block;
  vertical-align: -0.2em;
}
.margin14{
  margin-top: 1em;
  margin-bottom: 1em
}
</style>
