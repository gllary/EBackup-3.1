<template>
  <el-dialog custom-class="min-width-dialog"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed"
             :visible.sync="modalVisible"
             title="添加表级恢复计划">
    <el-form size="small"
             label-position="right"
             label-width="100px"
             :model="formData"
             :rules="rules"
             ref="tblRestorePlanForm">
      <el-form-item prop="name"
                    class="is-required"
                    label="计划名称">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item prop="hostInfo"
                    label="恢复设备">
        <el-input v-model="formData.hostInfo"
                  disabled></el-input>
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
      <el-form-item prop="tblName"
                    class="is-required"
                    label="恢复表名">
        <el-input v-model="formData.tblName"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="pDBName"
                        :class="{ 'is-required': formData.isPDB }"
                        label="PDB名">
            <el-input v-model="formData.pDBName"
                      :disabled="!formData.isPDB"
                      placeholder="请选择PDB模式"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="isPDB"
                        label-width="20px">
            <el-checkbox v-model="formData.isPDB">PDB模式</el-checkbox>
          </el-form-item>
        </el-col> 
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="tblUser"
                        class="is-required"
                        label="表用户">
            <el-input v-model="formData.tblUser"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="tblUserPassword"
                        class="is-required"
                        label="表密码">
            <el-input v-model="formData.tblUserPassword"
                      type="password"
                      show-password></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="loginName"
                        class="is-required"
                        label="登录名">
            <el-input v-model="formData.loginName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="password"
                        class="is-required"
                        label="登录密码">
            <el-input v-model="formData.password"
                      type="password"
                      show-password></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="timeStrategy"
                    label="时间策略">
        <el-radio-group v-model="formData.timeStrategy">
          <el-radio :label="1">单次执行</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="恢复至"
                    class="is-required"
                    prop="restoreTimePoint"
                    style="width: 50%">
        <el-date-picker type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="formData.restoreTimePoint"
                        style="width: 100%"></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary"
                 @click="confirmBtnClick"
                 :loading="btnLoading">确定</el-button>
      <el-button @click="cancelButtonClick">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import isEqual from 'lodash/isEqual';
import dayjs from 'dayjs';
import { baseModalMixin } from '@/components/mixins/backupPlanModalMixin';
import { createTableLevelRestorePlan } from '@/api/oracle';
import validate from '@/utils/validate';
const basicFormData = {
  name: '',
  hostIp: '',
  hostId: -1,
  hostInfo: '',
  detailInfo: '',
  dbPort: '',
  tblName: '',
  pDBName: '',
  isPDB: false,
  tblUser: '',
  tblUserPassword: '',
  loginName: '',
  password: '',
  timeStrategy: 1,
  restoreTimePoint: ''
};
export default {
  name: 'TableLevelRestorePlanModal',
  mixins: [baseModalMixin],
  props: {
    details: {
      type: Object
    },
    visible: {
      type: Boolean
    }
  },
  data() {
    const pDBNameValidate = (rule, value, callback) => {
      if (this.formData.isPDB && !value) {
        callback(new Error('请输入PDB名'));
      } else {
        callback();
      }
    };
    const restoreTimePointValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择恢复时间点'));
      } else if (dayjs(value) > dayjs()) {
        callback(new Error('恢复时间点不能晚于当前时间'));
      } else {
        callback();
      }
    }
    return {
      formData: {},
      originFormData: {},
      btnLoading: false,
      rules: {
        name: validate.planName,
        detailInfo: validate.instanceName,
        dbPort: validate.dbPort,
        loginName: validate.dbLoginName,
        password: validate.dbPassword,
        tblUser: [
          { required: true, message: '请输入表用户名', triggle: 'blur' }
        ],
        tblUserPassword: [
          { required: true, message: '请输入表用户密码', triggle: 'blur' }
        ],
        tblName: [
          { required: true, message: '请输入恢复表名', triggle: 'blur' }
        ],
        restoreTimePoint: [
          {
            validator: restoreTimePointValidate,
            triggle: 'blur'
          }
        ],
        pDBName: [
          {
            validator: pDBNameValidate,
            triggle: 'blur'
          }
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
    }
  },
  methods: {
    modalOpened() {
      this.formData = Object.assign(
        {},
        basicFormData,
        {
          hostIp: this.details.host.hostIp,
          hostId: this.details.host.id,
          hostInfo: `${this.details.host.hostIp}(${this.details.host.name})`,
          detailInfo: this.details.instanceName,
          dbPort: this.details.dbPort
        }
      );
      this.originFormData = Object.assign({}, this.formData);
      this.$nextTick(() => {
        this.$refs.tblRestorePlanForm.clearValidate();
      });
    },
    confirmBtnClick() {
      this.$refs.tblRestorePlanForm.validate(valid => {
        if (valid) {
          const { name, hostInfo, isPDB, ...config } = this.formData;
          this.btnLoading = true;
          createTableLevelRestorePlan(this.details.id, { name, config: { ...config  } })
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
              this.btnLoading = false;
            })
        } else {
          return false;
        }
      })
    },
    modalClosed() {
      this.formData = Object.assign({}, basicFormData);
      this.originFormData = Object.assign({}, basicFormData);
    }
  }
}
</script>
