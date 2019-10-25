<template>
  <el-card :class="$style.restoreCard"
           v-if="restoreOperation.id && restoreConfig.id"
           :style="restoreOperation.state === 2 ? 'color: #999999;' : ''">
    <div slot="header">
      <el-tag size="mini"
              color="#fa4211"
              style="color: #ffffff">恢复</el-tag>
      <span>{{restoreOperation.name}}</span>
      <i v-if="restoreOperation.state !== 2"
         style="float: right; margin: 3px 0 3px 10px;"
         class="el-icon-refresh state-refresh"
         :class="$style.stateRefresh"
         @click="refreshBtnClick"></i>
      <el-button style="float: right; padding: 3px 0; color: #f56c6c;"
                 type="text"
                 @click="planDeleteBtnClick">删除</el-button>
      <el-button v-if="restoreOperation.state !== 2"
                 style="float: right; padding: 3px 3px"
                 type="text"
                 @click="planUpdateBtnClick">编辑</el-button>
    </div>
    <el-form inline label-width="100px"
              size="mini">
      <el-form-item label="恢复设备IP：">
        <span>{{ restoreConfig.hostIp }}</span>
      </el-form-item>
      <el-form-item label="数据库名：">
        <span>{{ restoreConfig.detailInfo }}</span>
      </el-form-item>
      <el-form-item label="端口：">
        <span>{{ restoreConfig.dbPort }}</span>
      </el-form-item>
    </el-form>
    <el-row type="flex">
      <el-col :span="18">
        <el-form label-width="100px"
                 size="mini">
          <el-form-item label="计划创建时间"
                        v-if="restoreConfig.timeStrategy !== 1"
                        :style="{ width: '100%'}">
            <span>{{ restoreConfig.startTime }}</span>
          </el-form-item>
          <el-form-item label="时间策略"
                        style="width: 40%">
            <span>{{ timeStrategy(restoreConfig.timeStrategy) }}</span>
          </el-form-item>
          <el-form-item label="时间"
                        v-if="restoreConfig.timeStrategy === 1"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      size="small">{{ restoreConfig.singleTime }}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="星期"
                        v-if="restoreConfig.timeStrategy === 2"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      v-for="point in restoreConfig.weekPoints"
                      :key="point"
                      size="small">{{ weekPointMapping(point) }}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="日期"
                        v-if="restoreConfig.timeStrategy === 3"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      v-for="point in restoreConfig.datePoints"
                      :key="point"
                      size="small">{{point}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="时间"
                        v-if="[2, 3].includes(restoreConfig.timeStrategy)"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      v-for="point in restoreConfig.timePoints"
                      :key="point.key"
                      size="small">{{point.value}}</el-tag>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6"
              :class="$style.operationInfo">
        <ul style="list-style: none">
          <li>
            <h5>当前状态</h5>
            <div>
              <div style="display: inline-block">
                <i v-if="restoreOperation.state === 0"
                   class="el-icon-time"
                   :class="operationStateStyle"></i>
                <i v-else-if="restoreOperation.state === 1"
                   class="el-icon-loading"
                   :class="operationStateStyle"></i>
                <span :class="operationStateStyle">{{operationState(restoreOperation.state) || '-'}}</span>
              </div>
            </div>
          </li>
          <li>
            <h5>恢复开始时间</h5>
            <div>{{restoreOperation.startTime || '等待下次操作'}}</div>
          </li>
          <li>
            <h5>已持续时间</h5>
            <div v-if="restoreOperation.consume">
              <timer v-if="restoreOperation.state === 1" :val="restoreOperation.consume"></timer>
              <span v-else>{{restoreOperation.consume | durationFilter}}</span>
            </div>
            <div v-else>-</div>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import throttle from 'lodash/throttle';
import baseMixin from '@/components/mixins/baseMixins';
import Timer from '@/components/Timer';
import {
  restoreTimeStrategyMapping,
  weekMapping,
  operationStateMapping,
} from '@/utils/constant';

export default {
  name: 'RestoreCard',
  mixins: [baseMixin],
  components: {
    Timer
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    restorePlan: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // 恢复操作信息
    restoreOperation() {
      const { config, ...operation } = this.restorePlan;
      return operation;
    },
    // 恢复配置信息
    restoreConfig() {
      return this.restorePlan.config;
    },
    operationStateStyle() {
      if (this.restoreOperation.state === 0) {
        return this.$style.waitingColor;
      } else if (this.restoreOperation.state === 1) {
        return this.$style.loadingColor;
      } else return '';
    },
  },
  methods: {
    weekPointMapping(num) {
      return weekMapping[num];
    },
    timeStrategy(key) {
      return restoreTimeStrategyMapping[key];
    },
    operationState(key) {
      return operationStateMapping[key];
    },
    planDeleteBtnClick() {
      this.$confirm('即将删除该恢复计划，是否继续？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          this.$emit('deletePlan', this.restorePlan.id);
        })
        .catch(() => {});
    },
    planUpdateBtnClick() {
      this.$emit('updatePlan');
    },
    refreshBtnClick() {
      this.$emit('refresh', this.id);
    },
  },
};
</script>
<style lang="scss" module>
@import '@/style/color.scss';
.restoreCard {
  margin-bottom: 15px;
}
.operationInfo {
  h5 {
    font-weight: 400;
    color: #888888;
    margin: 4px 0;
    text-align: right;
  }
  div {
    margin-left: 5px;
    text-align: right;
  }
  ul {
    list-style: none;
    margin: 0;
  }
  li {
    margin: 10px 0;
  }
}
/* 标签之间的间隔在for循环下消失了 */
.infoTag {
  margin: 0 2px;
}

.stateRefresh {
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  }
}
</style>
