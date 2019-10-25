<template>
  <el-card :class="$style.backupCard"
           v-if="backupOperation.id && backupConfig.id"
           :style="[2, 3].includes(backupOperation.state) ? 'color: #999999;' : ''">
    <div slot="header"
         class="clearfix">
      <el-tag size="mini"
              color="#8465ff"
              style="color: #ffffff">备份</el-tag>
      <span>{{backupOperation.name}}</span>
      <i v-if="![2,3].includes(backupOperation.state)"
         style="float: right; margin: 3px 0 3px 10px;"
         class="el-icon-refresh"
         :class="$style.stateRefresh"
         @click="refreshBtnClick"></i>
      <el-button style="float: right; padding: 3px 0; color: #f56c6c;"
                 type="text"
                 @click="planDeleteBtnClick">删除</el-button>
      <el-button v-if="canUpdatePlan"
                 style="float: right; padding: 3px 3px"
                 type="text"
                 @click="planUpdateBtnClick">编辑</el-button>
    </div>
    <el-row type="flex">
      <el-col :span="18">
        <el-form label-width="100px"
                 size="mini">
          <el-form-item label="计划创建时间"
                        :style="{ width: '40%'}">
            <span>{{ backupOperation.createTime }}</span>
          </el-form-item>
          <el-form-item label="备份类型"
                        style="40%">
            <div>{{ backupType }}<span v-if="backupOperation.backupType === 1">(限速: {{fmtSize(backupOperation.bwlimit*1024)}}bps)</span></div>
          </el-form-item>
          <el-form-item label="备份方向"
                        v-if="[2,3].includes(backupOperation.backupType)"
                        style="100%">
            <el-tooltip :content="backupOperation.sourcePath"
                        placement="top"
                        effect="dark">
              <span :class="$style.pathOverFlow">{{ backupOperation.sourcePath }}</span>
            </el-tooltip>
            <i class="el-icon-d-arrow-right"></i>
            <el-tooltip :content="backupOperation.targetPath"
                        placement="top"
                        effect="dark">
              <span :class="$style.pathOverFlow">{{ backupOperation.targetPath }}</span>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="备份排除文件"
                        v-if="backupOperation.backupType === 1 && backupOperation.excludeFiles.length>0"
                        style="100%">
            <span v-for="(excludeFile, index) in backupOperation.excludeFiles"
                 :key="excludeFile">
              {{ excludeFile }}<i v-if="index<backupOperation.excludeFiles.length-1">、</i>
            </span>
          </el-form-item>
          <el-form-item label="备份策略"
                        style="width: 40%">
            <span>{{ backupStrategy }}</span>
          </el-form-item>
          <el-form-item label="时间策略"
                        style="width: 40%">
            <span>{{ timeStrategy }}</span>
          </el-form-item>
          <el-form-item label="时间"
                        v-if="backupConfig.timeStrategy === 0"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      size="small">{{ backupConfig.singleTime }}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="星期"
                        v-if="backupConfig.timeStrategy === 4"
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
              <div>
                <span v-if="[2, 3].includes(backupOperation.backupType)" :class="operationStateStyle">{{backupOperation.diskInfo || '-'}}</span>
              </div>
              <el-tooltip :content="operationState"
                          placement="top-end"
                          effect="light">
                <i :class="formatIcon(backupOperation.state)" style="float:right"></i>
              </el-tooltip>
              <el-progress style="margin-right:20px" :percentage="isNaN(backupOperation.percentage)?0:backupOperation.percentage" :status="progressStatus" :text-inside="true" :stroke-width="17">
              </el-progress>
            </div>
          </li>
          <li v-if="backupConfig.timeStrategy !== 0 && backupConfig.timeStrategy !== 6">
            <h5>计划开始时间</h5>
            <div>{{backupConfig.startTime || '计划未开始'}}</div>
          </li>
          <li v-if="[2, 3].includes(backupOperation.backupType)">
            <h5>已持续时间</h5>
            <div v-if="backupOperation.consume">
              <timer v-if="backupOperation.state === 1" :val="Number(backupOperation.consume)"></timer>
              <span v-else>{{backupOperation.consume | durationFilter}}</span>
            </div>
            <div v-else>-</div>
          </li>
          <li>
            <h5>文件总大小</h5>
            <div>{{fmtSize(backupOperation.size) || '-'}}</div>
          </li>
          <li>
            <h5>上次备份大小
              <el-tooltip class="item" effect="dark"
                          content="上次备份文件总大小"
                          placement="left">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </h5>
            <div>{{fmtSize(backupOperation.backupSize) || '-' }}</div>
          </li>
          <li>
            <h5>已备份大小
              <el-tooltip class="item" effect="dark"
                          content="已备份文件总大小，非本次备份大小"
                          placement="left">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </h5>
            <div>{{fmtSize(backupOperation.progress) || '-'}}</div>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row v-show="isShow"
            :class="$style.more"
            :gutter="10">
      <el-col :span="8"
              v-for="(backupFile, index) in backupOperation.backupFiles"
              :key="index">
        <el-card shadow="always"
                 :class="$style.childFileCard">
          <div slot="header" :class="$style.childFileHead">
            <span>ID: {{ backupFile.id }}</span>
            <el-tooltip :content="`${backupFile.errorMsg}`"
                        placement="top"
                        :open-delay="300"
                        :disabled="!(backupFile.state === 3 && backupFile.errorMsg)">
              <span style="float: right"><i :class="formatIcon(backupFile.state)"></i>{{ operationStateConvert(backupFile.state) }}</span>
            </el-tooltip>
          </div>
          <el-row>
            <el-col :span="12">
              <el-tooltip :content="`文件备份源路径: ${backupFile.sourcePath}`"
                          placement="right"
                          :open-delay="300">
                <div :class="$style.wordsOverFlow">
                  <i-icon name="fileSourcePath"
                          :class="$style.backupFileInfoIcon"></i-icon>
                  <el-tag :class="$style.childFileTag"
                          type="warning"
                          size="mini">
                    <span>{{backupFile.sourcePath}}</span>
                  </el-tag>
                </div>
              </el-tooltip>
            </el-col>
            <el-col :span="12" :class="$style.backupFileState">
              <el-tooltip content="已备份大小"
                          placement="top"
                          :open-delay="300">
                <el-progress :percentage="isNaN(backupFile.percentage)?0:backupFile.percentage" :class="$style.backupFileProgress">
                </el-progress>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-tooltip :content="`备份集存放路径: ${backupFile.targetPath}`"
                          placement="right"
                          :open-delay="300">
                <div :class="$style.wordsOverFlow">
                  <i-icon name="fileTargetPath"
                      :class="$style.backupFileInfoIcon"></i-icon>
                  <el-tag :class="$style.childFileTag"
                          size="mini"
                          type="warning">
                    <span>{{backupFile.targetPath}}</span>
                  </el-tag>
                </div>
              </el-tooltip>
            </el-col>
            <el-col :span="12"
                    v-if="[1,2,3].includes(backupFile.state)"
                    :class="$style.backupFileState">
              <el-tooltip content="开始时间"
                          placement="top"
                          :open-delay="300">
                <span>{{ backupFile.startTime }}</span>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <i-icon name="size"
                      :class="$style.backupFileInfoIcon"></i-icon>
              <el-tooltip content="源文件总大小"
                          placement="right"
                          :open-delay="300">
                <span>{{ fmtSize(backupFile.sourceSize) }}</span>
              </el-tooltip>
            </el-col>
            <el-col :span="12"
                    v-if="[1,2,3].includes(backupFile.state)"
                    :class="$style.backupFileState">
              <el-tooltip content="已持续时间"
                          placement="top"
                          :open-delay="300">
                <timer :val="Number(backupFile.consume)" v-if="backupFile.state === 1"></timer>
                <span v-else>{{ backupFile.consume | durationFilter }}</span>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :class="$style.showMore"
            :style="isShow?'':'margin-top: -35px'"
            v-if="backupOperation.backupType === 1">
      <el-button type="text"
                 @click="showMore">{{showTxt}}<i :class="showIcon"></i></el-button>
    </el-row>
  </el-card>
</template>
<script>
import {
  filehostBackupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
  filehostBackupTypeMapping
} from '@/utils/constant';
import baseMixin from '@/components/mixins/baseMixins';
import Timer from '@/components/Timer';
import IIcon from '@/components/IIcon';
import { fmtSizeFn } from '@/utils/common';
import throttle from 'lodash/throttle';
export default {
  name: 'BackupCard',
  mixins: [baseMixin],
  props: {
    id: {
      type: Number,
      required: true
    },
    backupPlan: {
      type: Object,
      required: true
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      isShow: false
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
      return filehostBackupStrategyMapping[this.backupConfig.backupStrategy];
    },
    timeStrategy() {
      return timeStrategyMapping[this.backupConfig.timeStrategy];
    },
    weekPoints() {
      return this.backupConfig.weekPoints.map(p => weekMapping[p]);
    },
    operationState() {
      const content = operationStateMapping[this.backupOperation.state];
      if(this.backupOperation.state === 3 && this.backupOperation.errorMsg) {
        return `${content}: ${this.backupOperation.errorMsg}`;
      }
      return content;
    },
    backupType() {
      return filehostBackupTypeMapping[this.backupOperation.backupType];
    },
    canUpdatePlan() {
      return [1,2,3,4,5].includes(this.backupConfig.timeStrategy) ||
             (this.backupConfig.timeStrategy === 0 && this.backupOperation.state === 0);
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
      }else if(this.backupOperation.state === 0 && this.backupOperation.percentage !== 0){
        return 'success';
      } else return 'text';
    },
    showTxt() {
      return this.isShow?'收起':'查看更多'
    },
    showIcon() {
      return this.isShow?'el-icon-arrow-up':'el-icon-arrow-down';
    }
  },
  methods: {
    operationStateConvert(state) {
      return operationStateMapping[state];
    },
    // 刷新单个备份计划
    refreshBtnClick() {
      this.$emit('refresh', this.id);
    },
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
    formatIcon(data){
      if (data === 0) {
        return this.$style.waitingColor + ' el-icon-time';
      } else if (data === 1) {
        return this.$style.loadingColor + ' el-icon-loading';
      } else if(data === 3) {
        return this.$style.errorColor + ' el-icon-error';
      } else if(data === 2){
        return this.$style.successColor + ' el-icon-success';
      }else return '';
    },
    showMore() {
      this.isShow = !this.isShow;
    },
    fmtSize(size) {
      return fmtSizeFn(size);
    }
  },
  components: {
    Timer,
    IIcon
  }
}
</script>
<style lang="scss" module>
@import '@/style/color.scss';
@import '@/assets/theme/variable.scss';
.backupCard {
  margin-bottom: 15px;
}
.childFileHead {
  color: #888888;
  font-size: 12px;
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
.backupFileInfoIcon {
  width: 2em;
  display: inline-block;
  vertical-align: -0.2em;
}
.backupFileProgress > div {
  font-size: 12px !important;
  color: #888888;
}
.more {
  font-size: 14px;
  .childFileCard {
    margin-bottom: 5px;
  }
  .childFileCard > div:first-child {
    padding-top: 12px;
    padding-bottom: 12px;
  }
}
.showMore {
  text-align: center;
}
.wordsOverFlow {
  white-space:nowrap;
  overflow: hidden;
  max-width: 100%;
  display: inline-block;
  text-overflow: ellipsis;
}
.childFileTag {
  display: inline-block;
  float: right;
  max-width: 80%;
  span {
    max-width: 100%;
    display: inline-block;
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.pathOverFlow {
  white-space:nowrap;
  overflow: hidden;
  vertical-align: top;
  max-width: 230px;
  display: inline-block;
  text-overflow: ellipsis;
}
.backupFileState {
  font-size: 0.8em;
  line-height: 1.8em;
  color: #999999;
  text-align: right;
}
</style>

