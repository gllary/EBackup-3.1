<template>
    <section>
      <el-card>
        <!-- <el-tabs v-model="activeName" tab-position="left" :class="$style.tabInfo">
          <el-tab-pane name="personalInfo">
            <span slot="label"><i class="el-icon-date"></i>基本信息</span>
          </el-tab-pane>
          <el-tab-pane name="updatePass">
            <span slot="label"><i class="el-icon-edit-outline"></i>修改密码</span>
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form :model="updatePass"
                         ref="updatePass"
                         :rules="passRules"
                         label-width="110px"
                         size="small"
                         width="400px">
                  <el-form-item label="新密码"
                                prop="newPassword">
                    <el-input type="password"
                              v-model="updatePass.newPassword"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码"
                                prop="checkNewPass">
                    <el-input type="password"
                              v-model="updatePass.checkNewPass"></el-input>
                  </el-form-item>
                  <el-form-item label="原始密码"
                                prop="oldPassword">
                    <el-input type="password"
                              v-model="updatePass.oldPassword"></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="12">
                <el-button type="primary"
                          @click="updatePassword"
                          :loading="btnLoading"
                          size="small">确定</el-button>
                <el-button @click="reset"
                           size="small">重置</el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs> -->
        <el-row :gutter="20">
          <el-col :span="12" :offset="8">
            <el-form label-width="100px">
              <el-form-item label="用户ID" :class="$style.baseInfoItem">
                <span>{{ userInfo.id }}</span>
              </el-form-item>
              <el-form-item label="用户名" :class="$style.baseInfoItem">
                <span>{{ userInfo.userName }}</span>
              </el-form-item>
              <el-form-item label="登录名" :class="$style.baseInfoItem">
                <span>{{ userInfo.loginName }}</span>
              </el-form-item>
              <el-form-item label="邮箱" :class="$style.baseInfoItem" v-if="userInfo.email">
                <span>{{ userInfo.email }}</span>
              </el-form-item>
              <el-form-item label="邮箱接收状态" :class="$style.baseInfoItem" v-if="userInfo.email">
                <span>
                  <i class="el-icon-circle-check" style="color: #67C23A;font-size: 18px" v-if="userInfo.receiveState === 1"></i>
                  <i class="el-icon-remove" style="color: #909399;font-size: 18px" v-else></i>
                </span>
              </el-form-item>
              <el-form-item label="角色" :class="$style.baseInfoItem">
                <span v-for="(role, index) in userInfo.roles"
                      :key="index">{{ role.name }}</span>
              </el-form-item>
              <el-form-item label="状态" :class="$style.baseInfoItem">
                <el-tag :type="userInfo.state === 1 ? '' : 'danger'"
                      size="small">{{ userInfo.state==1?'启用':'禁用' }}</el-tag>
              </el-form-item>
            </el-form>
          </el-col>
          <!-- <el-col :span="8">
            <el-form inline size="small">
              <el-form-item style="float: right;">
                <el-button type="primary"
                            @click="update">修改</el-button>
              </el-form-item>
            </el-form>
          </el-col> -->
        </el-row>
      </el-card>
      <el-dialog title="修改信息"
                :visible.sync = "dialogVisible"
                :before-close = "beforeModalClose"
                @close="modalClosed">
          <el-form ref="updateForm"
                   status-icon
                   :model="form"
                   :rules="rules"
                   label-width="110px"
                   size="small">
            <el-form-item label="用户名"
                          prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="登录名"
                          prop="loginName">
              <el-input v-model="form.loginName" disabled></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="receiveState">
                  <el-checkbox v-model="form.receiveState"
                               :true-label="1"
                               :false-label="0">接收</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="角色">
                  <el-select v-model="form.roles" multiple collapse-tags placeholder="请选择" disabled>
                    <el-option v-for="(item, index) in form.roles"
                              :key="index"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态">
                  <el-radio-group v-model="form.state" disabled>
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="密码"
                          prop="oldPassword">
              <el-input type="password"
                        v-model="form.oldPassword"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button type="primary"
                       @click="submitForm"
                       :loading="btnLoading">确定</el-button>
            <el-button @click="cancelButtonClick">取消</el-button>
          </span>
        </el-dialog>
      </section>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import isEqual from 'lodash/isEqual';

const basePass = {
  newPassword: '',
  checkNewPass: '',
  oldPassword: ''
}

export default {
  name: 'Profile',
  data() {
    const validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.updatePass.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if(!value && this.form.receiveState) {
        callback(new Error('请输入邮箱地址!'));
      } else {
        callback();
      }
    }
    return {
      activeName: 'personalInfo',
      dialogVisible: false,
      btnLoading: false,
      form: {},
      originFormData: {},
      updatePass: Object.assign({}, basePass),
      rules: {
        userName: [
          {
            required: true,
            message: '请输入新用户名',
            trigger: 'blur'
          }, {
              pattern: /^[0-9a-zA-Z\u4E00-\u9FA5]+$/,
              message: '只支持数字、大小写字母和中文字符'
          }, {
              min: 2,
              max: 8,
              message: '长度在 2 到 8 个字符'
          }
        ],
        oldPassword: [
          {
            required: true,
            message: '请输入原始密码',
            trigger: 'blur'
          },
        ],
        email: [{
          validator: validateEmail,
          trigger: 'blur'
        }, {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change']
        }]
      },
      passRules: {
        oldPassword: [
          {
            required: true,
            message: '请输入原始密码',
            trigger: 'blur'
          },
        ],
        newPassword: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }, {
            min: 6,
            max: 30,
            message: '长度在 6 到 30 个字符'
          }, {
            pattern: '^[^\\s]*$',
            message: '不能包含空格'
          }
        ],
        checkNewPass: [
          {
            validator: validateNewPass,
            trigger: 'blur'
          }, {
            required: true,
            message: '请确认新密码',
          }
        ],
      }
    };
  },
  methods: {
    update(){
      if(this.userInfo.state==0)
        this.$message({
          showClose: true,
          message: '禁用状态无法修改',
          center: true,
          type: 'error'
        });
      else{
        this.dialogVisible = true;
        this.form = Object.assign({}, this.userInfo);
        this.originFormData = Object.assign({}, this.form);
      }
    },
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
    },
    cancelButtonClick() {
      this.hasModifiedBeforeClose(() => {
        this.dialogVisible = false;
      });
    },
    hasModifiedBeforeClose(fn) {
      if (isEqual(this.form, this.originFormData)) {
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
      this.$refs.updateForm.resetFields();
    },
    submitForm() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.btnLoading=true;
          this.updateInfo({
            userName: this.form.userName,
            email: this.form.email,
            receiveState: this.form.receiveState,
            oldPassword: this.form.oldPassword
          })
            .then(res => {
              this.dialogVisible = false;
              this.$message.success(res.data.message);
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              this.btnLoading=false;
            });
        } else {
          return false;
        }
      });
    },
    updatePassword() {
      this.$refs.updatePass.validate(valid => {
        if (valid) {
          this.btnLoading=true;
          const {
            checkNewPass,
            ...passwords
          } = this.updatePass
          this.updateInfo(passwords)
            .then(res => {
              this.$refs.updatePass.resetFields();
              this.$message.success(res.data.message);
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              this.btnLoading=false;
            });
        } else {
          return false;
        }
      });
    },
    reset() {
      this.updatePass = Object.assign({}, this.basePass);
      this.$refs.updatePass.resetFields();
    },
    ...mapActions({
      updateInfo: 'updateUserInfo',
    })
  },
  computed:{
    ...mapState({
      userInfo: state => state.base.userInfo
    })
  }
};
</script>
<style lang="scss" module>
.tabInfo>div:first-child{
  padding: 10px 40px;
}
.baseInfoItem {
    margin-bottom: 0 !important;
}
.baseInfoItem {
  label {
    margin-right: 20px;
  }
}
</style>
