<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="cancelBtn"
               @open="dialogOpen">
      <el-row>
        <el-col :span="6">
          <i-icon name="warning"
                  class="switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18"
                v-if="Object.keys(readyToDeleteLink).length">
          <div style="height: 220px;max-height: 220px;">
            <h4>即将执行以下操作，请检查。</h4>
            <p>
              <span class="sourceEnvColor">
                <i-icon name="virtual-source"
                        style="vertical-align: -0.3em;"></i-icon>
                {{ '源虚拟机' }}
              </span>
              <span class="syncVirtualName">
                {{ readyToDeleteLink.sourceVirtual.vmName }}
              </span>
              与
              <span class="targetEnvColor">
                  <i-icon name="virtual-target"
                          style="vertical-align: -0.3em;"></i-icon>
                  {{ '同步虚拟机' }}
                </span>
                <span class="syncVirtualName">
                  {{ readyToDeleteLink.targetVirtual.vmName }}
              </span>的连接将被解除
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
  name: 'DeleteLinkModal',
  props: ['visible', 'btnLoading', 'readyToDeleteLink'],
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
    cancelBtn() {
      this.modalVisible = false;
    },
    dialogOpen() {
      this.password = '';
    },
    confirmBtn() {
      validatePassword(this.password)
        .then(() => {
          this.$emit('confirm', this.readyToDeleteLink);
        })
        .catch(error => {
          this.$message.error(error);
        });
    }
  }
}
</script>
<style scoped>
.switchModalIcon {
  width: 9em;
  height: 9em;
  margin: 25% 25%;
}
.syncVirtualName {
  display: inline-block;
  width: 8em;
  margin-left: 0.5em;
}
.sourceEnvColor {
  color: #31a17b;
}
.targetEnvColor {
  color: #c22b76;
}
</style>

