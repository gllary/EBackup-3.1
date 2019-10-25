<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="cancelBtn"
               @open="dialogOpen">
      <el-row v-if="Object.keys(hostLinkReadyToSwitch).length">
        <el-col :span="6">
          <i-icon name="warning"
                  :class="$style.switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px; overflow: auto;">
            <div>
              <h4>即将执行以下操作，请检查。</h4>
              <span v-if="!isServiceIpOK(hostLinkReadyToSwitch) && !switchVip"
                    :class="$style.errorTip">服务IP不符合切换要求，进入
                <el-button type="text"
                          @click="$router.push({name: 'deviceManager'})">设备管理</el-button>修改！</span>
              <!-- 临时IP开始：Windows下 -->
              <div v-else-if="osType(hostLinkReadyToSwitch.primaryHost) === 'Windows'">
                <p>
                  <p>
                    <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 1 ? 'production-env' : 'ebackup-env'"
                            style="vertical-align: -0.3em;"></i-icon>
                    <span :class=" hostLinkReadyToSwitch.serviceIpMark === 1 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark | serviceIpMarkFilter }}</span>
                    <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>的IP
                    <span :class="$style.productionEnvColor">{{ hostLinkReadyToSwitch.primaryHost.hostIp }}</span>与
                  </p>
                  <p>
                    <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 2 ? 'production-env' : 'ebackup-env'"
                          style="vertical-align: -0.3em;"></i-icon>
                    <span :class="hostLinkReadyToSwitch.serviceIpMark === 2 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? 2 : 1 | serviceIpMarkFilter }}</span>
                    <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 2 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>的IP
                    <span :class="$style.ebackupEnvColor">{{ hostLinkReadyToSwitch.viceHost.hostIp }}</span>即将交换
                  </p>
                  <p>临时IP为：<span :class="$style.serviceIp">{{hostLinkReadyToSwitch.primaryHost.serviceIp }}</span><p>
                </p>
              </div>
              <!-- 临时IP结束 -->
              <!-- 服务IP开始：Linux下单机 -->
              <div v-else-if="osType(hostLinkReadyToSwitch.primaryHost) === 'Linux'">
                <p>服务IP
                  <span :class="$style.serviceIp">
                    {{hostLinkReadyToSwitch.serviceIpMark === 1 ? hostLinkReadyToSwitch.primaryHost.serviceIp : hostLinkReadyToSwitch.viceHost.serviceIp }}
                  </span> 将由</p>
                <p>
                  <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 1 ? 'production-env' : 'ebackup-env'"
                          style="vertical-align: -0.3em;"></i-icon>
                  <span :class=" hostLinkReadyToSwitch.serviceIpMark === 1 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark | serviceIpMarkFilter }}</span>
                  <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
                  <span style="width: 4em;">切换至</span>
                  <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 2 ? 'production-env' : 'ebackup-env'"
                          style="vertical-align: -0.3em;"></i-icon>
                  <span :class="hostLinkReadyToSwitch.serviceIpMark === 2 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? 2 : 1 | serviceIpMarkFilter }}</span>
                  <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 2 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
                </p>
              </div>
              <!-- 服务IP结束 -->
              <!-- scanIp、vip开始 -->
              <div v-else-if="osType(hostLinkReadyToSwitch.primaryHost) === 'RAC'">
                <el-radio-group v-model="switchVip"
                                size="mini"
                                style="text-align: center">
                  <el-radio :label="false">scanIp</el-radio>
                  <el-radio :label="true">VIP</el-radio>
                </el-radio-group>
                <div v-if="!switchVip">
                  <p>scanIp
                    <span :class="$style.serviceIp">{{ hostLinkReadyToSwitch.primaryHost.serviceIp }}</span>将由</p>
                  <p>
                    <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 1 ? 'production-env' : 'ebackup-env'"
                            style="vertical-align: -0.3em;"></i-icon>
                    <span :class=" hostLinkReadyToSwitch.serviceIpMark === 1 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark | serviceIpMarkFilter }}</span>
                    <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
                    <span style="width: 4em;">切换至</span>
                    <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 2 ? 'production-env' : 'ebackup-env'"
                            style="vertical-align: -0.3em;"></i-icon>
                    <span :class="hostLinkReadyToSwitch.serviceIpMark === 2 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? 2 : 1 | serviceIpMarkFilter }}</span>
                    <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 2 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
                  </p>
                </div>
                <div v-else>
                  <p>
                    VIP将从
                    <i-icon :name="hostLinkReadyToSwitch.vipIpMark === 1 ? 'production-env' : 'ebackup-env'"
                            style="vertical-align: -0.3em;"></i-icon>
                    <span :class=" hostLinkReadyToSwitch.vipIpMark === 1 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.vipIpMark | serviceIpMarkFilter }}</span>
                    <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.vipIpMark === 1 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
                    <span style="width: 4em;">切换至</span>
                    <i-icon :name="hostLinkReadyToSwitch.vipIpMark === 2 ? 'production-env' : 'ebackup-env'"
                            style="vertical-align: -0.3em;"></i-icon>
                    <span :class="hostLinkReadyToSwitch.vipIpMark === 2 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.vipIpMark === 1 ? 2 : 1 | serviceIpMarkFilter }}</span>
                    <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.vipIpMark === 2 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
                  </p>
                  <!-- vip=>易备 -->
                  <div v-if="hostLinkReadyToSwitch.vipIpMark === 1">
                    <p>
                      <span :class="$style.productionEnvColor">{{ hostLinkReadyToSwitch.primaryHost.vip }}</span>
                      <i-icon name="readySwitch"
                              style="vertical-align: -0.3em;"></i-icon>
                      <span :class="$style.ebackupEnvColor">{{ hostLinkReadyToSwitch.viceHost.hostIp }}</span>
                    </p>
                    <p v-for="primaryNode in hostLinkReadyToSwitch.primaryNodes"
                      :key="primaryNode.id">
                      <span :class="$style.productionEnvColor">{{ primaryNode.vip }}</span>
                      <i-icon name="readySwitch"
                              style="vertical-align: -0.3em;"></i-icon>
                      <span :class="$style.ebackupEnvColor">{{ hostLinkReadyToSwitch.viceHost.hostIp }}</span>
                    </p>
                  </div>
                  <!-- vip=>生产 -->
                  <div v-else>
                    <p>
                      <span :class="$style.ebackupEnvColor">{{ hostLinkReadyToSwitch.primaryHost.vip }}</span>
                      <i-icon name="readySwitch"
                              style="vertical-align: -0.3em;"></i-icon>
                      <span :class="$style.productionEnvColor">{{ hostLinkReadyToSwitch.primaryHost.hostIp }}</span>
                    </p>
                    <p v-for="primaryNode in hostLinkReadyToSwitch.primaryNodes"
                      :key="primaryNode.id">
                      <span :class="$style.ebackupEnvColor">{{ primaryNode.vip }}</span>
                      <i-icon name="readySwitch"
                              style="vertical-align: -0.3em;"></i-icon>
                      <span :class="$style.productionEnvColor">{{ hostLinkReadyToSwitch.primaryHost.hostIp }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <!-- scanIp、vip结束 -->
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
  name: 'SwitchIpModal',
  mixins: [takeoverMixin],
  props: {
    hostLinkReadyToSwitch: {
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
      password: '',
      switchVip: false
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
      this.switchVip = false;
    },
    cancelBtn() {
      this.modalVisible = false;
    },
    confirmBtn() {
      validatePassword(this.password)
        .then(() => {
          this.$emit('confirm', this.switchVip);
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
@import '@/assets/theme/variable.scss';
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
@keyframes beforeMove {
  0%, 100% {
    width: calc(100% - 5px);
    height: 0;
    top: 0;
    right: 0;
    border-top: 5px solid #efb336;
    border-right: 5px solid #efb336;
    border-bottom-width: 0;
    border-left-width: 0;
  }
  24.9% {
    width: 0;
    height: calc(100% - 5px);
    top: 0;
    right: 0;
    border-top: 5px solid #efb336;
    border-right: 5px solid #efb336;
    border-bottom-width: 0;
    border-left-width: 0;
  }
  25% {
    width: 0;
    height: calc(100% - 5px);
    top: 0;
    right: 0;
    border-top-width: 0;
    border-left-width: 0;
    border-right: 5px solid #efb336;
    border-bottom: 5px solid #efb336;
  }
  49.9% {
    width: calc(100% - 5px);
    height: 0;
    top: calc(100% - 5px);
    right: 0;
    border-top-width: 0;
    border-left-width: 0;
    border-right: 5px solid #efb336;
    border-bottom: 5px solid #efb336;
  }
  50% {
    width: calc(100% - 5px);
    height: 0;
    top: calc(100% - 5px);
    right: 0;
    border-top-width: 0;
    border-right-width: 0;
    border-left: 5px solid #efb336;
    border-bottom: 5px solid #efb336;
  }
  74.9% {
    width: 0;
    height: calc(100% - 5px);
    top: 0;
    right: calc(100% - 5px);
    border-top-width: 0;
    border-right-width: 0;
    border-left: 5px solid #efb336;
    border-bottom: 5px solid #efb336;
  }
  75% {
    width: 0;
    height: calc(100% - 5px);
    top: 0;
    right: calc(100% - 5px);
    border-top: 5px solid #efb336;
    border-bottom: 0;
    border-right-width: 0;
    border-left: 5px solid #efb336;
  }
  99.9% {
    width: calc(100% - 5px);
    height: 0;
    top: 0;
    right: 0;
    border-top: 5px solid #efb336;
    border-bottom: 0;
    border-right-width: 0;
    border-left: 5px solid #efb336;
  }
}
.promptBox {
  box-shadow: 0 0 0 1px #efb336;
  padding: 5px;
  margin-bottom: 5px;
  position: relative;
}
.promptContent {
  border: 1px solid #efb336;
  height: 100%;
  padding-top: 0;
  padding-left: 10px;
  overflow: auto;
}
.promptContent::before,
.promptContent::after {
  background-color: transparent;
  animation: beforeMove 8s linear infinite;
  position: absolute;
  content: '';
}
.promptContent::before {
  animation-delay: -4s;
}
</style>