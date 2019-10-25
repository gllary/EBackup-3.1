<template>
  <el-dialog custom-class="min-width-dialog"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed"
             :visible.sync="modalVisible">
    <span slot="title">
       {{title}}
    </span>
    <el-form size="small"
             label-position="right"
             label-width="100px"
             :model="formData"
             :rules="rules"
             ref="restorePlanCreateForm">
      <el-row>
        <el-form-item label="计划名称"
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
      </el-row>
      <el-row v-if="vmType === 2">
        <el-col :span="24">
          <el-form-item label="新虚拟机名"
                        prop="newName">
            <el-input v-model="formData.newName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="[1, 3].includes(vmType)">
        <el-form-item label="恢复主机"
                      prop="serverId">
          <el-select v-model="formData.serverId" :disabled="action !== 'create'"
                     @change="changeHost(formData.serverId, [1, 2].includes(vmType))"
                     style="width: 100%;">
            <el-option v-for="(server, index) in serverData"
                       :key="index"
                       :value="server.id"
                       v-if="!(details.server.id === server.id && vmType === 3)"
                       :label="`${server.serverName}(${server.serverIp})`">
              <span style="float: left">{{ server.serverName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ server.serverIp }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row v-if="[1, 3].includes(vmType)">
        <el-col :span="12">
          <el-form-item label="新虚拟机名"
                        prop="newName">
            <el-input v-model="formData.newName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="[1, 2].includes(vmType)">
          <el-col :span="21">
            <el-form-item label="恢复磁盘"
                          prop="diskName">
              <el-select v-model="formData.diskName"
                         :disabled="!hasHostIp"
                         :placeholder="showLoading?'加载中':'请选择恢复磁盘'">
                <el-option v-for="(disk, index) in disks"
                          :key="index"
                          :label="disk"
                          :value="disk"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="text-align: center" v-if="showLoading">
            <el-row>
              <i class="el-icon-loading"></i>
            </el-row>
            <el-row style="font-size: 12px">
              加载中
            </el-row>
          </el-col>
        </el-col>
        <el-col :span="12" v-else>
          <el-form-item label="恢复路径"
                        prop="diskName"
                        :rules="{ required: true, message: '请输入恢复路径', trigger: 'blur' }">
            <el-input v-model="formData.diskName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <time-interval :form-data="formData" :type="type" ref="timeIntervalComponent"></time-interval>
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
// import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { restorePlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import validate from '@/utils/validate';
import TimeInterval from '@/components/common/TimeInterval';

const basiceFormData = {
  name: '',
  serverId: '',
  newName: '',
  // oldName: '',
  diskName: '',
  startTime: '',
  singleTime: '',
  datePoints: [],
  timePoints: [{ value: '00:00', key: Date.now() }],
  weekPoints: [], // 必须初始化为数组，checkbox group才能识别
  timeStrategy: 1, // 默认单次执行
};

export default {
  name: 'RestorePlanCreateModal',
  mixins: [restorePlanModalMixin],
  components: {
    TimeInterval,
  },
  props: {
    vmType: {
      type: Number
    },
    serverData: {
      type: Array
    }
  },
  data() {
    return {
      type: 'vm',
      rules: {
        name: validate.planName,
        serverId: validate.selectServer,
        newName: validate.newVmName,
        diskName: validate.diskName,
      },
      hasHostIp: false, // 用于虚拟机恢复，根据已选的hostId获取可选的恢复磁盘
      disks: [],
      showLoading: false
    };
  },
  methods: {
    confirmBtnClick() {
      this.$refs.restorePlanCreateForm.validate(valid => {
        this.$refs.timeIntervalComponent
          .validate()
          .then(res => {
            if (valid && res) {
              let data = this.pruneFormData(this.formData);
              if (this.action === 'update') {
                data.id = this.restorePlan.id;
                data.config.id = this.restorePlan.config.id;
              }
              if (!data.config.serverId) {
                data.config.serverId = this.details.server.id;
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
    fmtData(plan) {
      if (plan.config.timePoints.length === 0) {
        plan.config.timePoints.push({ value: '00:00', key: Date.now() });
      }
      const { name, config, ...other } = plan;
      const { id, startTime, timePoints, timeStrategy, ...otherConfig } = config;
      return {
        name,
        startTime: timeStrategy === 1 ? '' : startTime,
        timePoints: cloneDeep(timePoints),
        timeStrategy,
        ...otherConfig,
      };
    },
    modalOpened() {
      const baseFormData = cloneDeep(basiceFormData);
      if (this.action === 'update' || this.action === 'query') {
        this.originFormData = Object.assign(
          {},
          baseFormData,
          this.fmtData({ ...this.restorePlan })
        );
      } else {
        const {vmName} = this.details;
        this.originFormData = Object.assign({}, baseFormData, {oldName: vmName});
      }
      this.formData = Object.assign({}, this.originFormData);
    },
    modalClosed() {
      // this.formData = { ...baseFormData };
      this.$refs.timeIntervalComponent.clearValidate();
      this.$refs.restorePlanCreateForm.clearValidate();
      this.hiddenPassword = true;
      this.disks = [];
      this.hasHostIp = false;
      this.showLoading = false;
    },
  },
};
</script>
<style >
</style>
