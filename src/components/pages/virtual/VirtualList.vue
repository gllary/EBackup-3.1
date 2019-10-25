<template>
  <section>
    <div style="margin-bottom: 22px;">
      <el-row>
        <el-col :span="6" >
          <el-input v-if="!buttonflag" placeholder="请输入名称" v-model="inputSearch" @keyup.enter.native="searchByName" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
          </el-input>
          <template v-else>
            <el-button size="small" type="primary" @click="backupPlanCreateModalVisible=true" :disabled="currentSelectDb.length ? false : true">
              添加备份计划
            </el-button>
            <el-button type="info"
                       size="small"
                       v-if="[1, 3].includes(vmType)"
                       @click="createTakeOverLink">接管初始化</el-button>
          </template>
        </el-col>
        <el-col :span="18" style="text-align:right">
          <el-button type="success" size="small" @click="toguide">操作说明</el-button>
          <el-button size="small" type="primary" @click="buttonClick" >
            {{buttonflag ? '返回' : '查看已选虚拟机'}}
          </el-button>
          <el-button size="small" type="info"
                     v-if="!buttonflag && [1, 3].includes(vmType)"
                     @click="jumpToTakeOver">
            一键接管
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="processDbTableData" ref="dbTable"
              @select="selectDbChangeFn"
              @select-all="selectAll"
              @sort-change="sortChangeFn"
              :default-sort="defaultSort"
              style="width: 100%">
      <el-table-column
          type="selection"
          :selectable="selectFn"
          align="center"
          width="55">
      </el-table-column>
      <el-table-column label="序号"
                       width="50"
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pagesize}}
        </template>
      </el-table-column>
      <el-table-column label="名称"
                       header-align="center"
                       align="center"
                       prop="vmName"
                       sortable="custom"
                       min-width="200">
        <template slot-scope="scope">
          <router-link :to="`${scope.row.id}`"
                        append
                        class="routerLink">{{scope.row.vmName}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="vmPath"
                       label="路径"
                       header-align="center"
                       align="center"
                       min-width="200"></el-table-column>
      <el-table-column prop="vmHostName"
                       label="所属物理主机"
                       min-width="150"
                       header-align="center"
                       align="center"></el-table-column>
      <el-table-column prop="bootState"
                         label="状态"
                         align="center"
                         v-if="[1, 3].includes(vmType)">
          <template slot-scope="scope">
            <el-tag size="mini"
                    :type="scope.row.bootState | bootStateTagFilter">
                    {{ bootStateMapping[scope.row.bootState] ? bootStateMapping[scope.row.bootState] : '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bootMode"
                         label="启动方式"
                         align="center"
                         v-if="[1, 3].includes(vmType)">
          <template slot-scope="scope">
            <span>{{ bootModeMapping[scope.row.bootMode] ? bootModeMapping[scope.row.bootMode] : '未知' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="100"
                         v-if="[1, 3].includes(vmType)"
                         align="center">
            <template slot-scope="scope">
                                <el-button type="success"
                           icon="el-icon-video-play"
                           circle
                           size="mini"
                           :class="$style.miniCricleIconBtn"
                           v-if="(!scope.row.bootState || [0, 2].includes(scope.row.bootState) && [1, 3].includes(vmType))"
                           @click="modifyBootState(scope.row)"></el-button>
                <el-button type="danger"
                           icon="el-icon-video-pause"
                           circle
                           size="mini"
                           :class="$style.miniCricleIconBtn"
                           v-if="scope.row.bootState === 1 && [1, 3].includes(vmType)"
                           @click="modifyBootState(scope.row)"></el-button>
                <el-button type="warning"
                           disabled
                           icon="el-icon-loading"
                           circle
                           size="mini"
                           :class="$style.miniCricleIconBtn"
                           v-if="['starting', 'stopping'].includes(scope.row.bootState) && [1, 3].includes(vmType)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pagesize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          v-if="total"
          :total="total">
        </el-pagination>
      </div>
      <backup-plan-modal  :btn-loading="btnLoading"
                          :vm-type="vmType"
                          :visible.sync="backupPlanCreateModalVisible"
                          @confirm="addBackupPlan"
                          :action="action">
      </backup-plan-modal>
      <create-link-modal :btn-loading="btnLoading"
                          :selected-virtuals="currentSelectDb"
                          :vm-type="vmType"
                          :server-data="serverData"
                          @confirm="createLink"
                          :visible.sync="createLinkModalVisile"></create-link-modal>
  </section>
</template>
<script>
import {
  fetchAll,
  createMultipleVirtualBackupPlan,
  rescan,
  createLinks,
  ModifyOneStartup
} from '@/api/virtuals';
import BackupPlanModal from '@/components/pages/virtual/BackupPlanModal';
import CreateLinkModal from '@/components/pages/virtual/takeover/CreateLinkModal';
import {
  hostTypeMapping,
  databaseTypeMapping,
  virtualMapping,
  serverTypeMapping,
  bootModeMapping,
  bootStateMapping
} from '@/utils/constant';
import { fetchServerList } from '@/api/host';
import type from '@/store/type';
import { sockMixin } from '@/components/mixins/commonMixin';
export default {
  name: 'VirtualList',
  mixins: [sockMixin],
  components: {
    BackupPlanModal,
    CreateLinkModal
  },
  data() {
    return {
      vmItems: [],
      serverData: [],
      currentPage: 1,
      pagesize: 10,
      inputSearch: '',
      filterItem: '',
      currentSelectDb: [],
      buttonflag: false,
      btnLoading: false,
      createLinkModalVisile: false,
      action: 'create',
      backupPlanCreateModalVisible: false,
      defaultSort: { prop: 'vmName', order: 'descending' },
      bootModeMapping,
      bootStateMapping
    };
  },
  computed: {
    processDbTableData() {
      let data = [];
      if (this.buttonflag) {
        data = this.currentSelectDb;
      } else {
        data = this.vmItems.filter(v =>
          v.vmName.toLowerCase().includes(this.filterItem.toLowerCase())
        );
      }
      data = data.sort((a, b) => {
        let val1 = a[this.defaultSort.prop];
        let val2 = b[this.defaultSort.prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
        }
        if (val1 < val2) {
          return this.defaultSort.order === 'descending' ? 1 : -1;
        } else if (val1 > val2) {
          return this.defaultSort.order === 'descending' ? -1 : 1;
        }
        return 0;
      });
      data = data.slice(
        (this.currentPage - 1) * this.pagesize,
        this.currentPage * this.pagesize
      );
      this.$nextTick(() => {
        data.forEach(e => {
          if (this.currentSelectDb.includes(e)) {
            this.$refs.dbTable.toggleRowSelection(e, true);
          }
        });
      });
      return data;
    },
    total() {
      if (this.buttonflag) {
        return this.currentSelectDb.length;
      }
      return this.vmItems.filter(v =>
        v.vmName.toLowerCase().includes(this.filterItem.toLowerCase())
      ).length;
    },
    hostsInVuex() {
      return this.$store.state.host.hosts.filter(e => {
        return e.databaseType === 4 && e.osName === 'Windows';
      });
    },
    vmType() {
      return Number(Object.keys(virtualMapping).find(type =>
        this.$route.name.toLowerCase().includes(virtualMapping[type].toLowerCase())
      ));
    },
  },
  created() {
    this.fetchData();
  },
  watch: {
    inputSearch() {
      if (this.inputSearch === '') {
        this.filterItem = '';
        this.currentPage = 1;
      }
    },
    $route: function() {
      this.vmItems = [];
      this.buttonflag = false;
      this.currentSelectDb = [];
      this.currentPage = 1;
      this.pagesize = 10;
      this.inputSearch = '';
      this.filterItem = '';
      this.fetchData();
    },
  },
  filters: {
    bootStateTagFilter(state) {
      if (state === 1) {
        return 'success';
      } else if (state === 0) {
        return 'danger';
      }
      return 'warning';
    }
  },
  methods: {
    toguide(){
      this.$router.push({ name: 'addManagement', query: { aId:'virtualBackUp' }})
    },
    connectCallback(client) {
      this.stompClient.subscribe('/virtual', msg => {
        let { data: virtual } = JSON.parse(msg.body);
        if (virtual.type === this.vmType) {
          this.vmItems.splice(
            this.vmItems.findIndex(item => item.id === virtual.id),
            1,
            virtual
          );
        }
      });
    },
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          if (!Array.isArray(data)) {
            this.vmItems = [];
            return;
          }
          this.vmItems = data.filter(item => item.type === this.vmType);
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchServerList()
        .then(res => {
          const { data } = res.data;
          let serverData = Array.isArray(data) ? data : [];
          this.serverData = serverData.filter(item => serverTypeMapping[this.vmType].includes(item.serverType));
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    modifyBootState(virtual) {
      const { id, vmName, bootState } = virtual;
      this.$confirm(`此操作将${bootState === 0 ? '开启' : '关闭'}虚拟机${vmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const state = virtual.bootState;
          virtual.bootState = state === 0 ? 'starting' : 'stopping';
          ModifyOneStartup(id)
            .then(res => {
              const { message, data } = res.data;
              this.$message.success(message);
              this.$emit('refresh', id);
            })
            .catch(error => {
              virtual.bootState = state;
              this.$message.error(error);
            });
        })
        .catch(() => {
          this.$message.info('已取消操作！');
        });
    },
    selectFn(row, index) { // 限制虚拟机一键接管是否可选
      if ([1, 3].includes(this.vmType))
        return !this.currentSelectDb.length || this.currentSelectDb.some(v => v.hostId === row.hostId);
      return true;
    },
    jumpToTakeOver() {
      this.$router.push({ name: `${virtualMapping[this.vmType]}TakeOver` });
    },
    createTakeOverLink() {
      this.createLinkModalVisile = true;
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
    searchByName() {
      this.filterItem = this.inputSearch;
      this.currentPage = 1;
    },
    handleSizeChange: function(size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
    },
    selectDbChangeFn(selectData, row) {
      if (!this.currentSelectDb.includes(row)) {
        this.currentSelectDb.push(row);
      } else if (!selectData.includes(row)) {
        //需要优化，匹配到即跳出循环
        this.currentSelectDb = this.currentSelectDb.filter(e => {
          if (e.id === row.id) {
            return false;
          }
          return true;
        });
      }
    },
    selectAll(selection) {
      const hostIds = this.processDbTableData.map(v => v.hostId);
      if (Array.from(new Set(hostIds)).length > 1 && selection.length > 0 && [1, 3].includes(this.vmType)) {
        this.$refs.dbTable.clearSelection();
        this.$message.warning('无法选择不同设备下的虚拟机！');
      } else if (selection.length === 0) {
        this.currentSelectDb = this.currentSelectDb.filter(e => {
          let flag = true;
          this.processDbTableData.forEach(i => {
            if (i.id === e.id) {
              flag = false;
            }
          });
          return flag;
        });
      } else {
        let data = [];
        this.processDbTableData.forEach(e => {
          let flag = true;
          if (this.currentSelectDb.includes(e)) {
            flag = false;
          }
          flag && data.push(e);
        });
        this.currentSelectDb.push(...data);
      }
    },
    buttonClick() {
      this.buttonflag = !this.buttonflag;
      this.currentPage = 1;
    },
    addBackupPlan(data) {
      let plan = Object.assign({}, data);
      let vmIds = this.currentSelectDb.map(e => {
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
    sortChangeFn({ prop, order }) {
      if (JSON.stringify(this.defaultSort) === JSON.stringify({ prop, order })) {
        return;
      }
      this.defaultSort = { prop, order };
    },
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>
<style>
