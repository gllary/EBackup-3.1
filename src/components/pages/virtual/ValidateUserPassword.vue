<template>
  <el-dialog custom-class="min-width-dialog"
             :before-close="beforeModalClose"
             :visible.sync="modalVisible"
             title="物理主机身份验证"
             @close="modalClosed"
             @open="dialogOpen">
    <el-row>
      <el-col :span="16" :offset="2">
        <el-form size="small"
                :model="formData"
                ref="userInfoForm"
                :rules="userRules"
                label-width="80px"
                label-position="left">
          <el-form-item label="用户名"
                        prop="serverLoginName">
            <el-input v-model="formData.serverLoginName"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="serverPassword">
            <el-input v-model="formData.serverPassword"
                      type="password"
                      show-password></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button @click="cancelButtonClick">取消</el-button>
      <el-button type="primary"
                 :loading="btnLoading"
                 @click="confirmBtn">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validatePassword } from '@/api/virtuals';
import isEqual from 'lodash/isEqual';
const baseFormData = {
  serverLoginName: '',
  serverPassword: ''
}
const userRules = {
  serverLoginName: [
    { required: true, message: '请输入登录名', triggle: 'blur' }
  ],
  serverPassword: [
    { required: true, message: '请输入密码名', triggle: 'blur' }
  ],
};
export default {
  name: 'ValidateUserPassword',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    id: {
      type: Number,
      required: true,
      default: -1
    }
  },
  data() {
    return {
      btnLoading: false,
      userRules,
      formData: Object.assign({}, baseFormData),
      originFormData: Object.assign({}, baseFormData),
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', false);
        }
      }
    },
  },
  methods: {
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
    },
    cancelButtonClick() {
      this.hasModifiedBeforeClose(() => {
        this.modalVisible = false;
      });
    },
    hasModifiedBeforeClose(fn) {
      if (isEqual(this.formData, this.originFormData)) {
        fn();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            fn();
          })
          .catch(() => {});
      }
    },
    modalClosed() {
      this.modalVisible = false;
      this.formData = Object.assign({}, baseFormData);
    },
    confirmBtn() {
      this.$refs.userInfoForm.validate(valid => {
        if (valid) {
          this.btnLoading = true;
          validatePassword(this.id, this.formData)
            .then(res => {
              const { message } = res.data;
              this.btnLoading = false;
              this.modalVisible = false;
              this.$emit('refresh');
              this.$message.success(message);
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
    dialogOpen() {
      this.$nextTick(() => {
        this.$refs.userInfoForm.clearValidate();
      })
    }
  }
}
</script>
