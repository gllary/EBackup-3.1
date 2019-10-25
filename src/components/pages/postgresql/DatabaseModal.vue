<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @open="modalOpen"
               @close="modalClosed">
      <span slot="title">
        {{title}}
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="itemCreateForm"
               size="small">
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="formData.name"
                    placeholder="请输入一个标识名称"></el-input>
        </el-form-item>
        <el-form-item label="所属设备"
                      :rules="disabled ? [] : validate.selectHost"
                      prop="hostId">
          <span slot="label">所属设备
              <el-tooltip placement="top" 
                          content="生产环境设备" >
                  <i class="el-icon-info"></i>
              </el-tooltip >
          </span>
          <el-input disabled  v-if="disabled"
                    :value=" formData.host ? `${formData.host.name || ''}(${formData.host.hostIp || ''})` : ''"></el-input>

          <el-select v-model="formData.hostId" v-else
                     style="width: 100%;">
            <el-option v-for="host in availableHosts"
                       :key="host.id"
                       :label="`${host.name}(${host.hostIp})`"
                       :value="host.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实例名"
                      prop="instanceName">
          <el-input v-model="formData.instanceName"
                    placeholder="请输入实例名"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="端口号"
                          prop="dbPort">
              <el-input v-model.number="formData.dbPort"
                        placeholder="请输入端口号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据库版本"
                          prop="dbVersion">
              <el-input v-model="formData.dbVersion"
                        placeholder="可选"></el-input>
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
          <el-col :span="12" v-if="action === 'create'">
            <el-form-item label="数据库密码"
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
        <el-form-item label="所属业务系统"
                      prop="application">
          <el-input v-model="formData.application"
                    placeholder="可选"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading">确定</el-button>
        <el-button @click="cancelButtonClick()">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
// import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { databaseModalMixin } from '@/components/mixins/backupPlanModalMixin';
import validate from '@/utils/validate';
const rules = {
  name: validate.name,
  dbPort: validate.dbPort,
  hostId: validate.selectHost,
  instanceName: validate.dbName,
  loginName: validate.dbLoginName,
  password: validate.dbPassword,
  dbVersion: validate.dbVersion,
  application: validate.application
};
export default {
  name: 'DatabaseModal',
  mixins: [databaseModalMixin],
  props: {
  },
  data() {
    return {
      type: 'postgresql',
      rules: rules,
      validate: validate,
      baseData: {
        name: '',
        hostId: '',
        instanceName: '',
        dbPort: '',
        loginName: '',
        password: '',
        dbVersion: '',
        application: ''
      }
    };
  },
  computed: {
    disabled(){
      if(this.action === 'update'){
        return true;
      }
      return false;
    },
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.itemCreateForm.validate(valid => {
        if (valid) {
          const {
            id,
            instanceName,
            name,
            loginName,
            password,
            hostId,
            dbPort,
            dbVersion,
            application
          } = this.formData;
          this.$emit('confirm', {
            id,
            instanceName,
            name,
            loginName,
            password,
            dbPort,
            dbVersion,
            application,
            // 创建对象 传入host对象 0609
            host: this.availableHosts.find(host => host.id === hostId),
          }, this.action);
        } else {
          return false;
        }
      });
    },
    modalOpen(){
      if(this.action === 'update'){
        this.originFormData = Object.assign({},this.baseData, this.data);
      }else{
        this.originFormData = {...this.baseData}
      }
      // 暂时清空密码，等后台删除密码返回后可删除此行
      this.originFormData.password = '';
      this.formData = {...this.originFormData}
    },
    modalClosed() {
      this.$refs.itemCreateForm.clearValidate();
      this.hiddenPassword = true;
      this.hiddenPassword1 = true;
    },
  },
  components: {
    InputToggle,
  },
};
</script>
<style>
</style>
