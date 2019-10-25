<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
							 @open="modalOpened"
               @close="modalClosed">
      <span slot="title">
				{{title}}
				<!-- <span style="color: #999999" v-if="action === 'update' || action === 'query'"> (ID: {{backupPlan.id}})</span> -->
      </span>
      <el-form :model="formData"
               label-width="110px"
               ref="createForm"
							 :disabled="action === 'query'"
               :rules="rules"
               size="small">
        <el-form-item label="备份计划名称" 
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="备份策略" class="is-required"
                      prop="backupStrategy">
					<el-radio-group v-model="formData.backupStrategy"
                          @change="backupStrategyChange">
						<el-radio :label="1">全备+增备</el-radio>
						<el-radio :label="3">CDP持续备份</el-radio>
          </el-radio-group>
        </el-form-item>
				
				<!-- 时间策略 -->
				<time-strategy :form-data="formData" :type="type" ref="timeStrategyComponent"></time-strategy>
        <el-form-item label="备份粒度"
                      class="is-required"
                      prop="backupGranularity"
                      v-if="formData.backupStrategy === 3">
          <el-select v-model="formData.backupGranularity"
                     style="width: 60%;">
            <el-option v-for="minute in Array.from(new Array(12), (val, index) => String((index + 1) * 5))"
                       :key="minute"
                       :value="Number(minute)"
                       :label="minute + '分钟'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" v-if="action !== 'query'"
                   :loading="btnLoading"
                   @click="confirmBtnClick">确定</el-button>
        <el-button @click="cancelButtonClick">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import dayjs from 'dayjs';
import isEqual from 'lodash/isEqual';
import { backupPlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import TimeStrategy from '@/components/common/TimeStrategy';
import cloneDeep from 'lodash/cloneDeep';
import validate from '@/utils/validate';
const basicFormData = {
  name: '',
  startTime: '',
  singleTime: '',
  datePoints: [],
  timePoints: [{ value: '00:00', key: Date.now() }],
  weekPoints: [], // 必须初始化为数组，checkbox group才能识别
  hourInterval: 1,
  minuteInterval: 10,
  backupStrategy: 1,
  timeStrategy: 0,
  backupGranularity: ''
};
export default {
  name: 'BackupPlanCreateModal',
  mixins: [backupPlanModalMixin],
  props: {
    hasCDBBackupPlan: {
      type: Boolean
    }
  },
  components: {
    TimeStrategy,
  },
  data() {
    return {
      type: 'oracle',
      rules: {
        name: validate.planName,
      },
      backupConfig: {},
    };
  },
  methods: {
    // 切换备份策略时 同时更新时间策略为第一个可用值
    backupStrategyChange(label) {
      if (label === 3 && this.hasCDBBackupPlan) {
        this.formData.backupStrategy = 1;
        this.$message.warning('已存在CDP连续备份计划');
      } else {
        this.formData.timeStrategy = label === 1 ? 0 : 3;
      }
    },
    confirmBtnClick() {
      this.$refs.createForm.validate(valid => {
        this.$refs.timeStrategyComponent
          .validate()
          .then(res => {
            if (valid && res) {
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
    fmtData(backupData) {
      // 当备份策略时间点为空时（非按天、周、月）需要初始化才会显示
      if (backupData.config.timePoints.length === 0) {
        backupData.config.timePoints.push({ value: '00:00', key: Date.now() });
      }
      const { name, config, ...other } = backupData;
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
        minuteInterval,
        hourInterval,
        timePoints: cloneDeep(timePoints),
        ...otherConfig,
        // ...other
      };
    },
    modalOpened() {
      // timePoints会被改变，暂不知原因，待分析
      const baseFormData = cloneDeep(basicFormData)
      if (this.action === 'update' || this.action === 'query') {
        this.originFormData = Object.assign({}, baseFormData, this.fmtData({ ...this.backupPlan }));
      } else {
        this.originFormData = Object.assign({}, baseFormData);
      }
      this.formData = Object.assign({}, this.originFormData);
    },
    modalClosed() {
      // this.formData = { ...baseFormData };
      this.$refs.timeStrategyComponent.clearValidate();
      this.$refs.createForm.clearValidate();
    },
  },
};
</script>
<style>
</style>
