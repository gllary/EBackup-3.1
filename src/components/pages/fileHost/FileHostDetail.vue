<template>
  <section>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon :name="systemType"
                    class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>{{details.hostName}}</h1>
              </el-col>
              <el-col :span="12"
                      :offset="4"
                      class="action">
                <el-dropdown size="mini"
                             trigger="click"
                             placement="bottom"
                             @command="addPlanBtnClick">
                  <el-button size="mini"
                             plain>添加计划
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <!-- 文件系统备份计划 可以多次添加 -->
                    <el-dropdown-item command="backup">备份计划</el-dropdown-item>
                    <el-dropdown-item disabled
                                      command="restore">恢复计划</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- <el-button size="mini"
                           type="primary"
                           @click="detailsEditModal = true">编辑</el-button> -->
              </el-col>
            </el-row>
            <el-form v-loading="infoLoading"
                     :element-loading-background="themeColor.loadingBackGround"
                     label-position="left"
                     label-width="100px"
                     size="small"
                     class="item-info">
              <el-row style="margin-right: 5px;">
                <el-col :span="8">
                  <el-form-item label="操作系统：">
                    <span>{{ details.osName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="主机IP：">
                    <span>{{ details.hostIp }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="所属系统：">
                <span>{{ details.application }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </header>
    <tab-panels @switchpane="switchPane" :planFilterForm="planFilterForm"  :type="systemType">
      <template slot="backupCard">
        <backup-card :id="plan.id"
                     v-for="plan in filteredBackupPlans"
                     :key="plan.id"
                     :backupPlan="plan"
                     :type="systemType"
                     @refresh="refreshSingleBackupPlan"
                     @deletePlan="deleteBackupPlan"
                     @updatePlan="selectBackupPlan(plan.id)"></backup-card>
      </template>
      <template slot="restoreCard">
        <!-- <restore-card :id="plan.id"
                        v-for="plan in filteredRestorePlans"
                        :key="plan.id"
                        :restore-plan="plan"
                        @refresh="refreshSingleRestorePlan"
                        @deletePlan="deleteRestorePlan"
                        @updatePlan="selectRestorePlan(plan.id)"></restore-card> -->
      </template>
      <template slot="backupResult">
        <backup-result-list :data="results"
                            :type="systemType"
                            @single-restore-btn-click="initSingleRestoreModal"></backup-result-list>
      </template>
      <template slot="restoreRecord">
        <restore-records :restore-plan="restorePlans"
                         :records="restoreRecords"
                         :type="systemType"
                         @restoreinfo:refresh="updateRestorePlanAndRecords"></restore-records>
      </template>
    </tab-panels>
    <backup-plan-modal   :btn-loading="btnLoading"
                          :type="systemType"
                            :visible.sync="backupPlanModalVisible"
                            @confirm="confirmCallback"
                            :action="action"
                            :backup-plan="selectedBackupPlan">
    </backup-plan-modal>

    <!-- <restore-plan-modal   :btn-loading="btnLoading"
                            :visible.sync="restorePlanModalVisible"
                            @confirm="restoreConfirmCallback"
                            :action="restoreAction"
                            :restore-plan="selectedRestorePlan">
    </restore-plan-modal> -->
    <single-restore-modal   :btn-loading="btnLoading"
                            :type="systemType"
                            :result-id="selectedBackupResultId"
                            :visible.sync="singleRestoreCreateModalVisible"
                            @confirm="singleConfirmCallback">
    </single-restore-modal>
  </section>
</template>
<script>
import dayjs from 'dayjs';
import throttle from 'lodash/throttle';
import { applyFilterMethods } from '@/utils/common';
import { detailPageMixin } from '@/components/mixins/dbDetailsPageMixin';
import BackupPlanModal from '@/components/pages/fileHost/BackupPlanModal';
// import RestorePlanModal from '@/components/pages/fileHost/RestorePlanModal';
import SingleRestoreModal from '@/components/pages/fileHost/SingleRestoreModal';
import BackupCard from '@/components/pages/fileHost/BackupCard';
import BackupResultList from '@/components/pages/fileHost/BackupResultList';
// import RestoreCard from '@/components/pages/fileHost/RestoreCard';
import RestoreRecords from '@/components/pages/fileHost/RestoreRecords';

export default {
  name: 'FileHostDetail',
  mixins: [detailPageMixin],
  components: {
    BackupPlanModal,
    SingleRestoreModal,
    BackupCard,
    BackupResultList,
    RestoreRecords
  },
  data() {
    return {
      type: 'file-host',
    };
  },
  methods: {
  },
  computed: {
    systemType() {
      return this.details && this.details.osName
        ? this.details.osName.toLowerCase()
        : 'windows';
    },
  }
};
</script>
