<template>
  <el-card :class="$style.restoreCard"
           v-if="restorePlan.id && restorePlan.id"
           :style="[2, 3].includes(restorePlan.state) ? 'color: #999999;' : ''">
    <div slot="header">
      <el-tag size="mini"
              color="#fa4211"
              style="color: #ffffff">恢复</el-tag>
      <span>{{restorePlan.planName || restorePlan.startTime}}</span>
      <i v-if="![2,3].includes(restorePlan.state)"
         style="float: right; margin: 3px 0 3px 10px;"
         class="el-icon-refresh state-refresh"
         :class="$style.stateRefresh"
         @click="refreshBtnClick"></i>
      <el-button style="float: right; padding: 3px 0; color: #f56c6c;"
                 type="text"
                 @click="planDeleteBtnClick">删除</el-button>
    </div>
    <el-row type="flex">
      <el-col :span="18">
        <el-form label-width="100px"
                 size="mini">
          <el-form-item label="计划创建时间">
            <span>{{ restorePlan.startTime }}</span>
          </el-form-item>
          <el-form-item label="恢复设备IP">
            <span>{{ restorePlan.targetFileHost.hostIp }}</span>
          </el-form-item>
          <el-form-item label="恢复类型"
                        style="40%">
            <div>{{ restoreType }}</div>
          </el-form-item>
          <el-form-item label="恢复方向"
                        v-if="restorePlan.restoreType === 2"
                        style="100%">
            <el-tooltip :content="restorePlan.sourcePath"
                        placement="top"
                        effect="dark">
              <span :class="$style.pathOverFlow">{{ restorePlan.sourcePath }}</span>
            </el-tooltip>
            <i class="el-icon-d-arrow-right"></i>
            <el-tooltip :content="restorePlan.targetPath"
                        placement="top"
                        effect="dark">
              <span :class="$style.pathOverFlow">{{ restorePlan.targetPath }}</span>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="挂载点路径"
                        v-if="restorePlan.restoreType === 2"
                        style="100%">
            <el-tooltip :content="restorePlan.pointPath"
                        placement="top"
                        effect="dark">
              <span :class="$style.pathOverFlow">{{ restorePlan.pointPath }}</span>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="恢复排除文件"
                        v-if="restorePlan.restoreType === 1 && restorePlan.excludeFiles.length>0"
                        style="100%">
            <span v-for="(excludeFile, index) in restorePlan.excludeFiles"
                 :key="excludeFile">
              {{ excludeFile }}<i v-if="index<restorePlan.excludeFiles.length-1">、</i>
            </span>
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
                <span v-if="[2,3].includes(restorePlan.restoreType)" :class="operationStateStyle">{{ restorePlan.diskInfo || '-' }}</span>
              </div>
              <el-tooltip :content="operationState"
                          placement="top-end"
                          effect="light">
                <i :class="formatIcon(restorePlan.state)" style="float:right"></i>
              </el-tooltip>
              <el-progress style="margin-right:20px" :percentage="isNaN(restorePlan.percentage)?0:restorePlan.percentage" :status="progressStatus" :text-inside="true" :stroke-width="17">
              </el-progress>
            </div>
          </li>
          <li>
            <h5>恢复开始时间</h5>
            <div>{{restorePlan.startTime }}</div>
          </li>
          <li v-if="[2,3].includes(restorePlan.restoreType)">
            <h5>已持续时间</h5>
            <div v-if="restorePlan.consume">
              <timer v-if="restorePlan.state === 1" :val="Number(restorePlan.consume)"></timer>
              <span v-else>{{restorePlan.consume | durationFilter}}</span>
            </div>
            <div v-else>-</div>
          </li>
          <li>
            <h5>文件总大小</h5>
            <div>{{fmtSize(restorePlan.size) || '-'}}</div>
          </li>
          <li>
            <h5>已恢复大小
              <el-tooltip class="item" effect="dark"
                          content="已恢复文件总大小，非本次恢复大小"
                          placement="left">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </h5>
            <div>{{fmtSize(restorePlan.progress) || '-'}}</div>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row v-show="isShow"
            :class="$style.more"
            :gutter="10">
      <el-col :span="8"
              v-for="(restoreFile, index) in restorePlan.restorePath"
              :key="index">
        <el-card shadow="always"
                 :class="$style.childFileCard">
          <div slot="header" :class="$style.childFileHead">
            <span>ID: {{ restoreFile.id }}</span>
            <el-tooltip :content="`${restoreFile.errorMsg}`"
                        placement="top"
                        :open-delay="300"
                        :disabled="!(restoreFile.state === 3 && restoreFile.errorMsg)">
              <span style="float: right"><i :class="formatIcon(restoreFile.state)"></i>{{ operationStateConvert(restoreFile.state) }}</span>
            </el-tooltip>
          </div>
          <el-row>
            <el-col :span="12">
              <el-tooltip :content="`文件备份源路径: ${restoreFile.sourcePath}`"
                          placement="right"
                          :open-delay="300">
                <div :class="$style.wordsOverFlow">
                  <i-icon name="fileSourcePath"
                          :class="$style.restoreFileInfoIcon"></i-icon>
                  <el-tag :class="$style.childFileTag"
                          type="warning"
                          size="mini">
                    <span>{{restoreFile.sourcePath}}</span>
                  </el-tag>
                </div>
              </el-tooltip>
            </el-col>
            <el-col :span="12" :class="$style.restoreFileState">
              <el-tooltip content="已恢复大小"
                          placement="top"
                          :open-delay="300">
                <el-progress :percentage="isNaN(restoreFile.percentage)?0:restoreFile.percentage" :class="$style.restoreFileProgress">
                </el-progress>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-tooltip :content="`恢复集存放路径: ${restoreFile.targetPath}`"
                          placement="right"
                          :open-delay="300">
                <div :class="$style.wordsOverFlow">
                  <i-icon name="fileTargetPath"
                      :class="$style.restoreFileInfoIcon"></i-icon>
                  <el-tag :class="$style.childFileTag"
                          type="warning"
                          size="mini">
                    <span>{{restoreFile.targetPath}}</span>
                  </el-tag>
                </div>
              </el-tooltip>
            </el-col>
            <el-col :span="12"
                    v-if="[1,2,3].includes(restoreFile.state)"
                    :class="$style.restoreFileState">
              <el-tooltip content="开始时间"
                          placement="top"
                          :open-delay="300">
                <span>{{ restoreFile.startTime }}</span>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <i-icon name="size"
                      :class="$style.restoreFileInfoIcon"></i-icon>
              <el-tooltip content="源文件总大小"
                          placement="right"
                          :open-delay="300">
                <span>{{ fmtSize(restoreFile.sourceSize) }}</span>
              </el-tooltip>
            </el-col>
            <el-col :span="12"
                    v-if="[1,2,3].includes(restoreFile.state)"
                    :class="$style.restoreFileState">
              <el-tooltip content="已持续时间"
                          placement="top"
                          :open-delay="300">
                <timer :val="Number(restoreFile.consume)" v-if="restoreFile.state === 1"></timer>
                <span v-else>{{ restoreFile.consume | durationFilter }}</span>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :class="$style.showMore"
            :style="isShow?'':'margin-top: -35px'"
            v-if="restorePlan.restoreType === 1">
      <el-button type="text"
                 @click="showMore">{{showTxt}}<i :class="showIcon"></i></el-button>
    </el-row>
  </el-card>
</template>
<script>
import {
  filehostRestoreStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
  filehostRestoreTypeMapping
} from '@/utils/constant';
import baseMixin from '@/components/mixins/baseMixins';
import Timer from '@/components/Timer';
import IIcon from '@/components/IIcon';
import { fmtSizeFn } from '@/utils/common';
import throttle from 'lodash/throttle';
export default {
  name: 'RestoreCard',
  mixins: [baseMixin],
  props: {
    id: {
      type: Number,
      required: true
    },
    restorePlan: {
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
    operationState() {
      const content = operationStateMapping[this.restorePlan.state];
      if(this.restorePlan.state === 3 && this.restorePlan.errorMsg) {
        return `${content}: ${this.restorePlan.errorMsg}`;
      }
      return content;
    },
    restoreType() {
      return filehostRestoreTypeMapping[this.restorePlan.restoreType];
    },
    operationStateStyle() {
      if (this.restorePlan.state === 0) {
        return this.$style.waitingColor;
      } else if (this.restorePlan.state === 1) {
        return this.$style.loadingColor;
      } else if(this.restorePlan.state === 3) {
        return this.$style.errorColor;
      } else return '';
    },
    progressStatus(){
      if(this.restorePlan.state === 2){
        return 'success';
      }else if(this.restorePlan.state === 3){
        return 'exception';
      }else if(this.restorePlan.state === 0 && this.restorePlan.percentage !== 0){
        return 'success';
      }else return 'text';
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
.restoreCard {
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
.childFileHead {
  color: #888888;
  font-size: 12px;
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
.restoreFileInfoIcon {
  width: 2em;
  display: inline-block;
  vertical-align: -0.2em;
}
.restoreFileProgress > div {
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
.restoreFileState {
  font-size: 0.8em;
  line-height: 1.8em;
  color: #999999;
  text-align: right;
}
</style>

