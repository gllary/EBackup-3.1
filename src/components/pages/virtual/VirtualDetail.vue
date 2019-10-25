<template>
  <section>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="vmware"
                    class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>{{details.vmName}}</h1>
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
                    <el-dropdown-item command="backup">备份计划</el-dropdown-item>
                    <el-dropdown-item command="restore"
                                      >恢复计划</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
            <el-form v-loading="infoLoading"
                     :element-loading-background="themeColor.loadingBackGround"
                     label-position="left"
                     label-width="130px"
                     inline
                     size="small"
                     class="item-info">
              <el-row class="margin-right5">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="操作系统：">
                      <div>{{ details.host.osName }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="类型：">
                      <div>{{ details.type | vmTypeFilter }}</div>
                    </el-form-item>
                   </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="所属设备IP：">
                      <div>{{ details.host.hostIp }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所属物理主机IP：">
                      <div>{{ details.vmHostName }}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="details.server">
                  <el-col :span="8">
                    <el-form-item label="虚拟机主机IP：">
                      <div>{{ details.server.serverIp }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="虚拟机主机类型：">
                      <div>{{ details.server.serverType | serverTypeFilter }}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>
            </el-form>
          </el-col>
        </el-row>

      </div>
    </header>
    <tab-panels @switchpane="switchPane" :planFilterForm="planFilterForm">
      <template slot="backupCard">
        <backup-card :id="plan.id"
                     :vm-type="vmType"
                     v-for="plan in filteredBackupPlans"
                     :key="plan.id"
                     :backupPlan="plan"
                     @refresh="refreshSingleBackupPlan"
                     @deletePlan="deleteBackupPlan"
                     @updatePlan="selectBackupPlan(plan.id)"></backup-card>
      </template>
      <template slot="restoreCard">
        <restore-card :id="plan.id"
                        v-for="plan in filteredRestorePlans"
                        :key="plan.id"
                        :restore-plan="plan"
                        @refresh="refreshSingleRestorePlan"
                        @deletePlan="deleteRestorePlan"
                        @updatePlan="selectRestorePlan(plan.id)"></restore-card>
      </template>
      <template slot="backupResult">
        <backup-result-list :data="results"
                            @single-restore-btn-click="initSingleRestoreModal"
                            @delete-result="deleteOneResult"></backup-result-list>
      </template>
      <template slot="restoreRecord">
        <restore-records :restore-plan="restorePlans"
                         :records="restoreRecords"
                         :vm-type="vmType"
                         @restoreinfo:refresh="updateRestorePlanAndRecords"></restore-records>
      </template>
    </tab-panels>
    <backup-plan-modal :btn-loading="btnLoading"
                       :visible.sync="backupPlanModalVisible"
                       @confirm="vmCallback"
                       :action="action"
                       :backup-plan="selectedBackupPlan">
    </backup-plan-modal>

    <restore-plan-modal :btn-loading="btnLoading"
                        :details="details"
                        :vm-type="vmType"
                        :serverData="serverData"
                        :visible.sync="restorePlanModalVisible"
                        @confirm="restoreConfirmCallback"
                        :action="restoreAction"
                        :restore-plan="selectedRestorePlan">
    </restore-plan-modal>
    <single-restore-modal :btn-loading="btnLoading"
                          :details="details"
                          :vm-type="vmType"
                          :serverData="serverData"
                          :result-id="selectedBackupResultId"
                          :visible.sync="singleRestoreCreateModalVisible"
                          @confirm="singleConfirmCallback">
    </single-restore-modal>
  </section>
</template>
<script>
import { detailPageMixin } from '@/components/mixins/dbDetailsPageMixin';
import BackupPlanModal from '@/components/pages/virtual/BackupPlanModal';
import RestorePlanModal from '@/components/pages/virtual/RestorePlanModal';
import SingleRestoreModal from '@/components/pages/virtual/SingleRestoreModal';
import BackupCard from '@/components/pages/virtual/BackupCard';
import BackupResultList from '@/components/pages/virtual/BackupResultList';
import RestoreCard from '@/components/pages/virtual/RestoreCard';
import RestoreRecords from '@/components/pages/virtual/RestoreRecords';
import { virtualHostServerTypeMapping, virtualMapping, vmTypeMapping } from '@/utils/constant';

import {
  updateVirtualBackupPlan,
  createMultipleVirtualBackupPlan,
  deleteVirtualBackupPlan
} from '@/api/virtuals';
import { fetchServerList } from '@/api/host';

export default {
  name: 'VirtualDetail',
  mixins: [detailPageMixin],
  components: {
    BackupPlanModal,
    RestorePlanModal,
    SingleRestoreModal,
    BackupCard,
    BackupResultList,
    RestoreCard,
    RestoreRecords,
  },
  data() {
    return {
      type: 'virtual',
      serverDatas: []
    };
  },
  computed: {
    vmType() {
      return Number(Object.keys(virtualMapping).find(type =>
        this.$route.name.toLowerCase().includes(virtualMapping[type].toLowerCase())
      ));
    },
    serverData() {
      return this.serverDatas.filter( e => {
        if(this.details && this.details.host){
          return e.hostId === this.details.host.id && e.serverType !== 1;
        }
        return false;
      })
    }
  },
  filters: {
    serverTypeFilter(data) {
      return virtualHostServerTypeMapping[data];
    },
    vmTypeFilter(type) {
      return vmTypeMapping[type];
    }
  },
  methods: {
    vmCallback(data, type) {
      if (type === 'update') {
        this.updateBackupPlan(data.id, data);
      } else {
        this.addBackupPlan(data);
      }
    },
    fetchServer(){
      fetchServerList().then(res => {
        const { data } = res.data;
        this.serverDatas = Array.isArray(data) ? data : [];
      }).catch( error => {
        this.$message.error(error);
      })
    },
    addBackupPlan(plan) {
      this.btnLoading = true;
      // createVirtualBackupPlan({ id: this.id, plan })
      const data = Object.assign({}, plan, { vmList: [this.id] });
      createMultipleVirtualBackupPlan(data)
        .then(res => {
          const { message } = res.data;
          this.getBackupPlanList();
          this.backupPlanModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
          return false;
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    deleteBackupPlan(planId, delBackupResults) {
      deleteVirtualBackupPlan(planId, delBackupResults).then(() => {
        this.backupPlans.splice(
          this.backupPlans.findIndex(plan => plan.id === planId),
          1
        );
        this.$message.success('删除成功');
      }).catch(error => {
        this.$message.error(error);
      });
    },
    updateBackupPlan(id, plan) {
      this.btnLoading = true;
      updateVirtualBackupPlan({ id, plan })
        .then(res => {
          const { message } = res.data;
          this.getBackupPlanList();
          this.backupPlanModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
  },
};
</script>
<style>
.el-col .el-form-item {
  display: block;
}
</style>
<style scoped>
.margin-right5 {
  margin-right: 5px;
}
</style>

