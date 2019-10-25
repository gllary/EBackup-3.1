<template>
  <section>
    <el-form inline size="medium">
      <el-form-item style="float: right">
        <el-button type="info"
                   @click="$router.push({name: 'versionList'})">版本库</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="refreshAll"
                   type="info"
                   plain>刷新</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary"
                   @click="createOne">部署</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
          <el-button type="success"
                    @click="toguide">操作说明</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="processedTableData"
              tooltip-effect="light">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="right"
                   label-width="100px"
                   inline>
            <el-form-item label="操作系统"
                          class="detailFormItem">
              <span>{{ props.row.agentOs }}</span>
            </el-form-item>
            <el-form-item label="部署路径"
                          class="detailFormItem">
              <span>{{ props.row.installPath }}</span>
            </el-form-item>
            <el-form-item label="部署时间"
                          class="detailFormItem">
              <i class="el-icon-time"></i>
              <span>{{ props.row.startTime }}</span>
            </el-form-item>
            <el-form-item label="系统用户名"
                          class="detailFormItem">
              <span>{{ props.row.user }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="代理IP"
                       width="130"
                       align="center"
                       prop="agentIp"></el-table-column>
      <el-table-column label="部署包"
                       min-width="100"
                       align="center"
                       prop="depPackage.packageName"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-popover trigger="hover"
                      placement="top">
            <span>
              {{ scope.row.depPackage.updateMsg }}
            </span>
            <div slot="reference" style="cursor: pointer">
              <i class="el-icon-info"></i>
              <span>{{ scope.row.depPackage.packageName }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="所属版本"
                       min-width="100"
                       show-overflow-tooltip
                       align="center"
                       prop="depPackage.version.versionCode">
        <template slot-scope="scope">
          <el-popover trigger="hover"
                      placement="top">
            <span>
              {{ scope.row.depPackage.version.versionMsg }}
            </span>
            <div slot="reference" style="cursor: pointer">
              <i class="el-icon-info"></i>
              <span>{{ scope.row.depPackage.version.versionCode }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="wrapper部署"
                       min-width="80"
                       align="center"
                       prop="depPackage">
        <template slot-scope="scope">
          <el-tag :type="scope.row.depPackage.isWrapper | wrapperTagFilter"
                  size="mini">
            {{ scope.row.depPackage.isWrapper | yesOrNoFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="部署方式"
                       min-width="60"
                       align="center"
                       prop="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.auto | switchManualFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部署状态"
                       min-width="60"
                       align="center"
                       prop="depState">
        <template slot-scope="scope">
          <el-tooltip effect="light"
                      :content="`${scope.row.errorMsg}`"
                      :disabled="![3, 4].includes(scope.row.depState)"
                      placement="right">
            <el-tag size="mini"
                    :type="scope.row.depState | depStateTagFilter">
              {{ scope.row.depState |  deployStateFilter }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="150"
                       align="center">
        <template slot-scope="scope">
          <el-button type="info"
                     icon="el-icon-refresh"
                     circle
                     plain
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="refreshOne(scope)"></el-button>
          <el-button type="success"
                     icon="el-icon-caret-right"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     :disabled="scope.row.depPackage.isWrapper === 2"
                     @click="startOne(scope)">
          </el-button>
          <el-button type="danger"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     :disabled="scope.row.depPackage.isWrapper === 2"
                     @click="stopOne(scope)"
                     style="padding: 9px!important">
            <div style="height: 8px; width: 8px; background-color: #fff"></div>
          </el-button>
          <el-button type="primary"
                    icon="el-icon-edit"
                    circle
                    size="mini"
                    :class="$style.miniCricleIconBtn"
                    @click="modifyOne(scope)"></el-button>
          <el-button type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                      :class="$style.miniCricleIconBtn"
                      @click="deleteOne(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 10px; text-align: right"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[5, 10, 15, 20]"
                  :page-size="pageSize"
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
    </el-pagination>
    <create-deploy-modal :visible.sync="createModalVisible"
                         :btn-loading="btnLoading"
                         :versions="versionInfos"
                         @confirm="createConfirm"></create-deploy-modal>
    <update-deploy-modal :visible.sync="updateModalVisible"
                         :select-data="selectData"
                         :btn-loading="btnLoading"
                         :versions="versionInfos"
                         @confirm="updateConfirm"></update-deploy-modal>
  </section>
</template>

<script>
import {
  fetchPackageRecords,
  fetchVersionTypes,
  createMultiPackagesRecords,
  startPackageRecord,
  stopPackageRecord,
  modifyPackageRecord,
  deletePackageRecord,
  refreshDeploys
} from '@/api/deploy';
import { paginationMixin, sortMixin } from '@/components/mixins/commonMixin';
import { yesOrNoMapping, switchManualMapping, deployStateMapping } from '@/utils/constant';
import CreateDeployModal from '@/components/pages/deploy/CreateDeployModal';
import UpdateDeployModal from '@/components/pages/deploy/UpdateDeployModal';
import { setTimeout } from 'timers';
export default {
  name: 'DeployManager',
  mixins: [paginationMixin, sortMixin],
  components: {
    CreateDeployModal,
    UpdateDeployModal
  },
  data() {
    return {
      tableData: [],
      versionInfos: [],
      operate: 'create',
      selectData: {},
      createModalVisible: false,
      updateModalVisible: false,
      btnLoading: false,
      defaultSort: { prop: 'startTime', order: 'descending' },
    }
  },
  created() {
    this.fetchData();
  },
  filters: {
    yesOrNoFilter(type) {
      return yesOrNoMapping[type];
    },
    deployStateFilter(state) {
      return deployStateMapping[state];
    },
    switchManualFilter(type) {
      return switchManualMapping[type]
    },
    depStateTagFilter(type) {
      if(type === 2) {
        return 'success';
      } else if ([3, 4].includes(type)) {
        return 'danger';
      } else if (type === 5) {
        return 'info';
      }
      return 'warning';
    },
    wrapperTagFilter(type) {
      if(type === 1) {
        return 'primary';
      }
      return 'info';
    }
  },
  methods: {
    toguide(){
      this.$router.push({ name: 'deploymentManage', query: { aId:'deploymentManage' }})
    },
    fetchData() {
      fetchPackageRecords()
        .then(res => {
          const { data } = res.data;
          this.tableData = data;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchVersionTypes()
        .then(res => {
          const { data } = res.data;
          this.versionInfos = data.versions;
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    createOne() {
      this.createModalVisible = true;
    },
    modifyOne({ row }) {
      this.selectData = row;
      this.updateModalVisible = true;
    },
    deleteOne({ row }) {
      this.$confirm('此操作将卸载该部署包, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const opt = {
            type: 'info',
            message: `正在卸载${row.agentIp}的部署包中，请稍后`,
            duration: 0
          }
          const { close } = this.$message(opt);
          deletePackageRecord(row.id)
            .then(res => {
              const { message } = res.data;
              opt.type = 'success';
              opt.message = message;
              setTimeout(close, 1000);
              this.fetchData();
            })
            .catch(() => {
              opt.type = 'error';
              opt.message = error;
              setTimeout(close, 1000);
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
    },
    startOne({ row }) {
      this.$confirm('此操作将启动该部署包, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const opt = {
            type: 'info',
            message: `正在启动${row.agentIp}的部署包中，请稍后`,
            duration: 0
          }
          const { close } = this.$message(opt);
          startPackageRecord(row.id)
            .then(res => {
              const { message } = res.data;
              opt.type = 'success';
              opt.message = message;
              setTimeout(close, 1000);
              this.fetchData();
            })
            .catch(() => {
              opt.type = 'error';
              opt.message = error;
              setTimeout(close, 1000);
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
    },
    stopOne({ row }) {
      this.$confirm('此操作将停止该部署包, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const opt = {
            type: 'info',
            message: `正在停止${row.agentIp}的部署包中，请稍后`,
            duration: 0
          }
          const { close } = this.$message(opt);
          stopPackageRecord(row.id)
            .then(res => {
              const { message } = res.data;
              opt.type = 'success';
              opt.message = message;
              setTimeout(close, 1000);
              this.fetchData();
            })
            .catch(() => {
              opt.type = 'error';
              opt.message = error;
              setTimeout(close, 1000);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
    },
    refreshAll() {
      const ids = this.tableData.map(v => v.id);
      this.refresh(ids);
    },
    refreshOne({ row }) {
      const ids = [row.id];
      this.refresh(ids);
    },
    refresh(ids) {
      const opt = {
        type: 'info',
        message: '正在刷新中，请稍后',
        duration: 0
      }
      const { close } = this.$message(opt);
      refreshDeploys(ids)
        .then(res => {
          const { data: deploys, message } = res.data;
          this.tableData.forEach((v, index) => {
            const deploy = deploys.find(deploy => deploy.id  === v.id);
            if(deploy) {
              this.tableData.splice(index,
              1,
              deploy);
            }
          });
          opt.type = 'success';
          opt.message = message;
          setTimeout(close, 1000);
        })
        .catch(error => {
          opt.type = 'error';
          opt.message = error;
          setTimeout(close, 1000);
        })
    },
    createConfirm(requestData) {
      this.btnLoading = true;
      createMultiPackagesRecords(requestData)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.fetchData();
          this.createModalVisible = false;
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    updateConfirm(requestData) {
      this.btnLoading = true
      modifyPackageRecord(requestData)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.updateModalVisible = false;
          this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>
<style scoped>
.detailFormItem {
  width: 40%;
  margin-right: 0;
  margin-bottom: 0;
}
.detailFormItem:nth-child(2n){
  width: 59%;
}
</style>

