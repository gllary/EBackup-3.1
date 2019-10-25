<template>
  <el-dialog custom-class="min-width-dialog"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed"
             :visible.sync="modalVisible">
    <span slot="title">
      {{title}}
      <!-- <span style="color: #999999"> (ID: {{restorePlan.id}})</span> -->
    </span>
    <el-form size="small"
             label-position="right"
             label-width="100px"
             :model="formData"
             :rules="rules"
             ref="restorePlanCreateForm">
        <el-form-item label="计划名称"
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="恢复设备"
                      prop="hostIp">
          <span slot="label">恢复设备
              <el-tooltip placement="top" 
                          content="易备环境设备" >
                  <i class="el-icon-info"></i>
              </el-tooltip >
          </span>  
          <!-- <el-input disabled v-if="action !== 'create'"
                      :value="`${formData.hostName}(${formData.hostIp})`"></el-input> -->
          <!-- <el-select v-model="formData.hostIp" v-else -->
          <el-select v-model="formData.hostIp" :disabled="action !== 'create'"
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
													prop="detailInfo">
							<el-input v-model="formData.detailInfo" :disabled="action !== 'create'"></el-input>
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
						<el-form-item label="登录名"
													prop="loginName">
							<el-input v-model="formData.loginName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="action === 'create'">
						<el-form-item label="登录密码"
													prop="password">
							<input-toggle v-model="formData.password"
														:hidden.sync="hiddenPassword"></input-toggle>
						</el-form-item>
					</el-col>
				</el-row>
        <el-row v-if="action === 'update'">
          <el-col :span="12">
            <el-form-item label="数据库密码"
                          prop="password">
              <input-toggle v-model="formData.password"
                            :hidden.sync="hiddenPassword"></input-toggle>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码"
                          class="is-required"
                          :rules="{validator: validateCheckPassword, trigger: ['blur']}"
                          prop="rPassword">
              <input-toggle v-model="formData.rPassword"
                            :hidden.sync="hiddenPassword1"></input-toggle>
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
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { restorePlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import validate from '@/utils/validate';
import TimeInterval from '@/components/common/TimeInterval';

const basicFormData = {
  name: '',
  hostIp: '',
  detailInfo: '',
  dbPort: '',
  loginName: '',
  password: '',
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
  props: {
    hostInLinks: {
      type: Array,
      default: []
    }
  },
  components: {
    TimeInterval,
  },
  data() {
    return {
      type: 'oracle',
      // formData: Object.assign({}, baseFormData), // 备份数据
      // originFormData: Object.assign({}, baseFormData), // 原始数据
      rules: {
        name: validate.planName,
        hostIp: validate.selectHost,
        detailInfo: validate.instanceName,
        dbPort: validate.dbPort,
        loginName: validate.dbLoginName,
        password: validate.dbPassword,
      },
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
      const { id, startTime, timePoints, timeStrategy, database, ...otherConfig } = config;
      // const { instanceName: detailInfo, loginName, host } = database;
      // const { name: hostName, hostIp } = host;
      return {
        name,
        startTime: timeStrategy === 1 ? '' : startTime,
        timePoints: cloneDeep(timePoints),
        timeStrategy,
        // detailInfo,
        // loginName,
        // hostName,
        // hostIp,
        ...otherConfig,
      };
    },
    modalOpened() {
      const baseFormData = cloneDeep(basicFormData);
      if (this.action === 'update' || this.action === 'query') {
        this.originFormData = Object.assign(
          {},
          baseFormData,
          this.fmtData({ ...this.restorePlan })
        );
      } else {
        const {instanceName, dbPort} = this.details;
        this.originFormData = Object.assign({}, baseFormData, {detailInfo: instanceName, dbPort});
      }
      // 暂时清空密码，等后台删除密码返回后可删除此行
      this.originFormData.password = '';
      this.formData = Object.assign({}, this.originFormData);
    },
  },
};
</script>
<style >
</style>
