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
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px;position: 'relative'"
               v-if="Object.keys(readyToFailOverLink).length">
            <h4>即将执行以下操作，请检查。</h4>
            <p>
              <span class="sourceEnvColor">
                <i-icon name="virtual-source"
                        style="vertical-align: -0.3em;"></i-icon>
                {{ '源虚拟机' }}
              </span>
              <span class="syncVirtualName">
                {{ readyToFailOverLink.sourceVirtual.vmName }}
              </span>
              数据将备份至
              <span class="targetEnvColor">
                <i-icon name="virtual-target"
                        style="vertical-align: -0.3em;"></i-icon>
                {{ '同步虚拟机' }}
              </span>
              <span class="syncVirtualName">
                {{ readyToFailOverLink.targetVirtual.vmName }}
              </span>
            </p>
            时间点：<span v-if="loading">加载中...</span>
                   <span v-else-if="!loading && !handleSelect">
                     <span>{{ timePoint }}</span>
                     <el-tooltip content="默认选择最近时间点" placement="top" effect="light">
                        <el-button type="text"
                                   @click="handleSelect = !handleSelect"
                                   style="margin-left: 20px">手动选择</el-button>
                     </el-tooltip>
                     <span style="color: #D81E06">(不推荐)</span>
                   </span>
                   <el-select v-model="timePoint"
                              :placeholder="`${loading ? '加载中...' : ''}`"
                              size="small"
                              v-else-if="!loading && handleSelect">
                      <el-option v-for="(point, index) in timePoints"
                                 :key="index"
                                 :label="point"
                                 :value="point">
                      </el-option>
                    </el-select>
            <p :style="{ opacity: hasShutDowned ? 1 : 0.7, position: 'absolute', bottom : '60px'}">
              <el-checkbox v-model="hasShutDowned">
                源虚拟机
                <span style="color: red">
                  {{ readyToFailOverLink.sourceVirtual.vmName }}
                </span>
                已关闭
              </el-checkbox>
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
import { fetchTimePoints } from '@/api/virtuals';
export default {
  name: 'FailOverModal',
  props: ['visible', 'btnLoading', 'readyToFailOverLink'],
  components: {
    IIcon
  },
  data() {
    return {
      password: '',
      timePoint: '',
      loading: false,
      handleSelect: false,
      timePoints: [],
      hasShutDowned: false
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
      return !this.password || !this.timePoint || !this.hasShutDowned;
    }
  },
  methods: {
    cancelBtn() {
      this.modalVisible = false;
    },
    dialogOpen() {
      this.password = '';
      this.loading = true;
      this.handleSelect = false;
      fetchTimePoints(this.readyToFailOverLink.id)
        .then(res => {
          const { data: points } = res.data;
          this.timePoints = [].concat(points.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()));
          this.timePoint = this.timePoints.length ? this.timePoints[0] : '';
          this.loading = false;
        })
        .catch(() => {
          this.$message.error(error);
        });
      this.hasShutDowned = false;
    },
    confirmBtn() {
      validatePassword(this.password)
        .then(() => {
          this.$emit('confirm', { link: this.readyToFailOverLink, timePoint: this.timePoint });
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
.sourceEnvColor {
  color: #31a17b;
}
.targetEnvColor {
  color: #c22b76;
}
.syncVirtualName {
  display: inline-block;
  min-width: 6em;
  margin-left: 0.5em;
}
</style>

