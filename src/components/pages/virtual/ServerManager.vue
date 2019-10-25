<template>
    <div>
        <server-table :tableData="serverTableData"
                      :currentSelect.sync="currentSelect"
                      :showSelect.sync="isSelect"
                      :showDelete="true"
                      @delete="deleteServer"
                      :vm-type="vmType">
          <template slot="other">
            <el-button type="success" size="small" @click="toguide">操作说明</el-button>
            <el-button type="primary" @click="buttonClickHandler" :disabled="disabled" size="small">
              {{isSelect ? '添加备份计划' : '添加主机'}}
            </el-button>
            <el-button type="info" @click="takeOverClick" :disabled="disabled" size="small" v-if="[1, 3].includes(vmType)">
              {{isSelect ? '接管初始化' : '一键接管'}}
            </el-button>
          </template>
        </server-table>
        <backup-plan-modal type="vm"
                           :visible.sync="backupPlanCreateModalVisible"
                           :btn-loading="btnLoading"
                           @confirm="addBackupPlan"></backup-plan-modal>
        <server-modal :btn-loading="btnLoading"
                      @confirm="submitServerFn"
                      :visible.sync="serverModalVisible"></server-modal>
        <create-link-modal :btn-loading="btnLoading"
                           :selected-virtuals="currentSelect"
                           :vm-type="vmType"
                           :server-data="serverTableData"
                           @confirm="createLink"
                           :visible.sync="createLinkModalVisile"></create-link-modal>
    </div>
</template>
<script>
import { addServer, fetchServerList, deleteServer } from '@/api/host';
import {
  createMultipleVirtualBackupPlan,
  rescan,
  getVirtualByServerId,
  createLinks
} from '@/api/virtuals';
import { sockMixin } from '@/components/mixins/commonMixin';
import BackupPlanModal from '@/components/pages/virtual/BackupPlanModal';
import ServerTable from '@/components/pages/virtual/ServerTable';
import ServerModal from '@/components/modal/ServerModal';
import CreateLinkModal from '@/components/pages/virtual/takeover/CreateLinkModal';
import MutilTable from '@/components/modal/MutilTable';
import {
  virtualHostServerTypeMapping,
  serverTypeMapping,
  virtualMapping
} from '@/utils/constant';
import { setTimeout } from 'timers';
export default {
  components: {
    BackupPlanModal,
    ServerTable,
    ServerModal,
    CreateLinkModal,
    MutilTable,
  },
  mixins: [sockMixin],
  data() {
    return {
      serverTableData: [],
      currentSelect: [],
      isSelect: false,
      btnLoading: false,
      backupPlanCreateModalVisible: false,
      serverModalVisible: false,
      createLinkModalVisile: false,
      refreshBtn: false,
    };
  },
  computed: {
    disabled() {
      return this.isSelect && this.currentSelect.length === 0;
    },
    vmType() {
      return Number(Object.keys(virtualMapping).find(type =>
        this.$route.name.toLowerCase().includes(virtualMapping[type].toLowerCase())
      ));
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    toguide(){
      this.$router.push({ name: 'addManagement', query: { aId:'virtualMonitor' }})
    },
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
          this.serverTableData = this.serverTableData.filter(item => serverTypeMapping[this.vmType].includes(item.serverType));
        })
    },
    connectCallback(client) {
      this.stompClient.subscribe('/virtual-server-list', msg => {
        let { data: list } = JSON.parse(msg.body);
        if (!Array.isArray(list)) {
            this.serverTableData = [];
            this.currentSelect = [];
            return;
          }
          let ids = [];
          let tdata = list.map(e => {
            let vmList = Array.isArray(e.vmList) ? e.vmList : [];
            ids = ids.concat(vmList);
            e.disabled = false;
            e.icon = 'el-icon-refresh';
            e.delBtnIcon = 'el-icon-delete';
            return e;
          });
          this.serverTableData = tdata.filter(item => serverTypeMapping[this.vmType].includes(item.serverType));
          this.currentSelect = this.currentSelect.filter(item => ids.includes(item.id));
      });
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
              this.$router.push({ name: `${virtualMapping[this.vmType]}Backup` });
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
    createLink(data) {
      this.btnLoading = true;
      createLinks(data)
        .then(res => {
          const { message } = res.data;
          this.fetchData();
          this.createLinkModalVisile = false;
          this.$message.success(message);
          setTimeout(() => {
            this.$router.push({ name: `${virtualMapping[this.vmType]}TakeOver` });
          }, 3000);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
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
    takeOverClick() {
      if (this.isSelect) {
        this.createLinkModalVisile = true;
      } else {
        this.$router.push({ name: `${virtualMapping[this.vmType]}TakeOver` });
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
            getVirtualByServerId(scope.row.id).then(res => {
              const ids = scope.row.vmList.map(i => i.id);
              this.currentSelect = this.currentSelect.filter(e => {
                if (ids.includes(e.id)) {
                  return false;
                }
                return true;
              });
              const { data } = res.data;
              scope.row.vmList = data;
            }).catch(error => {
              this.$message.error(error);
            });
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
@import '@/style/common.scss';
</style>
<style>
</style>


