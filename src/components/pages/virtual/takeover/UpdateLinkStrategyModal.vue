<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               custom-class="min-width-dialog"
               title="更新策略"
               :before-close="beforeModalClose"
               @open="modalOpen"
               @close="modalClosed">
      <el-form size="small"
               label-width="100px"
               ref="refForm"
               :rules="rules"
               :model="formData">
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
import { syncStragegyMapping, weekMapping } from '@/utils/constant';

const basicData = {
  syncTimeStrategy: 0,
  syncRunTime: '00:00',
  weekDays: [],
  minuteInterval: 10,
  hourInterval: 1
};

export default {
  name: 'UpdateLinkStrategyModal',
  props: ['sourceData', 'btnLoading', 'visible'],
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
    };
    return {
      formData: {},
      originFormData: {},
      syncStragegyMapping,
      weekMapping,
      rules
    }
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
    confirmBtnClick() {
      this.$refs.refForm.validate(valid => {
        if(valid) {
          const { syncTimeStrategy, minuteInterval, hourInterval, ...others } = this.formData;
          const syncConfig = {
            syncTimeStrategy,
            syncTimeInterval: syncTimeStrategy === 1 ? minuteInterval : hourInterval,
            ...others
          };
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
      const { syncTimeStrategy, syncTimeInterval, ...others } = this.sourceData;
      if (syncTimeStrategy === 1) {
        this.formData = Object.assign(basicData, { syncTimeStrategy, minuteInterval: syncTimeInterval, ...others });
      } else {
        this.formData = Object.assign(basicData, { syncTimeStrategy, hourInterval: syncTimeInterval, ...others });
      }
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
