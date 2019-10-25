<template>
  <el-card :class="$style.backupCard"
           v-if="backupOperation.id && backupConfig.id"
           :style="backupOperation.state === 2 ? 'color: #999999;' : ''">
    <div slot="header"
         class="clearfix">
      <el-tag size="mini"
              color="#8465ff"
              style="color: #ffffff">备份</el-tag>
      <!-- {{ backupStrategyType }} -->
      <span>{{backupOperation.name}}</span>
      <i v-if="backupOperation.state !== 2"
         style="float: right; margin: 3px 0 3px 10px;"
         class="el-icon-refresh"
         :class="$style.stateRefresh"
         @click="refreshBtnClick"></i>
      <el-button style="float: right; padding: 3px 0; color: #f56c6c;"
                 type="text"
                 @click="planDeleteBtnClick">删除</el-button>
      <el-button v-if="backupOperation.state !== 2"
                 style="float: right; padding: 3px 3px"
                 type="text"
                 @click="planUpdateBtnClick">编辑</el-button>
    </div>
    <el-row type="flex">
      <el-col :span="18">
        <el-form label-width="100px"
                 size="mini">
          <el-form-item label="计划创建时间"
                        v-if="backupConfig.timeStrategy !== 0"
                        :class="$style.backupCardFormItem"
                        :style="{ width: '100%'}">
            <span>{{ backupConfig.startTime }}</span>
          </el-form-item>
          <el-form-item label="备份策略"
                        :class="$style.backupCardFormItem"
                        style="width: 40%">
            <span>{{ backupStrategy }}</span>
          </el-form-item>
          <el-form-item label="日志策略"
                        :class="$style.backupCardFormItem"
                        style="width: 40%">
            <span>{{ logStrategy }}</span>
          </el-form-item>
          <el-form-item label="时间策略"
                        :class="$style.backupCardFormItem"
                        style="width: 40%">
            <span>{{ timeStrateg }}</span>
          </el-form-item>
          <el-form-item label="时间"
                        v-if="backupConfig.timeStrategy === 0"
                        :class="$style.backupCardFormItem"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      size="small">{{ backupConfig.singleTime }}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="星期"
                        v-if="backupConfig.timeStrategy === 4"
                        :class="$style.backupCardFormItem"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      v-for="point in weekPoints"
                      :key="point"
                      size="small">{{point}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="日期"
                        v-if="backupConfig.timeStrategy === 5"
                        :class="$style.backupCardFormItem"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      v-for="point in backupConfig.datePoints"
                      :key="point"
                      size="small">{{point}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="时间"
                        v-if="[3,4,5].indexOf(backupConfig.timeStrategy) >= 0"
                        :class="$style.backupCardFormItem"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      v-for="point in backupConfig.timePoints"
                      :key="point.key"
                      size="small">{{point.value}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="间隔"
                        v-if="backupConfig.timeStrategy === 1|| backupConfig.timeStrategy === 2"
                        :class="$style.backupCardFormItem"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      size="small">{{backupConfig.timeInterval}}分钟</el-tag>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6"
              :class="$style.operationInfo">
        <ul>
          <li>
            <h5>当前状态</h5>
            <div>
              <el-tooltip :content="backupOperation.process"
                          :disabled="backupOperation.state !== 1"
                          placement="left"
                          effect="light">
                <div style="display: inline-block">
                  <i v-if="backupOperation.state === 0"
                     class="el-icon-time"
                     :class="operationStateStyle"></i>
                  <i v-else-if="backupOperation.state === 1"
                     class="el-icon-loading"
                     :class="operationStateStyle"></i>
                  <i v-else-if="backupOperation.state === 3"
                     class="el-icon-warning"
                     :class="operationStateStyle"></i>
                  <span :class="operationStateStyle">{{operationState || '-'}}</span>
                </div>
              </el-tooltip>
            </div>
          </li>
          <li>
            <h5>备份开始时间</h5>
            <div>{{backupOperation.startTime || '备份未开始'}}</div>
          </li>
          <li>
            <h5>已持续时间</h5>
            <div v-if="backupOperation.consume">
              <timer v-if="backupOperation.state === 1" :val="backupOperation.consume"></timer>
              <span v-else>{{backupOperation.consume | durationFilter}}</span>
            </div>
            <div v-else>-</div>
          </li>
          <li>
            <h5>已备份大小</h5>
            <div>{{backupOperation.size || '-'}}</div>
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
  backupStrategyMapping,
  logStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
} from '@/utils/constant';
import { fmtSizeFn } from '@/utils/common';

export default {
  name: 'BackupCard',
  mixins: [baseMixin],
  components: {
    Timer
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    backupPlan: {
      type: Object,
      required: true,
    },
  },
  data(){
    return {
      // progressNum: 0,
    }
  },
  computed: {
    backupOperation() {
      const { config, ...operation } = this.backupPlan;
      return operation;
    },
    backupConfig() {
      return this.backupPlan.config;
    },
    backupStrategy() {
      return backupStrategyMapping[this.backupPlan.config.backupStrategy];
    },
    logStrategy(){
      return logStrategyMapping[this.backupPlan.config.logStrategy];
    },
    timeStrateg() {
      return timeStrategyMapping[this.backupPlan.config.timeStrategy];
    },
    weekPoints() {
      return this.backupPlan.config.weekPoints.map(p => weekMapping[p]);
    },
    operationState() {
      return operationStateMapping[this.backupPlan.state];
    },
    // 单次／多次
    backupStrategyType() {
      return this.backupConfig.timeStrategy === 0 ? '单次' : '循环';
    },
    operationStateStyle() {
      if (this.backupOperation.state === 0) {
        return this.$style.waitingColor;
      } else if (this.backupOperation.state === 1) {
        return this.$style.loadingColor;
      } else if(this.backupOperation.state === 3) {
        return this.$style.errorColor;
      } else return '';
    },
  },
  methods: {
    planDeleteBtnClick() {
      this.$confirm('即将删除该备份计划，是否继续？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          this.$emit('deletePlan', this.backupPlan.id);
        })
        .catch(() => {});
    },
    planUpdateBtnClick() {
      this.$emit('updatePlan');
    },
    refreshBtnClick() {
      this.$emit('refresh', this.id);
    },
    formatIcon(data){
      if (data === 0) {
        return this.$style.waitingColor + ' el-icon-time';
      } else if (data === 1) {
        return this.$style.loadingColor + ' el-icon-loading';
      } else if(data === 3) {
        return this.$style.errorColor + ' el-icon-warning';
      } else if(data === 2){
        return this.$style.successColor + ' el-icon-success';
      }else return '';
    },
  }
};
</script>
<style lang="scss" module>
@import '@/style/color.scss';
.backupCard {
  margin-bottom: 15px;
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
.backupCardForm {
  .backupCardFormItem {
    margin-bottom: 0;
  }
}
.operationInfo {
  h5 {
    font-weight: 400;
    color: #888888;
    margin: 4px 0;
    text-align: right;
  }
  div {
    // margin-left: 5px;
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
</style>
