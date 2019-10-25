<template>
  <section>
    <el-tabs :class="$style.tabs"
             v-model="activeTab"
             @tab-click="switchPane">
      <el-tab-pane label="操作计划"
                   name="plans">
        <el-form inline
                 size="small"
                 :model="planFilterForm"
                 :class="$style.filterForm">
          <el-form-item :class="$style.filterFormItem">
            <el-radio border
                      v-model="planFilterForm.planType"
                      label="backup">备份计划</el-radio>
            <el-radio border
                      v-model="planFilterForm.planType"
                      label="restore">恢复计划</el-radio>
            <el-radio border
                      v-model="planFilterForm.planType"
                      v-if="type === 'oracle'"
                      :disabled="!hasLogRestore"
                      label="logRestore">日志恢复</el-radio>
            <el-radio border
                      v-model="planFilterForm.planType"
                      v-if="type === 'oracle'"
                      :disabled="!hasTableLevelRestore"
                      label="tblRestore">表级恢复</el-radio>
          </el-form-item>
          <el-form-item :class="$style.filterFormItem"
                        label="隐藏已完成计划">
            <el-switch v-model="planFilterForm.hiddenCompletePlan"></el-switch>
          </el-form-item>

        </el-form>
        <!-- 备份计划面板 -->
        <slot name="backupCard"></slot>

        <template>
          <!-- 恢复计划面板 -->
          <slot name="restoreCard"></slot>
        </template>
      </el-tab-pane>
      <el-tab-pane :label="['windows', 'linux'].includes(type)?'备份记录':'备份集'"
                   name="results">
        <el-form inline
                 :model="restorePlanFilterForm"
                 :class="$style.filteFrorm"
                 style="text-align: right;">
          <el-form-item :class="$style.filterFormItem">
          </el-form-item>
        </el-form>
        <!-- 备份集列表-->
        <slot name="backupResult"></slot>
      </el-tab-pane>
      <el-tab-pane label="恢复记录"
                   name="restore">
        <!-- 恢复记录列表-->
        <el-form inline
                size="small"
                v-if="type === 'oracle'"
                :class="$style.filterForm">
          <el-form-item :class="$style.filterFormItem">
            <el-radio-group v-model="recordType"
                            @change="recordTypeChange">
              <el-radio border
                        label="plan">全备+增备恢复</el-radio>
              <el-radio border
                        :disabled="!hasLogRestore"
                        label="log">日志恢复</el-radio>
              <el-radio border
                        :disabled="!hasTableLevelRestore"
                        label="table">表级恢复</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <slot name="restoreRecord"></slot>
      </el-tab-pane>
    </el-tabs>
  </section>

</template>
<script>
import throttle from 'lodash/throttle';
import IIcon from '@/components/IIcon';
import { applyFilterMethods } from '../../utils/common';

export default {
  name: 'TabPanels',
  props: {
    planFilterForm: {
      type: Object
    },
    type: {
      type: String
    },
    tab: {
      type: String,
      default: function() {
        return 'plans';
      }
    },
    hasTableLevelRestore: {
      type: Boolean,
      default: false
    },
    hasLogRestore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // activeTab: 'plans', // 激活的tab页
      // 恢复计划筛选条件
      restorePlanFilterForm: {
        hiddenCompletePlan: false,
      },
      recordType: 'plan'
    };
  },
  computed: {
    activeTab: {
      get() {
        return this.tab;
      },
      set() {}
    }
  },
  // 根据入口激活当前tab页
  created() {
    if(this.$route.params.type === 'backup') {
      this.activeTab = 'results';
    } else if (this.$route.params.type === 'restore') {
      this.activeTab = 'restore';
    }
    if (this.type === 'oracle') {
      this.$emit('filterRecords', this.recordType);
    }
  },
  methods: {
    switchPane({ name }) {
      this.$emit('switchpane', name);
    },
    recordTypeChange() {
      this.$emit('filterRecords', this.recordType);
    }
  },
  components: {
    IIcon,
  },
};
</script>
<style module>
.tabs {
  margin-top: -39px;
}
.filterForm {
  padding-left: 20px;
}
.filterFormItem {
  margin-bottom: 0;
}
</style>
