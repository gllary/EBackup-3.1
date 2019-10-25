<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="switchModalClosed">
      <el-row>
        <el-col :span="6">
          <i-icon name="warning"
                  :class="$style.switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px;overflow: scroll;">
            <h4>即将执行以下操作，请检查。</h4>
            <span v-if="!isServiceIpOK(hostLinkReadyToSwitch)"
                  :class="$style.errorTip">服务IP不符合切换要求，进入
              <el-button type="text"
                         @click="$router.push({name: 'deviceManager'})">设备管理</el-button>修改！</span>
            <!-- 临时IP开始：Windows下 -->
            <div v-else-if="switchTempIp">
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
                <p>临时IP为：<span :class="$style.serviceIp">{{ hostLinkReadyToSwitch.primaryHost.serviceIp }}</span><p>
              </p>
            </div>
            <!-- 临时IP结束 -->
            <!-- 服务IP开始 -->
            <div v-else-if="switchServiceIp">
              <p>服务IP
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
            <!-- 服务IP结束 -->
            <!-- 单切开始 -->
            <div v-else-if="switchSimpleIp">
              <div v-if="readyToSingleSwitch.viceHost.osName === 'Windows'">
                <p>
                  <i-icon name="ebackup-env"
                          style="vertical-align: -0.3em;"></i-icon>
                  <span :class="$style.ebackupEnvColor">易备环境</span>
                  <span :class="$style.switchModalName">{{ readyToSingleSwitch.viceHost.name }}</span>的IP将由
                </p>
                <p>
                  <span :class="$style.ebackupEnvColor">{{ singleSwitchOriginIp(readyToSingleSwitch) }}</span>
                  切换为
                  <span :class="$style.productionEnvColor">{{ singleSwitchTargetIp(readyToSingleSwitch) }}</span>
                </p>
              </div>
              <div v-else>
                <p>
                  服务IP: <span :class="$style.serviceIp">{{ singleSwitchOriginIp(readyToSingleSwitch) }}</span>将从
                </p>
                <p>
                  <span :class="readyToSingleSwitch.serviceIpMark === 2 ? $style.ebackupEnvColor : $style.productionEnvColor">
                    <i-icon :name="readyToSingleSwitch.serviceIpMark === 2 ? 'ebackup-env' : 'production-env'"
                            style="vertical-align: -0.3em;"></i-icon>
                    {{ readyToSingleSwitch.serviceIpMark === 2 ? '易备环境' : '生产环境' }}
                  </span>
                  <span :class="$style.switchModalName">
                    {{ readyToSingleSwitch.serviceIpMark === 2 ? readyToSingleSwitch.viceHost.name : readyToSingleSwitch.primaryHost.name }}
                  </span>
                  切换至
                  <span :class="readyToSingleSwitch.serviceIpMark === 1 ? $style.ebackupEnvColor : $style.productionEnvColor">
                    <i-icon :name="readyToSingleSwitch.serviceIpMark === 1 ? 'ebackup-env' : 'production-env'"
                            style="vertical-align: -0.3em;"></i-icon>
                    {{ readyToSingleSwitch.serviceIpMark === 1 ? '易备环境' : '生产环境' }}
                  </span>
                  <span :class="$style.switchModalName">
                    {{ readyToSingleSwitch.serviceIpMark === 1 ? readyToSingleSwitch.viceHost.name : readyToSingleSwitch.primaryHost.name }}
                  </span>
                </p>
              </div>
            </div>
            <!-- 单切结束 -->
            <!-- 解除连接开始 -->
            <div v-if="isRemoveHostLink">
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
            <!-- 解除连接结束 -->
          </div>
          <el-input type="password"
                    v-model="password"
                    placeholder="请输入用户密码以执行此操作"></el-input>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="switchModalClosed">取消</el-button>
        <el-button type="primary"
                   :disabled="confirmBtnDisable"
                   :loading="btnLoading"
                   @click="confirmSwitch">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import { validatePassword } from '@/api/user';
import takeoverMixin from '@/components/mixins/takeoverMixins';
export default {
  name: 'SwitchModal',
  mixins: [takeoverMixin],
  props: {
    visible: {
      type: Boolean,
    },
    btnLoading: {
      type: Boolean,
    },
    hostLinkReadyToSwitch: {
      type: Object,
    },
    readyToSingleSwitch: {
      type: Object
    },
    readyToRemoveHostLink: {
      type: Object
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
          this.$emit('cancel');
        }
      },
    },
    confirmBtnDisable() {
      return !this.password;
    },
    // windows下--切临时IP
    switchTempIp() {
      return this.hostLinkReadyToSwitch&&this.hostLinkReadyToSwitch.primaryHost.osName==='Windows';
    },
    // linux下--切服务IP
    switchServiceIp() {
      return this.hostLinkReadyToSwitch&&this.hostLinkReadyToSwitch.primaryHost.osName==='Linux';
    },
    // 单切IP
    switchSimpleIp() {
      return this.readyToSingleSwitch&&Object.keys(this.readyToSingleSwitch).length>0
    },
    // 解除连接
    isRemoveHostLink() {
      return this.readyToRemoveHostLink&&Object.keys(this.readyToRemoveHostLink).length>0
    }
  },
  methods: {
    switchModalClosed() {
      this.password = '';
      this.$emit('cancel');
    },
    confirmSwitch() {
      validatePassword(this.password)
        .then(() => {
          this.$emit('confirm');
          this.password = '';
        })
        .catch(error => {
          this.$message.error(error);
        })
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
.errorTip {
  color: $error-color;
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


