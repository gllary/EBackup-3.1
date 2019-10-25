<template>
  <el-dialog custom-class="min-width-dialog"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed"
             :visible.sync="modalVisible"
             title="添加日志恢复计划">
    <el-form size="small"
             label-position="right"
             label-width="120px"
             :model="formData"
             :rules="rules"
             ref="logRestorePlanForm">
      <el-form-item label="恢复设备"
                    prop="hostIp">
        <span slot="label">恢复设备
            <el-tooltip placement="top"
                        content="易备环境设备" >
                <i class="el-icon-info"></i>
            </el-tooltip>
        </span>
        <el-select v-model="formData.hostIp"
                    style="width: 100%;">
          <el-option v-for="host in availableHostsForRestore.filter(host => !hostInLinks.includes(host.id))"
                      :key="host.id"
                      :value="host.hostIp"
                      :label="`${host.name}(${host.hostIp})`">
            <span style="float: left">{{ host.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ host.hostIp }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12" >
          <el-form-item label="实例名"
                        class="is-required"
                        prop="detailInfo">
            <el-input v-model="formData.detailInfo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="端口号"
                        class="is-required"
                        prop="dbPort">
            <el-input v-model.number="formData.dbPort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="恢复至(日期)"
                        class="is-required"
                        prop="restoreDatePicker">
            <el-date-picker v-model="formData.restoreDatePicker"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                            :picker-options="dateOptions"
                            style="width: 100%"
                            @change="dateChangeHandle"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="is-required"
                        label-position="left"
                        label="恢复至(时间)"
                        prop="restoreTimePicker">
            <el-time-picker v-model="formData.restoreTimePicker"
                            :disabled="!formData.restoreDatePicker"
                            placeholder="选择时间"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            :picker-options="timeOptions"
                            style="width: 100%"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="loginName"
                        class="is-required"
                        label="数据库登录名">
            <el-input v-model="formData.loginName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="password"
                        class="is-required"
                        label="数据库登录密码">
            <el-input v-model="formData.password"
                      type="password"
                      show-password></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button type="primary"
                 @click="confirmBtnClick"
                 :loading.sync="loading">确定</el-button>
      <el-button @click="cancelButtonClick">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import isEqual from 'lodash/isEqual';
import dayjs from 'dayjs';
import { baseModalMixin } from '@/components/mixins/backupPlanModalMixin';
import { restorePlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import { createLogRestorePlan } from '@/api/oracle';
import validate from '@/utils/validate';
const basicFormData = {
  hostIp: '',
  detailInfo: '',
  dbPort: '',
  loginName: '',
  password: '',
  restoreDatePicker: '',
  restoreTimePicker: '',
  restoreTimePoint: ''
};
export default {
  name: 'LogRestorePlanModal',
  mixins: [baseModalMixin, restorePlanModalMixin],
  props: {
    details: {
      type: Object
    },
    visible: {
      type: Boolean
    },
    hostInLinks: {
      type: Array,
      default: []
    },
    endTime: {
      type: String
    }
  },
  data() {
    return {
      type: 'oracle',
      formData: {},
      originFormData: {},
      dateOptions: {},
      timeOptions: {},
      rules: {
        detailInfo: validate.instanceName,
        dbPort: validate.dbPort,
        loginName: validate.dbLoginName,
        password: validate.dbPassword,
        restoreTimePicker: [
          { required: true, message: '请选择恢复时间', triggle: 'blur' }
        ],
        restoreDatePicker: [
          { required: true, message: '请选择恢复日期', triggle: 'blur' }
        ]
      }
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    },
    loading: {
      get() {
        return this.btnLoading;
      },
      set(value) {
        this.$emit('update:btnLoading', value);
      }
    }
  },
  created() {
    this.dateOptions = {
      disabledDate: time => {
        return dayjs(time) > dayjs(this.details.CDBTime) || dayjs(time) < dayjs(this.endTime).subtract(1, 'day');
      }
    }
  },
  methods: {
    modalOpened() {
      this.formData = Object.assign(
        {},
        basicFormData,
        {
          detailInfo: this.details.instanceName,
          dbPort: this.details.dbPort
        }
      );
      this.originFormData = Object.assign({}, this.formData);
      this.$nextTick(() => {
        this.$refs.logRestorePlanForm.clearValidate();
      });
    },
    confirmBtnClick() {
      this.$refs.logRestorePlanForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const name = dayjs().format('YYYYMMDDHHmmss');
          const {
            restoreDatePicker,
            restoreTimePicker,
            restoreTimePoint,
            ...form
          } = this.formData;
          const config = {
            timeStrategy: 1,
            singleTime: '',
            restoreTimePoint: `${restoreDatePicker} ${restoreTimePicker}`,
            ...form
          };
          createLogRestorePlan(this.details.id, { name, config })
            .then(res => {
              const { message } = res.data;
              this.$message.success(message);
              this.modalVisible = false;
              this.$emit('refreshAll');
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              this.loading = false;
            })
        } else {
          return false;
        }
      })
    },
    modalClosed() {
      this.formData = Object.assign({}, basicFormData);
      this.originFormData = Object.assign({}, basicFormData);
    },
    dateChangeHandle(date) {
      this.formData.restoreTimePicker = '';
      const CDBTime = dayjs(this.details.CDBTime).format('HH:mm:ss');
      const endTime = dayjs(this.endTime).format('HH:mm:ss');
      const sameToCDBTime = dayjs(date).isSame(dayjs(this.details.CDBTime).format('YYYY-MM-DD'));
      const sameToEndTime = dayjs(date).isSame(dayjs(this.endTime).format('YYYY-MM-DD'));
      if (sameToCDBTime && sameToEndTime) {
        this.timeOptions = {
          selectableRange: `${endTime} - ${CDBTime}`
        };
      } else if (sameToCDBTime) {
        this.timeOptions = {
          selectableRange: `00:00:00 - ${CDBTime}`
        };
      } else if (sameToEndTime) {
        this.timeOptions = {
          selectableRange: `${endTime} - 23:59:59`
        };
      }
    }
  }
}
</script>
