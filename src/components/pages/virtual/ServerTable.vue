<template>
    <div>
      <el-row style="margin-bottom:10px;">
          <el-col :span="12" style="text-align:left;">
              <el-button type="primary" @click="isSelect = !isSelect" size="small"
                  >{{isSelect ? '返回' : '已选虚拟机'}}</el-button>
          </el-col>
          <el-col :span="12" style="text-align:right;">
              <slot name="other"></slot>
          </el-col>
      </el-row>
      <el-table v-show="!isSelect" :data="serverTableData" ref="serverTable" :size="customSize">
          <el-table-column type="expand">
              <template slot-scope="props">
                <template v-if="props.row.serverType === 1">
                  <el-tabs tab-position="left"
                           class="serverHost">
                    <el-tab-pane label="所有虚拟机"
                                 v-if="allVirtuals(props.row).length">
                      <el-card style="margin-top: 5px; margin-bottom: 5px">
                        <mutil-table :tableData="allVirtuals(props.row)"
                                     :config="props.row"
                                     :ref="props.row.id"
                                     :refTable="props.row.serverName"
                                     :selectData.sync="selectData"
                                     :curSelectData="curSelectData"
                                     :size="customSize"
                                     :showDelete="showDelete"
                                     :vm-type="vmType"
                                     @refresh="refreshOneServer(props.row)"></mutil-table>
                      </el-card>
                    </el-tab-pane>
                    <el-tab-pane v-for="host in props.row.hostList"
                                 :key="host.id"
                                 :label="host.serverName">
                      <el-card style="margin-top: 5px; margin-bottom: 5px">
                        <div slot="header">
                          <el-row>
                            <el-col :span="8" style="text-align: center">所属设备：{{ host.hostName }}</el-col>
                            <el-col :span="8" style="text-align: center">主机IP：{{ host.serverIp }}</el-col>
                            <el-col :span="8" style="text-align: center">主机类型：{{ host.serverType | virtualHostServerTypeFilter }}</el-col>
                          </el-row>
                        </div>
                        <mutil-table :tableData="host.vmList"
                                     :config="host"
                                     :ref="host.id"
                                     :server-id="host.id"
                                     :refTable="host.serverName"
                                     :selectData.sync="selectData"
                                     :curSelectData="curSelectData"
                                     :size="customSize"
                                     :showDelete="showDelete"
                                     :showBootBtn="true"
                                     :vm-type="vmType"
                                     @refresh="refreshOneServer(host)"
                                     @refresh-and-set-power="refreshAndSetPower(host)"></mutil-table>
                      </el-card>
                    </el-tab-pane>
                  </el-tabs>
                </template>
                <template v-else>
                  <mutil-table :tableData="props.row.vmList"
                               :ref="props.row.id"
                               :refTable="props.row.serverName"
                               :selectData.sync="selectData"
                               :curSelectData="curSelectData"
                               :size="customSize"
                               :showDelete="showDelete"
                               :vm-type="vmType"
                               @refresh="refreshOneServer(props.row)"></mutil-table>
                </template>
              </template>
          </el-table-column>
          <el-table-column label="主机名" prop="serverName" align="left"
                      min-width="100">
          </el-table-column>
          <el-table-column prop="hostName" align="left"
                          min-width="100"
                          label="所属设备">
          </el-table-column>
          <el-table-column prop="serverIp" align="left"
                          label="主机IP地址"
                          min-width="100">
          </el-table-column>
          <el-table-column v-if="false" prop="createDate" align="left"
                          label="创建时间"
                          min-width="150"></el-table-column>
          <el-table-column prop="serverType" 
              label="主机类型"
              :formatter="serverTypeFormat"
              min-width="100"
              align="left"></el-table-column>
          <el-table-column label="操作"
                           width="140"
                           header-align="center"
                           align="left">
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
                      <el-button type="danger" v-if="showDelete"
                                  :icon="scope.row.delBtnIcon"
                                  :disabled="scope.row.disabled"
                                  circle
                                  size="mini"
                                  :class="$style.miniCricleIconBtn"
                                  @click="deleteServer(scope)"></el-button>
                  </el-tooltip>
                  <el-tooltip content="开机自启"
                              placement="top"
                              effect="light"
                              v-if="[2, 4].includes(scope.row.serverType)">
                      <el-button type="success"
                                 icon="el-icon-switch-button"
                                 circle
                                 size="mini"
                                 :class="$style.miniCricleIconBtn"
                                 @click="setPowerBoot(scope.row)"></el-button>
                  </el-tooltip>
              </template>
          </el-table-column>
      </el-table>
      <mutil-table v-show="isSelect"
                   :tableData="selectData"
                   refTable="selectTable"
                   :selectData.sync="selectData"
                   :curSelectData="curSelectData"
                   :size="customSize"
                   :vm-type="vmType"
                   :showDelete="false"></mutil-table>
      <power-boot-modal :visible.sync="setPowerBootModalVisible"
                        :virtuals="settingBootVirtuals.vmList"
                        :id="settingBootVirtuals.id"
                        @refresh="refreshOneServer(settingBootVirtuals)"></power-boot-modal>
    </div>
    
</template>
<script>
import { addServer, fetchServerList, deleteServer } from '@/api/host';
import {
  createMultipleVirtualBackupPlan,
  rescan,
  getVirtualByServerId,
} from '@/api/virtuals';
import MutilTable from '@/components/modal/MutilTable';
import PowerBootModal from '@/components/pages/virtual/PowerBootModal';
import { virtualHostServerTypeMapping } from '@/utils/constant';
export default {
  props: {
    tableData: {
      type: Array
    },
    currentSelect: {
      type: Array
    },
    showSelect: {
      type: Boolean
    },
    curSelectData: {
      type: Array,
      default: () => []
    },
    size: {
      type: String
    },
    showDelete: {
      type: Boolean
    },
    vmType: {
      type: Number
    }
  },
  components: {
    MutilTable,
    PowerBootModal
  },
  data() {
    return {
      setPowerBootModalVisible: false,
      settingBootVirtuals: []
    };
  },
  filters: {
    virtualHostServerTypeFilter(value) {
      return virtualHostServerTypeMapping[value];
    }
  },
  computed: {
    customSize() {
      return this.size ? this.size : '-';
    },
    serverTableData() {
      if (!Array.isArray(this.tableData)) {
        // this.currentSelect = [];
        return [];
      }
     const serverList = this.tableData.map(e => {
        e.disabled = false;
        e.icon = 'el-icon-refresh';
        e.delBtnIcon = 'el-icon-delete';
        return e;
      });
      return this.formatServerData(serverList);
      // this.currentSelect = [];
    },
    selectData: {
      get() {
        return this.currentSelect;
      },
      set(value) {
        this.$emit('update:currentSelect', value);
      },
    },
    isSelect: {
      get() {
        return this.showSelect;
      },
      set(value) {
        this.$emit('update:showSelect', value);
      },
    }
  },
  methods: {
    serverTypeFormat(row, column, cellValue, index) {
      return virtualHostServerTypeMapping[cellValue];
    },
    // 刷新单个主机下的虚拟机列表
    refreshOneServer(row) {
      getVirtualByServerId(row.id).then(res => {
        const ids = row.vmList.map(i => i.id);
        this.selectData = this.selectData.filter(e => {
          if (ids.includes(e.id) && !this.curSelectData.some(n => n.id === e.id)) {
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
    refreshAndSetPower(row) {
      getVirtualByServerId(row.id).then(res => {
        const ids = row.vmList.map(i => i.id);
        this.selectData = this.selectData.filter(e => {
          if (ids.includes(e.id) && !this.curSelectData.some(n => n.id === e.id)) {
            return false;
          }
          return true;
        });
        const { data } = res.data;
        row.vmList = data;
        this.settingBootVirtuals = row;
        this.setPowerBootModalVisible = true;
      }).catch(error => {
        this.$message.error(error);
      });
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
    deleteServer(data) {
      this.$emit('delete', data);
    },
    formatServerData(serverList) { // 主机=>vcenter=>物理主机
      const hostIdsInVcenter = serverList.filter(server => server.serverType === 1).reduce((initArray, item) => initArray.concat(item.serverListIds), []);
      const results = serverList.reduce(([pass, fail], item) => {
        if (item.serverType === 2 && hostIdsInVcenter.includes(item.id)) {
          return [[...pass, item], fail];
        }
        return [pass, [...fail, item]];
      }, [[], []]);
      return results[1].map(server => {
        if (server.serverType === 1) {
          server.hostList = results[0].filter(host => server.serverListIds.includes(host.id));
        }
        return server;
      });
    },
    allVirtuals(server) {
      return server.hostList.reduce((flat, next) => flat.concat(next.vmList), server.vmList);
    },
    setPowerBoot(item) {
      this.setPowerBootModalVisible = true;
      this.settingBootVirtuals = item;
    }
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>
<style scoped>
.serverHost {
  position: relative;
  margin-left: -55px;
}
.serverHost >>> .el-tabs__content {
  margin-left: 150px;
}
.serverHost >>> .el-tabs__header {
  padding-right: 10px;
  padding-bottom: 15px;
  width: 150px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 5px;
}
.serverHost>>>.el-tabs__nav::-webkit-scrollbar {
  width: 8px;
}
.serverHost>>>.el-tabs__nav::-webkit-scrollbar-track {
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius:2em;
  border: 1px solid #ddd;
}
.serverHost>>>.el-tabs__nav::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius:2em;
}
.serverHost>>>.el-tabs__nav {
  height: 100%;
  overflow-y: auto;
}
</style>
