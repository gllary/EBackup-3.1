<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="cancelBtn"
               @open="modalOpen">
      <el-row v-if="Object.keys(singleSwitchIpMsg).length">
        <el-col :span="6">
          <i-icon name="warning"
                  :class="$style.switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px;overflow: auto;">
            <h4>即将执行以下操作，请检查。</h4>
            <div v-if="osType(singleSwitchIpMsg.viceHost) === 'Windows'">
              <p>
                <i-icon name="ebackup-env"
                        style="vertical-align: -0.3em;"></i-icon>
                <span :class="$style.ebackupEnvColor">易备环境</span>
                <span :class="$style.switchModalName">{{ singleSwitchIpMsg.viceHost.name }}</span>的IP将由
              </p>
              <p>
                <span :class="$style.ebackupEnvColor">{{ singleSwitchOriginIp(singleSwitchIpMsg) }}</span>
                切换为
                <span :class="$style.productionEnvColor">{{ singleSwitchTargetIp(singleSwitchIpMsg) }}</span>
              </p>
            </div>
            <div v-else>
              <p>
                服务IP: <span :class="$style.serviceIp">{{ singleSwitchOriginIp(singleSwitchIpMsg) }}</span>将从
              </p>
              <p>
                <span :class="singleSwitchIpMsg.serviceIpMark === 2 ? $style.ebackupEnvColor : $style.productionEnvColor">
                  <i-icon :name="singleSwitchIpMsg.serviceIpMark === 2 ? 'ebackup-env' : 'production-env'"
                          style="vertical-align: -0.3em;"></i-icon>
                  {{ singleSwitchIpMsg.serviceIpMark === 2 ? '易备环境' : '生产环境' }}
                </span>
                <span :class="$style.switchModalName">
                  {{ singleSwitchIpMsg.serviceIpMark === 2 ? singleSwitchIpMsg.viceHost.name : singleSwitchIpMsg.primaryHost.name }}
                </span>
                切换至
                <span :class="singleSwitchIpMsg.serviceIpMark === 1 ? $style.ebackupEnvColor : $style.productionEnvColor">
                  <i-icon :name="singleSwitchIpMsg.serviceIpMark === 1 ? 'ebackup-env' : 'production-env'"
                          style="vertical-align: -0.3em;"></i-icon>
                  {{ singleSwitchIpMsg.serviceIpMark === 1 ? '易备环境' : '生产环境' }}
                </span>
                <span :class="$style.switchModalName">
                  {{ singleSwitchIpMsg.serviceIpMark === 1 ? singleSwitchIpMsg.viceHost.name : singleSwitchIpMsg.primaryHost.name }}
                </span>
              </p>
            </div>
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
import takeoverMixin from '@/components/mixins/takeoverMixins';
export default {
  name: 'SingleSwitchIpModal',
  mixins: [takeoverMixin],
  props: {
    singleSwitchIpMsg: {
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
    modalOpen() {
      this.password = '';
    },
    cancelBtn() {
      this.modalVisible = false;
    },
    confirmBtn() {
      validatePassword(this.password)
        .then(() => {
          this.$emit('confirm', this.singleSwitchIpMsg);
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
.switchModalIp {
  display: inline-block;
  width: 7em;
}
.serviceIp {
  composes: switchModalIp;
  padding: 0 0.6em;
  border-radius: 0.4em;
  color: #1b80c4;
  background-color: lighten(#1b80c4, 45%);
  text-align: center;
}
</style>


