<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @open="modalOpen"
               @close="modalClosed">
      <span slot="title">
        {{ title }}
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="form"
               size="small">
        <el-form-item label="主机名"
                      prop="hostName"
                      v-if="action === 'update'">
          <el-input v-model="formData.hostName"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="别名"
                      prop="hostAlias">
          <el-input v-model="formData.hostAlias"></el-input>
        </el-form-item>
        <el-form-item label="主机IP"
                      prop="hostIp">
          <el-input v-model="formData.hostIp"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作系统"
                          prop="osName">
              <el-select v-model="formData.osName"
                        placeholder="请选择">
                <el-option v-for="item in ['Windows', 'Linux']"
                          :key="item.value"
                          :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统版本"
                          prop="systemVersion">
              <el-input v-model="formData.systemVersion"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="所属业务系统"
                      prop="application">
          <el-input v-model="formData.application"></el-input>
        </el-form-item>
        <el-form-item label="服务器登录名"
                      prop="loginName">
          <el-input v-model="formData.loginName"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" v-if="action === 'create'"
                      prop="password">
          <input-toggle v-model="formData.password"
                        :hidden.sync="hiddenPassword"></input-toggle>
        </el-form-item>
        <el-row v-if="action === 'update'">
          <el-col :span="12">
            <el-form-item label="登录密码"
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
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading">确定</el-button>
        <el-button @click="cancelButtonClick">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import validate from '@/utils/validate';
import { baseModalMixin } from '@/components/mixins/backupPlanModalMixin';
const rules = {
  hostName: validate.hostName,
  hostIp: validate.hostIp,
  osName: validate.osName,
  application: validate.application,
  loginName: validate.fileLoginName,
  password: validate.filePassword
};
export default {
  name: 'DatabaseModal',
  mixins: [baseModalMixin],
  props: {
    btnLoading: {
      type: Boolean
    },
    data: {
      type: Object
    },
    action: {
      type: String
    },
    visible: {
      type: Boolean
    }
  },
  data() {
    const validateCheckPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else {
        if (value !== this.formData.password) {
          callback(new Error('两次输入的密码不一致'));
        }
        callback();
      }
    };
    return {
      type: 'filehost',
      rules: rules,
      hiddenPassword: true,
      hiddenPassword1: true,
      baseData: {
        hostName: '',
        hostIp: '',
        hostAlias: '',
        systemVersion: '',
        osName: '',
        application: '',
        loginName: '',
        password: ''
      },
      validateCheckPassword
    };
  },
  computed: {
    title() {
      if (this.action === 'update') {
        return '更新服务器';
      } else if (this.action === 'query') {
        return '查看服务器';
      }
      return '添加服务器';
    },
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
    // 点击确认按钮触发
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { hostName, ...other } = this.formData;
          this.$emit('confirm', other, this.action);
        } else {
          return false;
        }
      });
    },
    modalOpen(){
      if(this.action === 'update'){
        this.originFormData = Object.assign({},this.baseData, this.data);
      }else{
        this.originFormData = {...this.baseData};
      }
      // 暂时清空密码，等后台删除密码返回后可删除此行
      this.originFormData.password = '';
      this.formData = {...this.originFormData}
    },
    modalClosed() {
      this.$refs.form.clearValidate();
      this.hiddenPassword = true;
      this.hiddenPassword1 = true;
    },
  },
  components: {
    InputToggle,
  },
}
</script>
