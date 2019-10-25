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
                 :class="type==='linux' ? $style.backupCardForm : ''"
                 size="mini">
          <el-form-item label="计划创建时间"
                        v-if="backupConfig.timeStrategy !== 0"
                        :class="$style.backupCardFormItem"
                        :style="{ width: '40%'}">
            <span>{{ backupConfig.startTime }}</span>
          </el-form-item>
          <el-form-item v-if="type === 'windows'"
                        :class="$style.backupCardFormItem"
                        label="是否备份系统"
                        style="width: 40%">
            <span>{{ backupOperation.backupSystem === 'sys' ? '是' : '否' }}</span>
          </el-form-item>
          <el-form-item label="备份策略"
                        :class="$style.backupCardFormItem"
                        style="width: 40%">
            <span>{{ backupStrategy }}</span>
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
          <el-form-item label="源文件路径"
                        :class="$style.backupCardFormItem"
                        style="40%">
            <span>{{ backupOperation.backupPath }}</span>
          </el-form-item>
          <el-form-item label="存储目标路径"
                        v-if="type === 'linux'"
                        :class="$style.backupCardFormItem"
                        style="40%">
            <span>{{ backupOperation.pointTargetPath }}</span>
          </el-form-item>
          <el-form-item label="NFS目标路径"
                        v-if="type === 'linux'"
                        :class="$style.backupCardFormItem"
                        style="40%">
            <span>{{ backupOperation.nfsTargetPath }}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6"
              :class="$style.operationInfo">
        <ul>
          <li>
            <h5>当前状态</h5>
            <div>
              <div>
                <span v-if="type === 'windows'" :class="operationStateStyle">{{diskInfo || '-'}}</span>
              </div>
              <el-tooltip :content="operationState"
                      placement="top-end"
                      effect="light">
                <i :class="formatIcon(backupOperation.state)" style="float:right"></i>
              </el-tooltip>
              <el-progress style="margin-right:20px" :percentage="progressNum" :status="progressStatus" :text-inside="true" :stroke-width="17">
              </el-progress>
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
            <h5>{{type === 'windows' ? '总大小' : '已备份大小'}}
              <el-tooltip class="item" effect="dark"
                          :content="type === 'windows' ? '备份源总大小' : '已备份文件总大小，非本次备份大小'"
                          placement="left">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </h5>
            <div>{{backupSize || '-'}}</div>
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
    type: {
      type: String
    }
  },
  data(){
    return {
      // progressNum: 0,
      disk:''
    }
  },
  computed: {
    backupOperation() {
      const { config, ...operation } = this.backupPlan;
      return operation;
    },
    progressNum(){
      const {process: data, size, state} = this.backupOperation;
      if(state === 2){
        return 100;
      }
      if(this.type === 'windows'){
        if(!data){
          return 0;
        }
        const reg = /.*\(([^\(\)]*)\).*\(([^\(\)]*)\).*/;
        const result = data.match(reg);
        if(!result){
          return 0;
        }
        if(result[1]){
          this.disk = result[1];
        }
        if(result[2]){
          let num = Number(result[2].substring(0,result[2].length - 1));
          return num || num === 0 ? num : 0;
        }
      }else if(this.type === 'linux'){
        if(data && size){
          if(Number(size)){
            // 取百分比
            let num = (Number(data) / Number(size)) * 100;
            if (state === 0 && num >= 100) {
              num = 100;
            }else if(num > 0 && num < 1){
              num = 1;
            }else{
              // 此处不能作四舍五入
              num = parseInt(num > 99 ? 99 : num);
            }
            return num || num === 0 ? num : 0;
          }
        }
      }
    },
    backupConfig() {
      return this.backupPlan.config;
    },
    backupStrategy() {
      return backupStrategyMapping[this.backupPlan.config.backupStrategy];
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
    progressStatus(){
      if(this.backupOperation.state === 2){
        return 'success';
      }else if(this.backupOperation.state === 3){
        return 'exception';
      }else if(this.backupOperation.state === 0 && this.progressNum !== 0){
        return 'success';
      }else return '';
    },
    diskInfo(){
      let str = '';
      if(this.type === 'windows'){
        if(this.backupOperation.state === 0){
          str = '未开始';
        }else if(this.backupOperation.state === 2){
          str = '已完成';
        }else if(this.backupOperation.state === 1){
          str = `正在备份卷(${this.disk})`;
        }
      }
      return str;
    },
    backupSize(){
      let {process, size, state} = this.backupOperation;
      let fmtSize = 0;
      if(this.type === 'linux'){
        process = Number(process);
        fmtSize = fmtSizeFn(process);
      }else if(this.type === 'windows'){
        fmtSize = fmtSizeFn(Number(size));
      }
      return !fmtSize ? (state !== 0 ? 0 : '-') : fmtSize;
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
