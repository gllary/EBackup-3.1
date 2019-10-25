<template>
  <section>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="insql"
                    class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1 :class="details.role === 1 ? 'primaryLink' : 'viceLink'">{{details.name}}
                  <i-icon v-if="details.role !== 0"
                          :name="roleIconName(this.details.role)"
                          :class="$style.roleIconHeader"></i-icon>
                </h1>
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
                    <el-dropdown-item command="restore">恢复计划</el-dropdown-item>
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
                <el-col :span="16">
                  <el-col :span="12">
                    <el-form-item label="数据库名：">
                      <span>{{ details.instanceName }}</span>
                    </el-form-item>
                    <el-form-item label="端口号：">
                      <span>{{ details.dbPort }}</span>
                    </el-form-item>
                    <el-form-item label="数据库状态：">
                      <el-tag :type="databaseStateStyle(details.state)"
                              size="mini">{{ details.state | databaseStateFilter }}</el-tag>
                    </el-form-item>
                    <el-form-item label="所属系统：">
                      <span>{{ details.application }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="主机名：">
                      <span>{{ details.host.name }}</span>
                    </el-form-item>
                    <el-form-item label="操作系统：">
                      <span>{{ judgeOsName(details.host) }}</span>
                    </el-form-item>
                    <el-form-item label="所属设备：">
                      <span>{{ details.host.name }}</span>
                    </el-form-item>
                    <el-form-item label="设备IP：">
                      <span>{{ details.host.hostIp }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="数据库版本：">
                      <span>{{ details.dbVersion }}</span>
                    </el-form-item>
                  </el-col>
                </el-col>
                <template v-if="!!link.id">
                  <el-col :span="8"
                          :class="$style.linkInfo">
                    <h4 style="margin: 10px 0 7px;">连接信息</h4>
                    <el-form-item>
                      <i-icon :name="`switch-${link.state}`"
                              :class="$style.switchIcon"></i-icon>
                      <span>{{ link.state | linkStateFilter }}</span>
                    </el-form-item>
                    <el-form-item>
                      <i-icon :name="roleIconName(link.oppsiteDatabase && link.oppsiteDatabase.role)"
                              :class="$style.roleIconOppsition"></i-icon>
                      <router-link :to="`/db/insql/${ link.oppsiteDatabase && link.oppsiteDatabase.id}`"
                                   :class="link.oppsiteDatabase.role === 1 ? 'primaryLink' : 'viceLink'">
                        {{ link.oppsiteDatabase && link.oppsiteDatabase.name }}
                      </router-link>
                    </el-form-item>

                  </el-col>
                  <router-link :to="`/db/insql/takeover/${link.id}`"
                               :class="$style.moreLink">查看更多</router-link>
                </template>
              </el-row>
            </el-form>
          </el-col>
        </el-row>

      </div>
    </header>
    <tab-panels @switchpane="switchPane" :planFilterForm="planFilterForm">
      <template slot="backupCard">
        <backup-card :id="plan.id"
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
                            @single-restore-btn-click="initSingleRestoreModal"></backup-result-list>
      </template>
      <template slot="restoreRecord">
        <restore-records :restore-plan="restorePlans"
                         :records="restoreRecords"
                         @restoreinfo:refresh="updateRestorePlanAndRecords"></restore-records>
      </template>
    </tab-panels>
    <backup-plan-modal  :btn-loading="btnLoading"
                        :visible.sync="backupPlanModalVisible"
                        @confirm="confirmCallback"
                        :action="action"
                        :backup-plan="selectedBackupPlan">
    </backup-plan-modal>

    <restore-plan-modal :btn-loading="btnLoading"
                        :details="details"
                        :visible.sync="restorePlanModalVisible"
                        @confirm="restoreConfirmCallback"
                        :action="restoreAction"
                        :host-in-links="hostInLinks"
                        :restore-plan="selectedRestorePlan">
    </restore-plan-modal>
    <single-restore-modal :btn-loading="btnLoading"
                          :details="details"
                          :result-id="selectedBackupResultId"
                          :visible.sync="singleRestoreCreateModalVisible"
                          :host-in-links="hostInLinks"
                          @confirm="singleConfirmCallback">
    </single-restore-modal>
    
  </section>
</template>
<script>
import {
  fetchLink,
} from '@/api/insql';
import takeoverMixin from '@/components/mixins/takeoverMixins';
import { windowsTypeMapping } from '@/utils/constant';
import { detailPageMixin } from '@/components/mixins/dbDetailsPageMixin';
import BackupPlanModal from '@/components/pages/insql/BackupPlanModal';
import RestorePlanModal from '@/components/pages/insql/RestorePlanModal';
import SingleRestoreModal from '@/components/pages/insql/SingleRestoreModal';
import BackupCard from '@/components/pages/insql/BackupCard';
import BackupResultList from '@/components/pages/insql/BackupResultList';
import RestoreCard from '@/components/pages/insql/RestoreCard';
import RestoreRecords from '@/components/pages/insql/RestoreRecords';
import { fetchLinks } from '@/api/insql';

export default {
  name: 'InSqlDetail',
  mixins: [detailPageMixin, takeoverMixin],
  components: {
    BackupPlanModal,
    RestorePlanModal,
    SingleRestoreModal,
    BackupCard,
    BackupResultList,
    RestoreCard,
    RestoreRecords
  },
  data() {
    return {
      type: 'insql',
      hostInLinks: []
    };
  },
  watch: {
    '$route' (to, from) {
      this.fetchData();
    }
  },
  methods: {
    fetchLink(){
      fetchLink(this.id).then(res => {
        const { data: link } = res.data;
        const { id, state, errMsg, tempPort } = link;
        this.link = { id, state, errMsg, tempPort };
        const {host} = this.details;
        if (host) {
          if (host.hostType === 1) {
            this.link.oppsiteDatabase = link.viceDatabase;
          }else if (host.hostType === 2) {
            this.link.oppsiteDatabase = link.primaryDatabase;
          }
        }
        // if (this.details.role === 1) {
        //   this.link.oppsiteDatabase = link.viceDatabase;
        // } else if (this.details.role === 2) {
        //   this.link.oppsiteDatabase = link.primaryDatabase;
        // }
      })
      .catch(error => {
        this.$message.error(error);
      });
    },
    fetchLinks() { // 恢复设备不能选择一键接管设备
      fetchLinks()
        .then(res => {
          const { data: links } = res.data;
          const primaryHostIds = links.map(link => link.primaryHost.id);
          const viceHostIds = links.map(link => link.viceHost.id);
          this.hostInLinks = primaryHostIds.concat(viceHostIds);
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    judgeOsName(data){
      let str = data.osName;
      if(data.osName === 'Windows' && data.databaseType === 11 && windowsTypeMapping[data.windowsType]){
        str += (' ' + windowsTypeMapping[data.windowsType]);
      }
      return str;
    },
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
@import '@/assets/theme/variable.scss';
.roleIconHeader {
  padding: 5px;
  margin: -5px 5px;
  vertical-align: -0.2em;
}
.roleIconOppsition {
  vertical-align: -0.2em;
  padding: 3px;
  margin: -3px 0 -3px 1px;
}
.switchIcon {
  width: 1.7em;
  height: 1.7em;
  vertical-align: -0.5em;
}
.databaseLink {
  composes: link;
  font-size: 1.2em;
  // color: rgb(170, 84, 27);
}
.linkInfo {
  text-align: right;
}
.moreLink {
  composes: link;
  font-size: 0.9em;
  position: absolute;
  bottom: 0;
  right: 0;
  @include primary-color;
}
</style>