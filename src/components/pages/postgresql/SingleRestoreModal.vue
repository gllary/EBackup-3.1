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
             label-width="120px"
             :model="formData"
             :rules="rules"
             ref="singleRestorePlanForm">
        <el-form-item label="恢复设备"
                      prop="hostIp">
          <span slot="label">恢复设备
              <el-tooltip placement="top" 
                          content="易备环境设备" >
                  <i class="el-icon-info"></i>
              </el-tooltip >
          </span>  
          <el-select v-model="formData.hostIp"
                      style="width: 100%;">
            <el-option v-for="host in availableHostsForRestore"
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
													prop="detailInfo">
							<el-input v-model="formData.detailInfo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="端口号"
													prop="dbPort">
							<el-input v-model.number="formData.dbPort"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
        
				<el-row>
					<el-col :span="12">
						<el-form-item label="数据库登录名"
													prop="loginName">
							<el-input v-model="formData.loginName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="登录密码"
													prop="password">
							<input-toggle v-model="formData.password"
														:hidden.sync="hiddenPassword"></input-toggle>
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
  hostIp: '',
  detailInfo: '',
  dbPort: '',
  loginName: '',
  password: '',
};

export default {
  name: 'singleRestorePlanModal',
  mixins: [restorePlanModalMixin],
  props: {
    resultId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      type: 'postgresql',
      formData: Object.assign({}, baseFormData), // 备份数据
      originFormData: Object.assign({}, baseFormData), // 原始数据
      rules: {
        hostIp: validate.selectHost,
        detailInfo: validate.dbName,
        dbPort: validate.dbPort,
        loginName: validate.dbLoginName,
        password: validate.dbPassword,
      },
    };
  },
  methods: {
    confirmBtnClick() {
      this.$refs.singleRestorePlanForm.validate(valid => {
        if (valid) {
          const name = dayjs().format('YYYYMMDDHHmmss');
          const config = { ...this.formData, timeStrategy: 1, singleTime: '' };
          this.$emit('confirm', { id: this.resultId, data: { name, config } });
        }
      });
    },
    modalClosed() {
      this.formData = { ...baseFormData };
      this.$refs.singleRestorePlanForm.clearValidate();
      this.hiddenPassword = true;
    },
    modalOpened() {
      const {instanceName, dbPort} = this.details;
      this.originFormData = Object.assign({}, baseFormData, {detailInfo: instanceName, dbPort});
      this.formData = Object.assign({}, this.originFormData);
    }
  },
};
</script>
<style >
</style>
