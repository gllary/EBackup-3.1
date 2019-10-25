<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="cancelBtn"
               @open="dialogOpen">
      <el-row v-if="Object.keys(readyToRemoveHostLink).length">
        <el-col :span="6">
          <i-icon name="warning"
                  :class="$style.switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px;overflow: auto;">
            <h4>即将执行以下操作，请检查。</h4>
            <p>
              <span :class="$style.productionEnvColor">
                <i-icon name="production-env"
                        style="vertical-align: -0.3em;"></i-icon>
                {{ '生产环境' }}
              </span>
              <span :class="$style.switchModalName">
                {{ readyToRemoveHostLink.primaryHost.name }}
              </span>
              与
              <span :class="$style.ebackupEnvColor">
                  <i-icon name="ebackup-env"
                          style="vertical-align: -0.3em;"></i-icon>
                  {{ '易备环境' }}
                </span>
                <span :class="$style.switchModalName">
                  {{ readyToRemoveHostLink.viceHost.name }}
              </span>的连接将被取消
            </p>
          </div>
          <el-input type="password"
                    v-model="password"
                    placeholder="请输入用户密码以执行此操作"></el-input>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="cancelBtn">取消</el-button>
        <el-button type="primary"
                   :disabled="confirmBtnDisable"
                   :loading="btnLoading"
                   @click="confirmBtn">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import { validatePassword } from '@/api/user';
export default {
  name: 'RemoveHostLinkModal',
  props: {
    readyToRemoveHostLink: {
      type: Object,
      default: function() {
        return {}
      }
    },
    visible: {
      type: Boolean
    },
    btnLoading: {
      type: Boolean
    }
  },
  components: {
    IIcon
  },
  data() {
    return {
      password: ''
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
    confirmBtnDisable() {
      return !this.password;
    }
  },
  methods: {
    dialogOpen() {
      this.password = '';
    },
    cancelBtn() {
      this.modalVisible = false;
    },
    confirmBtn() {
      validatePassword(this.password)
        .then(() => {
          this.$emit('confirm', this.readyToRemoveHostLink);
        })
        .catch(error => {
          this.$message.error(error);
        });
    }
  }
}
</script>
<style lang="scss" module>
@import '@/style/color.scss';
.switchModalIcon {
  width: 9em;
  height: 9em;
  margin: 25% 25%;
}
.switchModalName {
  display: inline-block;
  width: 8em;
  margin-left: 0.5em;
}
.productionEnvColor {
  color: #31a17b;
}
.ebackupEnvColor {
  color: #c22b76;
}
</style>