<template>
  <section>
    <el-dialog
      title="修改邮箱"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      @open="modalOpened"
      @close="modalClose">
      <el-form :model="formData"
          label-width="110px"
          ref="formData"
          :rules="rules"
          size="small">
        <el-form-item label="服务器名"
                      prop="mailHost">
          <el-input v-model="formData.mailHost"></el-input></el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="协议名"
                          prop="mailTransportProtocol">
              <el-select v-model="formData.mailTransportProtocol"
                        placeholder="请选择">
                <el-option v-for="item in ['SMTP', 'pop3']"
                          :key="item.value"
                          :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口"
                          prop="mailSmtpPort">
              <el-input v-model="formData.mailSmtpPort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态"
                      prop="emailStatus">
          <el-radio v-model="formData.emailStatus" :label="'0'">启用</el-radio>
          <el-radio v-model="formData.emailStatus" :label="'1'">禁用</el-radio>
        </el-form-item>
        <el-form-item label="邮箱登录名"
                      prop="emailLoginName">
          <el-input v-model="formData.emailLoginName"></el-input>
        </el-form-item>
        <el-row>
            <el-col :span="12">
              <el-form-item label="登录密码"
                            prop="emailPassword">
                <input-toggle v-model="formData.emailPassword"
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm" :loading="btnLoading">确 定</el-button>
        <el-button @click="dialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { validateLength } from '../../utils/common';
export default {
  name: 'EmailManagerUpdateModal',
  data() {
    const rules = {
      mailHost: [
        { validator: validateLength(60), triggle: 'blur' },
        { required: true, message: '请输入邮件服务器主机名', triggle: 'blur' }
      ],
      mailTransportProtocol: [
        { required: true, message: '请选择邮件协议', triggle: 'blur' }
      ],
      emailLoginName: [
        { required: true, message: '请输入登录名', triggle: 'blur' },
        { validator: validateLength(100), triggle: 'blur' }
      ],
      emailPassword: [
        { required: true, message: '请输入登录密码', triggle: 'blur' },
        { validator: validateLength(100), triggle: 'blur' }
      ]
    }
    const validateCheckPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else {
        if (value !== this.formData.emailPassword) {
          callback(new Error('两次输入的密码不一致'));
        }
        callback();
      }
    };
    return {
      formData: {},
      originFormData: {},
      rules,
      hiddenPassword: true,
      validateCheckPassword,
      hiddenPassword1: true,
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    btnLoading: {
      type: Boolean,
    },
    emailInfo: {
      type: Object,
      default: {},
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    },
  },
  methods: {
    modalOpened() {
      this.originFormData = { ...this.emailInfo, emailPassword: '' };
      this.formData = { ...this.emailInfo, emailPassword: ''  };
    },
    confirm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          let data = {...this.formData};
          delete data.rPassword;
          this.$emit('confirm', data);
        } else {
          return false;
        }
      });
    },
    handleClose(done) {
      if (!isEqual(this.formData, this.originFormData)) {
        this.$confirm('有未保存的修改，是否退出？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      } else {
        this.dialogVisible = false;
      }
    },
    modalClose() {
      this.$refs.formData.clearValidate();
      this.hiddenPassword = true;
      this.hiddenPassword1 = true;
    },
  },
  components: {
    InputToggle,
  }
}
</script>
