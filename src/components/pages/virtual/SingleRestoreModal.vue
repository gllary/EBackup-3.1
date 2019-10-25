<template>
  <el-dialog custom-class="min-width-dialog"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed"
             :visible.sync="modalVisible">
    <span slot="title">
      执行恢复操作
    </span>
    <el-form size="small"
             label-position="right"
             label-width="100px"
             :model="formData"
             :rules="rules"
             ref="singleRestorePlanForm">
      <el-form-item label="新虚拟机名" v-if="vmType === 2"
                    prop="newName">
        <el-input v-model="formData.newName"></el-input>
      </el-form-item>
      <el-row v-if="[1, 3].includes(vmType)">
         <el-form-item label="恢复主机"
                       prop="serverId">
            <el-select v-model="formData.serverId"
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
        <el-col :span="12"
                v-if="[1, 2].includes(vmType)">
          <el-col :span="21">
            <el-form-item label="恢复磁盘名"
                          prop="diskName">
              <el-select v-model="formData.diskName"
                        :disabled="!hasHostIp"
                        placeholder="请选择恢复磁盘">
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
        <el-col :span="12"
                v-else>
          <el-form-item label="恢复路径"
                        prop="diskName"
                        :rules="{ required: true, message: '请输入恢复路径', trigger: 'blur' }">
            <el-input v-model="formData.diskName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
import dayjs from 'dayjs';
import { restorePlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import validate from '@/utils/validate';
const baseFormData = {
  newName: '',
  serverId: '',
  diskName: '',
};

export default {
  name: 'singleRestorePlanModal',
  mixins: [restorePlanModalMixin],
  props: {
    resultId: {
      type: Number,
      required: true,
    },
    vmType: {
      type: Number,
    },
    serverData: {
      type: Array
    }
  },
  data() {
    return {
      type: 'vm',
      rules: {
        newName: validate.newVmName,
        serverId: validate.selectServer,
        diskName: validate.diskName,
      },
      hasHostIp: false, // 用于虚拟机恢复，根据已选的服务id获取可选的恢复磁盘
      disks: [],
      showLoading: false
    };
  },
  methods: {
    confirmBtnClick() {
      this.$refs.singleRestorePlanForm.validate(valid => {
        if (valid) {
          const name = dayjs().format('YYYYMMDDHHmmss');
          const { serverId, newName, diskName, ...other } = this.formData;
          const config = {
            serverId: !serverId ? this.details.server.id : serverId,
            newName,
            diskName,
            timeStrategy: 1,
            singleTime: '',
            ...other
          };
          this.$emit('confirm', { id: this.resultId, data: { name, config } });
        }
      });
    },
    modalClosed() {
      // this.formData = { ...baseFormData };
      this.$refs.singleRestorePlanForm.clearValidate();
      this.hiddenPassword = true;
      this.disks = [];
      this.hasHostIp = false;
      this.showLoading = false;
    },
    modalOpened() {
      const { vmName } = this.details;
      this.originFormData = Object.assign({}, baseFormData, {
        oldName: vmName,
      });
      this.formData = Object.assign({}, this.originFormData);
    },
  },
};
</script>
<style >
</style>
