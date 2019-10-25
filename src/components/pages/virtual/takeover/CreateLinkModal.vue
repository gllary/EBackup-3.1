<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               custom-class="min-width-dialog"
               title="同步初始化"
               :before-close="beforeModalClose"
               @open="modalOpen"
               @close="modalClosed">
      <el-form size="small"
               label-width="100px"
               ref="refForm"
               :rules="rules"
               :model="formData">
        <el-row>
          <el-col :span="12">
            <el-form-item label="同步主机"
                          class="is-required"
                          prop="targetServerId">
              <el-select v-model.number="formData.targetServerId"
                         @change="changeHost(formData.targetServerId, vmType === 1)"
                         style="width: 100%">
                <el-option v-for="(server, index) in serverData"
                           :key="index"
                           :value="server.id"
                           :label="`${server.serverName}(${server.serverIp})`">
                  <span style="float: left">{{ server.serverName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ server.serverIp }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="同步磁盘"
                          prop="savePath"
                          class="is-required"
                          v-if="vmType === 1">
              <el-select v-model="formData.savePath"
                         style="width: 100%"
                         :disabled="!hasHostIp"
                         :placeholder="showLoading?'加载中...':'请选择恢复磁盘'">
                <el-option v-for="(disk, index) in disks"
                          :key="index"
                          :label="disk"
                          :value="disk"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="同步路径"
                          prop="savePath"
                          v-if="vmType === 3"
                          class="is-required"
                          :rules="{ required: true, message: '请输入同步路径', trigger: 'blur' }">
              <el-input v-model="formData.savePath"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(config, index) in formData.ipConfigs"
                :key="config.vmId">
          <el-col :span="12">
            <el-form-item label="虚拟机名"
                          prop="ipConfigs">
              <el-input disabled
                        v-model="formData.ipConfigs[index].vmName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="虚拟机IP"
                          :prop="'ipConfigs.'+index+'.sourceIp'"
                          :rules="validate.hostIp">
              <el-input v-model="formData.ipConfigs[index].sourceIp"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="同步策略"
                      prop="syncTimeStrategy">
          <el-radio-group v-model.number="formData.syncTimeStrategy">
            <el-radio v-for="strategy in Object.keys(syncStragegyMapping)"
                      :key="strategy"
                      :label="Number(strategy)">{{ syncStragegyMapping[strategy] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="同步周期" class="is-required"
                      prop="minuteInterval"
                      v-show="formData.syncTimeStrategy === 1">
          <el-input-number v-model="formData.minuteInterval"
                           :min="1"
                           :max="60"
                           :step="10"
                           contrls-position="right"></el-input-number>
          <span>（单位：分钟）</span>
        </el-form-item>
        <el-form-item label="同步周期" class="is-required"
                      prop="hourInterval"
                      v-show="formData.syncTimeStrategy === 2">
          <el-input-number v-model="formData.hourInterval"
                           :min="1"
                           :max="24"
                           :step="1"
                           contrls-position="right"></el-input-number>
          <span>（单位：小时）</span>
        </el-form-item>
        <el-form-item label="选择星期" class="is-required"
                      prop="weekDays"
                      v-show="formData.syncTimeStrategy == 4">
        <el-checkbox-group v-model="formData.weekDays">
          <el-checkbox-button v-for="w in Object.keys(weekMapping)"
                              :label="Number(w)"
                              :key="w">{{ weekMapping[w] }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
        <el-form-item label="时间点"
                      style="width: 100%"
                      class="is-required"
                      v-show="[3, 4].indexOf(formData.syncTimeStrategy) !== -1">
        <el-time-select v-model="formData.syncRunTime"
                        :picker-options="{start: '00:00', end: '23:45', step: '00:15'}"></el-time-select>
      </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelBtnClick">取消</el-button>
        <el-button type="primary"
                   :loading="btnLoading"
                   @click="confirmBtnClick">确定</el-button>
      </span>      
    </el-dialog>
  </section>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { fetchDisksByHostId } from '@/api/virtuals';
import { syncStragegyMapping, weekMapping } from '@/utils/constant';
import validate from '@/utils/validate';

const basicData = {
  targetServerId: '',
  savePath: '',
  ipConfigs: [],
  syncTimeStrategy: 0,
  syncRunTime: '00:00',
  weekDays: [],
  hourInterval: 1,
  minuteInterval: 10
};

export default {
  name: 'CreateLinkModal',
  props: ['visible', 'btnLoading', 'selectedVirtuals', 'serverData', 'vmType'],
  data() {
    const weekDaysValidate = (rule, value, callback) => {
      if (this.formData.syncTimeStrategy === 4 && !value) {
        callback(new Error('请选择循环星期'));
      } else {
        callback();
      }
    }
    const syncRunTimeValidate = (rule, value, callback) => {
      if ([3, 4].indexOf(this.formData.syncTimeStrategy) !== -1 && !value) {
        callback(new Error('请输入时间点'));
      } else {
        callback();
      }
    }
    const rules = {
      targetServerId: [
        {
          required: true, message: '请选择同步主机', trigger: ['blur']
        }
      ],
      savePath: [
        {
          required: true, message: '请选择同步磁盘', trigger: ['blur']
        }
      ],
      weekDays: [
        {
          validator: weekDaysValidate,
          trigger: ['blur']
        }
      ],
      syncRunTime: [
        {
          validator: syncRunTimeValidate,
          trigger: ['blur']
        }
      ]
    }
    return {
      formData: {},
      originFormData: {},
      showLoading: false,
      hasHostIp: false,
      disks: [],
      syncStragegyMapping,
      weekMapping,
      validate,
      rules
    };
  },
  computed: {
    modalVisible: {
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
    changeHost(id, readyToFetch) {
      if (readyToFetch) {
        this.showLoading = true;
        this.hasHostIp = false;
        fetchDisksByHostId(id)
          .then(res => {
            const { data } = res.data;
            this.disks = data;
            this.formData.savePath = '';
            this.hasHostIp = true;
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {
            this.showLoading = false;
          });
      }
    },
    confirmBtnClick() {
      this.$refs.refForm.validate(valid => {
        if(valid) {
          const { ipConfigs, syncTimeStrategy, minuteInterval, hourInterval, ...others } = this.formData;
          const syncConfig = {
            ipConfigs: ipConfigs.map(config => ({
              vmId: config.vmId,
              sourceIp: config.sourceIp
            })),
            syncTimeStrategy,
            syncTimeInterval: syncTimeStrategy === 1 ? minuteInterval : hourInterval,
            ...others
          }
          if (![3, 4].includes(syncTimeStrategy)) {
            this.$delete(syncConfig, 'syncRunTime');
          }
          this.$emit('confirm', syncConfig);
        } else {
          return false;
        }
      })
    },
    cancelBtnClick() {
      this.hasModifiedBeforeClose(() => {
        this.modalVisible = false;
      });
    },
    modalOpen() {
      const configs = this.selectedVirtuals.map(virtual => ({
        vmId: virtual.id,
        vmName: virtual.vmName,
        sourceIp: ''
      }));
      const { ipConfigs, ...others } = basicData;
      this.formData = { ipConfigs: ipConfigs.concat(configs), ...others };
      this.originFormData = cloneDeep(this.formData);
    },
    modalClosed() {
      this.$refs.refForm.clearValidate();
    },
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
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
  }
}
</script>
