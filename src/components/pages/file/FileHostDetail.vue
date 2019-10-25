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
                <!-- <el-dropdown size="mini"
                             trigger="click"
                             placement="bottom"
                             @command="addPlanBtnClick">
                  <el-button size="mini"
                             plain>添加计划
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    文件系统备份计划 可以多次添加
                    <el-dropdown-item command="backupPlan">备份计划</el-dropdown-item>
                    <el-dropdown-item command="restorePlan" disabled>恢复计划</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
                <el-button size="mini" @click="addPlanBtnClick">添加备份计划</el-button>
                <el-button size="mini"
                           type="primary"
                           @click="stopPlans">终止计划</el-button>
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
                  <el-form-item label="主机IP：">
                    <span>{{ details.hostIp }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="操作系统：">
                    <span>{{ details.osName+`${details.systemVersion?'-'+details.systemVersion:''}` }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-right: 5px;">
                <el-col :span="8">
                  <el-form-item label="别名：">
                    <span>{{ details.hostAlias }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所属系统：">
                    <span>{{ details.application }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </header>
    <tab-panels @switchpane="switchPane"
                :planFilterForm="planFilterForm"
                :type="systemType"
                :tab="activeTab">
      <template slot="backupCard">
        <backup-card :id="plan.id"
                     v-for="plan in filteredBackupPlans"
                     :key="plan.id"
                     :backup-plan="plan"
                     :type="systemType"
                     @refresh="refreshSingleBackupPlan"
                     @deletePlan="deleteBackupPlan"
                     @updatePlan="selectBackupPlan(plan.id)"></backup-card>
      </template>
      <template slot="restoreCard">
        <restore-card :id="plan.id"
                     v-for="plan in filteredRestorePlans"
                     :key="plan.id"
                     :restore-plan="plan"
                     :type="systemType"
                     @refresh="refreshSingleRestorePlan"
                     @deletePlan="deleteRestorePlan"></restore-card>
      </template>
      <template slot="backupResult">
        <backup-result-list :data="results"
                            :type="systemType"
                            @single-restore-btn-click="initSingleRestoreModal"
                            @refresh="refreshResults"></backup-result-list>
      </template>
      <template slot="restoreRecord">
        <restore-records :records="restoreRecords"
                         :type="systemType"
                         @restoreinfo:refresh="updateRestorePlanRecords"></restore-records>
      </template>
    </tab-panels>
    <backup-plan-modal :btn-loading="btnLoading"
                       :host-id="hostId"
                       :type="systemType"
                       :systems="details.systems"
                       :volumes="details.volumes"
                       :filePath="details.sourcePath"
                       :visible.sync="backupPlanModalVisible"
                       @confirm="confirmCallback"
                       :action="action"
                       :backup-plan="selectedBackupPlan"></backup-plan-modal>
    <single-restore-modal :btn-loading="btnLoading"
                          :restoreType="restoreResults.backupType"
                          :type="restoreResults.type"
                          :id="restoreResults.id"
                          :host-id="hostId"
                          :source-path="retoreSourcePath"
                          :visible.sync="singleRestoreCreateModalVisible"
                          @confirm="singleConfirmCallback"></single-restore-modal>
  </section>
</template>
<script>
import TabPanels from '@/components/common/TabPanels';
import BackupCard from '@/components/pages/file/BackupCard';
import RestoreCard from '@/components/pages/file/RestoreCard';
import BackupResultList from '@/components/pages/file/BackupResultList';
import RestoreRecords from '@/components/pages/file/RestoreRecords';
import BackupPlanModal from '@/components/pages/file/BackupPlanModal';
import SingleRestoreModal from '@/components/pages/file/SingleRestoreModal';
import IIcon from '@/components/IIcon';
import { applyFilterMethods } from '@/utils/common';
import { sortMixin, sockMixin } from '@/components/mixins/commonMixin';
import themeMixin from '@/components/mixins/themeMixins';
import throttle from 'lodash/throttle';
import {
  fetchOne,
  fetchBackupPlans,
  fetchBackupResults,
  fetchRestorePlans,
  fetchRestoreRecords,
  updateBackupPlan,
  createBackupPlan,
  deleteBackupPlan,
  createSingleRestorePlan,
  deleteSingleRestorePlan,
  fetchPathByResultId,
  fetchPathByPlanId,
  fetchBackupOperation,
  fetchRestoreOperation,
  stopAllPlans,
  fmtBackupPlan,
  fmtRestorePlan,
  timePoints2Obj
} from '@/api/file';
const OperateBackupPlan = {
  create: createBackupPlan,
  update: updateBackupPlan
}
// const RestorePath = {
//   restorePlan: fetchPathByPlanId,
//   restoreResult: fetchPathByResultId
// }
export default {
  name: 'FileHostDetail',
  props: ['id'],
  mixins: [sortMixin, sockMixin, themeMixin],
  data() {
    return {
      infoLoading: true,
      backupPlans: [],
      restorePlans: [],
      restoreRecords: [],
      results: [],
      timer: null,
      retoreSourcePath: [],
      selectedBackupPlan: {},
      btnLoading: false,
      backupPlanModalVisible: false,
      action: 'create',
      activeTab: 'plans',
      restoreResults: {},
      singleRestoreCreateModalVisible: false,
      details: {
        host: {}
      },
      planFilterForm: {
        hiddenCompletePlan: false,
        planType: 'backup',
      },
      updateResults: this.throttleMethod(() => {
        this.fetchBackupResults();
      }),
      updateRestorePlanAndRecords: this.throttleMethod(() => {
        this.fetchRestorePlans();
        this.fetchRestoreRecords();
      }),
      // selectedBackupPlanId: -1,
      // TODO: 暂时使用一个data变量存储选择的计划id，也许有更优雅的实现方式
      throttleRefreshBackup: this.throttleMethod(id => {
        fetchBackupOperation(id)
          .then(response => {
            const { data } = response.data;
            Object.assign(
              this.backupPlans.find(
                plan => plan.id === id
              ),
              data
            );
          })
          .catch(error => {
            this.$message.error(error);
          });
      }),
      // selectedRestorePlanId: -1,
      throttleRefreshRestore: this.throttleMethod(id => {
        fetchRestoreOperation(id)
          .then(response => {
            const { data } = response.data;
            Object.assign(
              this.restorePlans.find(
                plan => plan.id === id
              ),
              data
            );
          })
          .catch(error => {
            this.$message.error(error);
          });
      }),
    }
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.setTimer(this.timer);
  },
  destroyed() {
    this.clearTimer(this.timer);
  },
  methods: {
    fetchData() {
      this.fetchDetail();
      this.fetchBackupPlanList();
      this.fetchRestorePlanList();
      this.fetchBackupResults();
      this.fetchRestoreRecords();
    },
    connectCallback(client) {
      let subscription = this.stompClient.subscribe(`/file/${this.id}/send-backup-plans`, msg => { // 订阅服务端提供的某个topic
        let {data} = JSON.parse(msg.body);
        data = data.map(p => {
          if (p.config.timePoints) {
            p.config.timePoints = timePoints2Obj(p.config.timePoints);
          }
          return fmtBackupPlan(p);
        });
        this.backupPlans = Array.isArray(data) ? this.sortFn(data, 'createTime', 'descending') : [];
        // console.log(data);
        // 取消订阅
        // subscription.unsubscribe();
      });
      // this.stompClient.subscribe(`/file/${this.id}/send-restore-plans`, msg => { // 订阅服务端提供的某个topic
      //   let {data} = JSON.parse(msg.body);
      //   data = data.map(p => fmtRestorePlan(p));
      //   this.restorePlans = Array.isArray(data) ? this.sortFn(data, 'startTime', 'descending') : [];
      // });
    },
    fetchDetail() {
      fetchOne(this.id)
        .then(res => {
          const { data } = res.data;
          this.details = data;
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.infoLoading = false;
        });
    },
    fetchBackupPlanList() {
      fetchBackupPlans(this.id)
        .then(res => {
          const { data: plans } = res.data;
          this.backupPlans = Array.isArray(plans) ? this.sortFn(plans, 'createTime', 'descending') : [];
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    fetchRestorePlanList() {
      fetchRestorePlans(this.id)
        .then(res => {
          const { data: plans } = res.data;
          this.restorePlans = Array.isArray(plans) ? this.sortFn(plans, 'startTime', 'descending') : [];
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    fetchBackupResults() {
      fetchBackupResults(this.id)
        .then(res => {
          const { data: results } = res.data;
          this.results = Array.isArray(results) ? this.sortFn(results, 'createTime', 'descending') : [];
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    fetchRestoreRecords() {
      fetchRestoreRecords(this.id)
        .then(res => {
          const { data: records } = res.data;
          this.restoreRecords = Array.isArray(records) ? records : [];
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    // 节流函数 5s只触发一次
    throttleMethod(fn) {
      return throttle(fn, 5000, {
        leading: true,
        trailing: false
      });
    },
    addPlanBtnClick(command) {
      // if(command === 'backupPlan') {
        this.backupPlanModalVisible = true;
        this.action = 'create';
      // }
    },
    refreshTime() {
      // this.fetchBackupPlanList();
      this.fetchRestorePlanList();
    },
    clearTimer() {
      clearInterval(this.timer);
    },
    setTimer() {
      this.clearTimer();
      this.timer = setInterval(() => {
        this.refreshTime();
      }, 20000);
    },
    // 刷新单个备份计划
    refreshSingleBackupPlan(planId) {
      this.throttleRefreshBackup(planId);
    },
    // 刷新单个恢复计划
    refreshSingleRestorePlan(planId) {
      this.throttleRefreshRestore(planId);
    },
    // 删除备份计划
    deleteBackupPlan(planId) {
      deleteBackupPlan(planId).then(() => {
        // this.backupPlans.splice(
        //   this.backupPlans.findIndex(plan => plan.id === planId),
        //   1
        // );
        this.$message.success('删除成功');
      }).catch(error => {
        this.$message.error(error);
      });
    },
    // 删除恢复计划
    deleteRestorePlan(planId) {
      deleteSingleRestorePlan(planId)
        .then(() => {
          this.restorePlans.splice(
            this.restorePlans.findIndex(plan => plan.id === planId),
            1
          );
          this.$message.success('删除成功');
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    // 更新备份计划
    selectBackupPlan(backupPlanId) {
      this.selectedBackupPlan = this.backupPlans.find(plan => plan.id === backupPlanId);
      this.backupPlanModalVisible = true;
      this.action = 'update';
    },
    // 添加恢复计划(立即执行)
    initSingleRestoreModal(id, backupType, type) {
      this.restoreResults = Object.assign({}, this.restoreResults, {id, backupType, type});
      if(type === 'restoreResult' && backupType === 1) { // 恢复单个文件计划
        fetchPathByResultId(this.restoreResults.id)
          .then(res => {
            const { data: path } = res.data;
            this.retoreSourcePath = path;
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {
            this.singleRestoreCreateModalVisible = true;
          })
      } else if(type === 'restorePlan' && backupType === 1) { // 恢复单个文件备份集
        const readyToRestorePlan = this.results.find(result => result.id === id);
        this.retoreSourcePath = readyToRestorePlan.backupFiles.map(file => file.sourcePath);
        this.singleRestoreCreateModalVisible = true;
      } else {
        this.retoreSourcePath = [];
        this.singleRestoreCreateModalVisible = true;
      }
    },
    // 刷新恢复记录
    updateRestorePlanRecords() {

    },
    confirmCallback(plan, type) {
      this.btnLoading = true;
      const id = type === 'create'?this.id:plan.id
      OperateBackupPlan[type]({ id, plan })
         .then(res => {
          const { message } = res.data;
          this.backupPlanModalVisible = false;
          this.activeTab = 'plans';
          this.planFilterForm.planType = 'backup';
          this.$message.success(message);
          // this.fetchBackupPlanList();
        })
        .catch(error => {
          this.$message.error(error);
          return false;
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    selectedBackupResultId() {

    },
    // 确认恢复单个备份集或计划
    singleConfirmCallback(id,plan) {
      this.btnLoading = true;
      createSingleRestorePlan({id, plan})
        .then(res => {
          const { message } = res.data;
          this.singleRestoreCreateModalVisible = false;
          this.activeTab = 'plans';
          this.planFilterForm.planType = 'restore';
          this.$message.success(message);
          this.fetchRestorePlanList();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    switchPane(name) {
      if (name === 'results') {
        this.updateResults();
      }
      this.activeTab = name;
    },
    refreshResults() {
      this.fetchBackupResults();
    },
    stopPlans() {
      this.$confirm(
        `此操作将终止${this.details.hostName}下的所有计划, 是否继续？`,
        '提示',
        {
          type: 'warning',
        }
      )
        .then(() => {
          stopAllPlans(this.id)
            .then(res => {
              const { message } = res.data;
              this.$message.success(message);
              this.fetchData();
            })
            .catch(error => {
              this.$message.error(error);
            })
        })
        .catch(() => {
          this.$message.info('已取消操作!');
        });
    }
  },
  computed: {
    systemType() {
      return this.details && this.details.osName
        ? this.details.osName.toLowerCase()
        : 'windows';
    },
    hostId() {
      return Number(this.id);
    },
    // 筛选后得备份计划
    filteredBackupPlans() {
      if (this.planFilterForm.planType !== 'backup') {
        return [];
      }
      const filterMethods = [];
      if (this.planFilterForm.hiddenCompletePlan) {
        filterMethods.push(plan => plan.state !== 2);
      }
      return applyFilterMethods(this.backupPlans, filterMethods);
    },
    // 筛选后得恢复计划
    filteredRestorePlans() {
      if (this.planFilterForm.planType !== 'restore') {
        return [];
      }
      const filterMethods = [];
      if (this.planFilterForm.hiddenCompletePlan) {
        filterMethods.push(plan => plan.state !== 2);
      }
      return applyFilterMethods(this.restorePlans, filterMethods);
    },
  },
  components: {
    IIcon,
    TabPanels,
    BackupCard,
    BackupResultList,
    RestoreRecords,
    BackupPlanModal,
    SingleRestoreModal,
    RestoreCard
  }
}
</script>
