<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
							 @open="modalOpened"
               @close="modalClosed">
      <span slot="title">
				{{ title }}
				<span style="color: #999999" v-if="action === 'update' || action === 'query'"> (ID: {{backupPlan.id}})</span>
      </span>
      <el-form :model="formData"
               label-width="110px"
               ref="form"
							 :disabled="action === 'query'"
               :rules="rules"
               size="small">
        <el-form-item label="备份计划名称"
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="备份类型"
                      prop="backupType">
          <el-radio-group v-model="formData.backupType"
                          @change="backupTypeChange">
            <el-radio v-for="type in backupTypeSelect"
                      :key="type.label"
                      :label="type.label">
              {{ type.text }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备份文件"
                      prop="backupFiles"
                      v-if="formData.backupType === 1">
          <el-button type="primary"
                     size="small"
                     @click="selectBackupFiles">+选择文件</el-button>
          <span v-if="!backupFilesSet.backupFiles.length"
                style="color: #f56c6c; font-size: 12px">
            <i class="el-icon-warning"></i>未选择文件
          </span>
          <el-popover placement="right"
                      width="400"
                      trigger="hover"
                      v-else>
            <div style="max-height: 400px; overflow: auto;">
              <p v-for="path in backupFilesSet.backupFiles"
                :key="path"
                style="margin-top: 0; margin-bottom: 5px">
                <el-tag closable
                        size="small"
                        :class="$style.fileTags"
                        @close="delSelectedFile(path)">
                  <span>{{ path }}</span>
                </el-tag>
              </p>
            </div>
            <span style="color: #409EFF; font-size: 12px; cursor: pointer"
                  slot="reference">
              <i class="el-icon-question"></i>查看已选文件
            </span>
          </el-popover>
        </el-form-item>
        <el-form-item label="备份排除文件"
                      v-if="formData.backupType === 1">
          <el-tag :key="tag.id"
                  :class="$style.tags"
                  type="danger"
                  v-for="tag in formData.excludeFiles"
                  closable
                  @close="handleClose(tag)">{{tag}}</el-tag>
          <el-input v-if="inputTagVisible"
                    :class="$style.buttonNewTag"
                    ref="saveTagInput"
                    v-model="tagInputValue"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"></el-input>
          <el-button v-else @click="showInputTag">+ 排除文件</el-button>
        </el-form-item>
        <el-form-item label="备份卷"
                      v-if="formData.backupType === 2">
          <el-radio-group v-model="backupFilesSet.volume">
            <el-radio v-for="(volume, index) in volumes"
                      :key="index"
                      :label="volume">
              {{ volume }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备份系统"
                      v-if="formData.backupType === 3">
          <el-radio-group v-model="backupFilesSet.system">
            <el-radio :label="systems">{{ systems }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row v-if="formData.backupType === 1">
          <el-col :span="12">
            <el-form-item label="限速"
                          prop="bwlimit">
              <el-select v-model="formData.bwlimit"
                         clearable
                         placeholder="请选限速值">
                <el-option v-for="(item, index) in [1, 2, 4, 10, 20, 50, 100, 200, 500, 800]"
                           :key="index"
                           :label="item"
                           :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位"
                          prop="unit">
              <el-select v-model="formData.unit"
                         clearable
                         placeholder="请选单位">
                <el-option v-for="(item, index) in ['Kbps', 'Mbps', 'Gbps']"
                           :key="index"
                           :label="item"
                           :value="index"></el-option>
              </el-select>            
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备份策略"
                      class="is-required"
                      prop="backupStrategy">
					<el-radio-group v-model="formData.backupStrategy">
						<el-radio v-for="(backupStrategy, index) in backupStrategySelect"
                      :key="index"
                      :label="backupStrategy.label"
                      v-if="formData.backupType === 1">
              {{ backupStrategy.text }}
            </el-radio>
            <el-radio v-if="formData.backupType !== 1"
                      :label="backupStrategySelect[0].label">{{ backupStrategySelect[0].text }}</el-radio>
          </el-radio-group>
        </el-form-item>
				<!-- 时间策略 -->
				<time-strategy :form-data="formData" :type="type" ref="timeStrategyComponent"></time-strategy>
      </el-form>
      <span slot="footer">
        <el-button type="primary" v-if="action !== 'query'"
                   :loading="btnLoading"
                   @click="confirmBtnClick">确定</el-button>
        <el-button @click="cancelButtonClick">取消</el-button>
      </span>
    </el-dialog>
    <backup-file-tree :visible.sync="fileTreeVisible"
                      :host-id="hostId"
                      :nodes="backupFilesSet.backupFiles"
                      :fatherNodes="filePath"
                      @selectNodes="selectNodes"></backup-file-tree>
  </section>
</template>
<script>
import { backupPlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import TimeStrategy from '@/components/common/TimeStrategy';
import BackupFileTree from '@/components/pages/file/BackupFileTree';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import validate from '@/utils/validate';
import {
  filehostBackupStrategyMapping,
  filehostBackupTypeMapping
} from '@/utils/constant';
import { backupStrategyMapping } from '../../../utils/constant';
import { fmtSizeFn } from '@/utils/common';
const basicFormData = {
  name: '',
  backupType: 1,
  backupFiles: [],
  excludeFiles: [],
  bwlimit: null,
  unit: null, // 限速单位
  startTime: '',
  singleTime: '',
  datePoints: [],
  timePoints: [{ value: '00:00', key: Date.now() }],
  weekPoints: [], // 必须初始化为数组，checkbox group才能识别
  hourInterval: 1,
  minuteInterval: 10,
  backupStrategy: 1,
  timeStrategy: 0,
}
export default {
  name: 'BackupPlanModal',
  mixins: [backupPlanModalMixin],
  props: {
    btnLoading: {
      type: Boolean
    },
    type: {
      type: String
    },
    visible: {
      type: Boolean
    },
    action: {
      type: String
    },
    backupPlan: {
      type: Object
    },
    systems: {
      type: String,
      default: function() {
        return '';
      }
    },
    volumes: {
      type: Array,
      default: function() {
        return [];
      }
    },
    filePath: {
      type: Array,
      default: function() {
        return [];
      }
    },
    hostId: {
      type: Number
    }
  },
  data() {
    const backupFilesValidate = (rule, value, callback) => {
      if(!this.backupFilesSet.backupFiles.length && this.formData.backupType === 1) {
        this.$message.warning('请选择备份源文件!');
      } else {
        callback();
      }
    }
    const unitValidate = (rule, value, callback) => {
      if(this.formData.bwlimit && value !== 0 && !value) {
        callback('请选择限速单位');
      } else {
        callback();
      }
    }
    return {
      formData: {},
      originFormData: {},
      backupFilesSet: {},
      fileTreeVisible: false,
      tagInputValue: null, // 备份排除文件
      inputTagVisible: false,
      backupDriver: null,
      rules: {
        name: validate.planName,
        backupFiles: {
          validator: backupFilesValidate,
          trigger: ['blur']
        },
        unit: {
          validator: unitValidate,
          trigger: ['blur']
        }
      }
    }
  },
  computed: {
    title() {
      if (this.action === 'update') {
        return '更新备份计划';
      } else if (this.action === 'query') {
        return '查看备份计划';
      }
      return '添加备份计划';
    },
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      }
    },
    backupTypeSelect() {
      if(this.type === 'windows') {
        return Object.keys(filehostBackupTypeMapping).map(backupType => {
          return {
            label: Number(backupType),
            text: filehostBackupTypeMapping[backupType]
          }
        })
      } else if (this.type === 'linux') {
        return [{
          label: 1,
          text: '文件备份'
        }]
      }
    },
    backupStrategySelect() {
      return Object.keys(filehostBackupStrategyMapping).map(backupStrategy=> {
          return {
            label: Number(backupStrategy),
            text: filehostBackupStrategyMapping[backupStrategy]
          }
      })
    }
  },
  methods: {
    fmtData(backupData) {
      // 当备份策略时间点为空时（非按天、周、月）需要初始化才会显示
      if (backupData.config.timePoints.length === 0) {
        backupData.config.timePoints.push({ value: '00:00', key: Date.now() });
      }
      const { name, config, backupType, bwlimit, backupFiles, excludeFiles, ...other} = backupData;
      const { id, timeInterval, timePoints, ...otherConfig } = config;
      let hourInterval = 1,
          minuteInterval = 10;
      if (otherConfig.timeStrategy === 1) {
        minuteInterval = timeInterval;
      } else if (otherConfig.timeStrategy === 2) {
        hourInterval = Math.round(timeInterval / 60);
      }
      return {
        name,
        backupType,
        bwlimit,
        backupFiles: backupFiles.map(file => file.sourcePath),
        excludeFiles,
        minuteInterval,
        hourInterval,
        timePoints: cloneDeep(timePoints),
        ...otherConfig,
      };
    },
    handleClose(tag) {
      this.formData.excludeFiles.splice(this.formData.excludeFiles.indexOf(tag), 1);
    },
    delSelectedFile(path) {
      this.backupFilesSet.backupFiles.splice(this.backupFilesSet.backupFiles.indexOf(path), 1);
    },
    showInputTag() {
      this.inputTagVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    handleInputConfirm() {
      let tagInputValue = this.tagInputValue;
      if(tagInputValue) {
        this.formData.excludeFiles.push(tagInputValue);
      }
      this.inputTagVisible = false;
      this.tagInputValue = '';
    },
    selectNodes(nodes) {
      this.backupFilesSet.backupFiles = nodes.concat();
    },
    selectBackupFiles() {
      this.fileTreeVisible = true;
    },
    pruneFormData(formData) {
      const {
        name,
        backupType,
        bwlimit,
        unit,
        excludeFiles,
        backupFiles,
        timeStrategy,
        singleTime,
        startTime,
        datePoints,
        weekPoints,
        timePoints,
        hourInterval,
        minuteInterval,
        ...other
      } = formData;
      let config;
      switch (timeStrategy) {
        case 0:
          config = { timeStrategy, singleTime, ...other };
          break;
        case 1:
          config = {
            timeStrategy,
            startTime,
            timeInterval: minuteInterval,
            ...other,
          };
          break;
        case 2:
          config = {
            timeStrategy,
            startTime,
            timeInterval: hourInterval * 60,
            ...other,
          };
          break;
        case 3:
          config = { timeStrategy, startTime, timePoints, ...other };
          break;
        case 4:
          config = {
            timeStrategy,
            startTime,
            weekPoints,
            timePoints,
            ...other,
          };
          break;
        case 5:
          config = {
            timeStrategy,
            startTime,
            datePoints,
            timePoints,
            ...other,
          };
          break;
        case 6:
          config = {
            timeStrategy,
            ...other
          };
          break;
        default:
      }
      if ([3, 4, 5].includes(timeStrategy)) {
        config.timePoints = this.filteredTimePoints(timePoints);
        // 全备+增备下按星期重排
        if (timeStrategy === 4) {
          config.weekPoints.sort((a, b) => a - b);
        }
      }
      return {
        name,
        backupType,
        bwlimit: bwlimit*Math.pow(1024, unit),
        excludeFiles,
        backupFiles,
        config
      };
    },
    confirmBtnClick() {
      this.$refs.form.validate(valid => {
        this.$refs.timeStrategyComponent
          .validate()
          .then(res => {
            if (valid && res) {
              this.assignBackupFiles();
              let data = this.pruneFormData(this.formData);
              if (this.action === 'update') {
                data.id = this.backupPlan.id;
                data.config.id = this.backupPlan.config.id;
              }
              this.$emit('confirm', data, this.action);
            }
          })
          .catch(error => {
            if (error && valid) {
              this.$message.error(error);
            }
          });
      });
    },
    cancelButtonClick() {
      this.hasModifiedBeforeClose(() => {
        this.modalVisible = false;
      });
    },
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
    },
    assignBackupFiles() {
      if(this.formData.backupType === 1) {
        this.formData.backupFiles = this.backupFilesSet.backupFiles.slice();
      } else if(this.formData.backupType === 2) {
        this.formData.backupFiles = [this.backupFilesSet.volume];
      } else {
        this.formData.backupFiles = [this.backupFilesSet.system];
      }
    },
    backupTypeChange() {
      this.formData.backupStrategy = 1;
    },
    hasModifiedBeforeClose(fn) {
      this.assignBackupFiles();
      if (isEqual(this.formData, this.originFormData)) {
        fn();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            fn();
          })
          .catch(() => { });
      }
    },
    modalOpened() {
      const baseFormData = cloneDeep(basicFormData);
      if (this.action === 'update' || this.action === 'query') {
        this.originFormData = Object.assign({}, baseFormData, this.fmtData({ ...cloneDeep(this.backupPlan) }));
        const fmtResult = parseFloat(fmtSizeFn(this.originFormData.bwlimit*1024));
        this.originFormData.unit = fmtResult ? Math.log(this.originFormData.bwlimit/fmtResult)/Math.log(1024) : '';
        this.originFormData.bwlimit = fmtResult ? fmtResult : '';
      } else {
        this.originFormData = Object.assign({}, baseFormData);
      }
      const baseBackupFilesSet = {
        backupFiles: [],
        volume: this.volumes[0],
        system: this.systems
      }
      if(this.originFormData.backupType === 1) {
        baseBackupFilesSet.backupFiles = this.originFormData.backupFiles;
      } else if(this.originFormData.backupType === 2) {
        baseBackupFilesSet.volume = this.originFormData.backupFiles[0];
      } else {
        baseBackupFilesSet.system = this.originFormData.backupFiles[0];
      }
      this.formData = Object.assign({}, cloneDeep(this.originFormData));
      this.backupFilesSet = Object.assign({}, baseBackupFilesSet);
    },
    modalClosed() {
      this.$refs.timeStrategyComponent.clearValidate();
      this.$refs.form.clearValidate();
    }
  },
  components: {
    TimeStrategy,
    BackupFileTree
  }
}
</script>
<style lang="scss" module>
.tags {
  margin-right: 8px;
  // max-width: 60px;
  // display: inline-block;
  // white-space:nowrap;
  // overflow: hidden;
  // text-overflow: ellipsis;
}
.fileTags {
  display: inline-block;
  max-width: 380px;
  span {
    max-width: 340px;
    display: inline-block;
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  i {
    vertical-align: 0.4em !important;
  }
  // margin-top: 5px;
}
.buttonNewTag {
  width: 100px;
}
.wordsOverFlow {
  white-space:nowrap;
  overflow: hidden;
  max-width: 100%;
  display: inline-block;
  text-overflow: ellipsis;
}
</style>