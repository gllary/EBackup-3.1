<template>
    <div>
        <el-row style="margin-bottom:10px;">
            <el-col :span="12" style="text-align:left;">
                <el-button type="primary" @click="isSelect = !isSelect" size="small"
                    >{{isSelect ? '返回' : '已选虚拟机'}}</el-button>
            </el-col>
            <el-col :span="12" style="text-align:right;">
                <el-button type="primary" @click="buttonClickHandler" :disabled="disabled" size="small"
                    >{{isSelect ? '添加备份计划' : '添加主机'}}</el-button>
            </el-col>
        </el-row>
        <el-table v-show="!isSelect" :data="serverTableData" ref="serverTable">
             <el-table-column type="expand">
                    <template slot-scope="props">
                        <mutil-table :tableData="props.row.vmList"
                                     :ref="props.row.id"
                                     :refTable="props.row.serverName"
                                     :selectData.sync="currentSelect"
                                     :vm-type="vmType"
                                     @refresh="refreshOneServer(props.row)"></mutil-table>
                    </template>
            </el-table-column>
            <el-table-column label="主机名" prop="serverName" align="left"
                        min-width="200">
            </el-table-column>
            <el-table-column prop="hostName" align="left"
                            label="所属设备"
                            min-width="200">
            </el-table-column>
            <el-table-column prop="serverIp" align="left"
                            label="主机IP地址"
                            min-width="200">
            </el-table-column>
            <el-table-column v-if="false" prop="createDate" align="left"
                            label="创建时间"
                            min-width="200">
            </el-table-column>
            <el-table-column prop="serverType"
                label="主机类型"
                :formatter="serverTypeFormat"
                min-width="150"
                align="left"></el-table-column>
            <el-table-column label="操作"
                            min-width="150"
                            header-align="center"
                            align="center">
                <template slot-scope="scope">
                    <el-tooltip 
                            content="重新扫描"
                            placement="top"
                            effect="light">
                        <el-button type="primary"
                                    :icon="scope.row.icon"
                                    circle
                                    :disabled="scope.row.disabled"
                                    size="mini"
                                    :class="$style.miniCricleIconBtn"
                                    @click="refresh(scope)"></el-button>
                    </el-tooltip>
                    <el-tooltip 
                            content="删除"
                            placement="top"
                            effect="light">
                        <el-button type="danger"
                                    :icon="scope.row.delBtnIcon"
                                    :disabled="scope.row.disabled"
                                    circle
                                    size="mini"
                                    :class="$style.miniCricleIconBtn"
                                    @click="deleteServer(scope)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <mutil-table v-show="isSelect"
                     :tableData="currentSelect"
                     refTable="selectTable"
                     :selectData.sync="currentSelect"
                     :vm-type="vmType"></mutil-table>
        <backup-plan-modal type="vm"
                     :visible.sync="backupPlanCreateModalVisible"
                     :btn-loading="btnLoading"
                     @confirm="addBackupPlan"></backup-plan-modal>
        <server-modal :btn-loading="btnLoading"
            @confirm="submitServerFn"
            :visible.sync="serverModalVisible">
        </server-modal>
    </div>
    
</template>
<script>
import { addServer, fetchServerList, deleteServer } from '@/api/host';
import {
  createMultipleVirtualBackupPlan,
  rescan,
  getVirtualByServerId,
} from '@/api/virtuals';
import BackupPlanModal from '@/components/pages/vm/BackupPlanModal';
import ServerModal from '@/components/modal/ServerModal';
import MutilTable from '@/components/modal/MutilTable';
import { virtualHostServerTypeMapping } from '@/utils/constant';
export default {
  components: {
    BackupPlanModal,
    ServerModal,
    MutilTable,
  },
  data() {
    return {
      serverTableData: [],
      currentSelect: [],
      isSelect: false,
      btnLoading: false,
      backupPlanCreateModalVisible: false,
      serverModalVisible: false,
      refreshBtn: false,
    };
  },
  computed: {
    disabled() {
      return this.isSelect && this.currentSelect.length === 0;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchServerList()
        .then(res => {
          const { data } = res.data;
          if (!Array.isArray(data)) {
            this.serverTableData = [];
            this.currentSelect = [];
            return;
          }
          let tdata = data.map(e => {
            e.disabled = false;
            e.icon = 'el-icon-refresh';
            e.delBtnIcon = 'el-icon-delete';
            return e;
          });
          this.serverTableData = tdata;
          this.currentSelect = [];
          // this
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          if(this.$route.name === 'virtualCollectManager') {
            this.serverTableData = this.serverTableData.filter(item => [1, 2].includes(item.serverType));
          } else {
            this.serverTableData = this.serverTableData.filter(item => item.serverType === 3);
          }
        })
    },
    addBackupPlan(data) {
      let plan = Object.assign({}, data);
      let vmIds = this.currentSelect.map(e => {
        return e.id;
      });
      plan.vmList = vmIds;
      this.btnLoading = true;
      createMultipleVirtualBackupPlan(plan)
        .then(res => {
          const { message } = res.data;
          this.backupPlanCreateModalVisible = false;
          this.$confirm('备份计划添加成功，是否跳转到备份计划页面', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'success',
          })
            .then(() => {
              if(this.$route.name === 'virtualCollectManager') {
                this.$router.push({ name: 'virtualBackup' });
              } else {
                this.$router.push({ name: 'hwVirtualBackup' });
              }
            })
            .catch(action => {});
        })
        .catch(error => {
          this.$message.error(error);
          return false;
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    submitServerFn(formData) {
      let server = Object.assign({}, formData);
      const h = this.$createElement;
      this.$msgbox({
        title: '警告',
        message: h('p', null, [
          h('span', null, '当前添加主机的类型为'),
          h(
            'i',
            { style: 'color:rgb(158, 158, 22)' },
            virtualHostServerTypeMapping[server.serverType]
          ),
          h('span', null, '，请确认是否继续？'),
        ]),
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showCancelButton: true,
      })
        .then(action => {
          this.btnLoading = true;
          addServer(server)
            .then(res => {
              const { data, message } = res.data;
              this.btnLoading = false;
              this.serverModalVisible = false;
              this.$confirm(
                '主机添加成功，请确认是否需要扫描虚拟机？',
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'success',
                  showCancelButton: true,
                  beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true;
                      instance.confirmButtonText = '扫描中...';
                      instance.showCancelButton = false;
                      if (server.serverType === 3) {
                        setTimeout(() => {
                          this.rescanVm(data).then(() => {
                            done();
                            instance.confirmButtonLoading = false;
                            instance.showCancelButton = true;
                          });
                        }, 30000);
                      } else {
                        this.rescanVm(data).then(() => {
                          done();
                          instance.confirmButtonLoading = false;
                          instance.showCancelButton = true;
                        });
                      }
                    } else {
                      done();
                    }
                  },
                }
              )
                .then(action => {
                  this.fetchData();
                })
                .catch(() => {
                  this.fetchData();
                });
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              this.btnLoading = false;
            });
        })
        .catch(() => {
          return;
        });
    },
    // 刷新单个主机下的虚拟机列表
    refreshOneServer(row) {
      getVirtualByServerId(row.id).then(res => {
        const ids = row.vmList.map(i => i.id);
        this.currentSelect = this.currentSelect.filter(e => {
          if (ids.includes(e.id)) {
            return false;
          }
          return true;
        });
        const { data } = res.data;
        row.vmList = data;
      }).catch(error => {
        this.$message.error(error);
      });
    },
    rescanVm(data){
      return rescan(data)
        .then(resp => {
          this.$message.success(resp.data.message);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    buttonClickHandler() {
      if (this.isSelect) {
        this.backupPlanCreateModalVisible = true;
      } else {
        this.serverModalVisible = true;
      }
    },
    serverTypeFormat(row, column, cellValue, index) {
      return virtualHostServerTypeMapping[cellValue];
    },
    refresh(scope) {
      scope.row.disabled = true;
      scope.row.icon = 'el-icon-loading';
      const type = scope.row.serverType;
      const time = type === 3 && scope.row.vmList.length === 0  ? 30000 : 0;
      setTimeout(() => {
        rescan(scope.row)
          .then(res => {
            this.refreshOneServer(scope.row);
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {
            scope.row.disabled = false;
            scope.row.icon = 'el-icon-refresh';
          });
      }, time);
    },
    deleteServer(scope) {
      this.$confirm('请确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          scope.row.disabled = true;
          scope.row.delBtnIcon = 'el-icon-loading';
          deleteServer(scope.row.id)
            .then(res => {
              this.$message.success(res.data.message);
              this.fetchData();
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              scope.row.disabled = false;
              scope.row.delBtnIcon = 'el-icon-delete';
            });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
<style>
</style>