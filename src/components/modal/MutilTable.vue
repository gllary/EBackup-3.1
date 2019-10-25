<template>
<div>
    <el-row style="margin-bottom:10px;">
        <el-col :span="6">
            <el-input  placeholder="请输入名称"
                       v-model="inputSearch"
                       @keyup.enter.native="searchByName"
                       class="input-with-select"
                       size="small">
                <el-button slot="append" icon="el-icon-search" @click="searchByName" :size="customSize"></el-button>
            </el-input>
        </el-col>
        <el-col :span="18">
          <el-button size="small"
                     v-if="showBootBtn"
                     style="float: right"
                     @click="validatePass">开机自启</el-button>
        </el-col>
    </el-row>
    <el-table :data="curTableData" @select="selectDbChangeFn"  :ref="refTable" :size="customSize"
              @sort-change="sortChangeFn"
              :default-sort="defaultSort"
              @select-all="((selection) => selectAll(selection, curTableData))">
        <el-table-column
            type="selection"
            :selectable="selectableFn"
            align="left"
            width="55">
        </el-table-column>
        <el-table-column
            type="index"
            align="left"
            width="50">
            <template slot-scope="scope">
                {{scope.$index+1+(currentPage-1)*pagesize}}
            </template>
        </el-table-column>
        <el-table-column label="虚拟机名称"
                    align="left"
                    prop="vmName"
                    min-width="150"
                    sortable="custom">
            <template slot-scope="scope">
                <router-link :to="`/virtual/${virtualMapping[scope.row.type]}/${scope.row.id}`"
                            class="routerLink">{{scope.row.vmName}}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="vmPath"
                         label="路径"
                         min-width="150"
                         align="left">
        </el-table-column>
        <el-table-column prop="bootState"
                         align="center"
                         v-if="[1, 3].includes(vmType)">
          <template slot="header">
            <span>状态</span>
            <el-tooltip placement="right"
                        effect="light"
                        content="点击开机自启验证物理主机身份后可获取最新状态"
                        v-if="config && !config.serverLoginName && !config.serverPassword">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
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
        <el-table-column prop="vmHostName"
                         label="所属物理主机"
                         min-width="150"
                         align="left"></el-table-column>
        <el-table-column label="操作"
                         v-if="showDelete"
                         width="100"
                         align="center">
            <template slot-scope="scope">
                <el-button type="danger"
                           icon="el-icon-delete"
                           circle
                           size="mini"
                           :class="$style.miniCricleIconBtn"
                           @click="deleteOne(scope)"></el-button>
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
    <el-pagination style="text-align:right;margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        v-if="tableData"
        :total="tableData|filterBySearch(filterItem).length">
    </el-pagination>
    <validate-user-password :visible.sync="validatePassModalVisible"
                            :id="serverId"
                            @refresh="refreshAll"></validate-user-password>
</div>
    
</template>
<script>
import { getVirtualByServerId, deleteVirtualInServerHost, ModifyOneStartup } from '@/api/virtuals';
import { virtualMapping, bootModeMapping, bootStateMapping } from '@/utils/constant';
import ValidateUserPassword from '@/components/pages/virtual/ValidateUserPassword';
import { sockMixin } from '@/components/mixins/commonMixin';
export default {
  mixins: [sockMixin],
  props: {
    tableData: {
      type: Array,
    },
    refTable: {
      type: String,
    },
    selectData: {
      type: Array,
    },
    curSelectData: {
      type: Array,
      default: () => [],
    },
    size: {
      type: String,
    },
    showDelete: {
      type: Boolean
    },
    showBootBtn: {
      type: Boolean
    },
    vmType: {
      type: Number
    },
    serverId: {
      type: Number
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pagesize: 10,
      currentPage: 1,
      filterItem: '',
      inputSearch: '',
      defaultSort: { prop: 'vmName', order: 'descending' },
      validatePassModalVisible: false,
      settingBootVirtuals: [],
      virtualMapping,
      bootStateMapping,
      bootModeMapping,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs[this.refTable].clearSelection();
      this.selectData.forEach(item => {
        this.curTableData.forEach(e => {
          if (item.id === e.id) {
            this.$refs[this.refTable].toggleRowSelection(item, true);
          }
        });
      });
    });
  },
  components: {
    ValidateUserPassword
  },
  filters: {
    filterBySearch(tableData, arg) {
      if (!tableData) {
        return '';
      }
      return tableData.filter(v =>
        v.vmName.toLowerCase().includes(arg.toLowerCase())
      );
    },
    filterByPage(data, currentPage, pagesize) {
      if (!data) {
        return '';
      }
      return data.slice((currentPage - 1) * pagesize, currentPage * pagesize);
    },
    bootStateTagFilter(state) {
      if (state === 1) {
        return 'success';
      } else if (state === 0) {
        return 'danger';
      }
      return 'warning';
    }
  },
  watch: {
    selectData(data) {
      this.$nextTick(() => {
        if (!this.$refs[this.refTable]) {
          return;
        }
        this.$refs[this.refTable].clearSelection();
        data.forEach(item => {
          this.curTableData.forEach(e => {
            if (item.id === e.id) {
              // this.$refs[this.refTable].toggleRowSelection(item, true);
              setTimeout(() => {
                this.$refs[this.refTable].toggleRowSelection(e, true);
              }, 100);
            }
          });
        });
      });
    },
  },
  computed: {
    curTableData() {
      let data = [];
      // if(this.buttonflag){
      //     data = this.currentSelectDb.filter(v => v.vmName.toLowerCase().includes(this.filterItem.toLowerCase()));
      // }else{
      data = this.tableData.filter(v =>
        v.vmName.toLowerCase().includes(this.filterItem.toLowerCase())
      );
      // }
      //排序
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
        } else {
          return 0;
        }
      });
      data = data.slice(
        (this.currentPage - 1) * this.pagesize,
        this.currentPage * this.pagesize
      );
      this.$nextTick(() => {
        data.forEach(e => {
          if (this.currentSelect.some(ele => ele.id === e.id)) {
            // this.$refs[this.refTable].toggleRowSelection(e,true);
            setTimeout(() => {
              this.$refs[this.refTable].toggleRowSelection(e, true);
            }, 100);
          }
        });
      });
      return data;
    },
    currentSelect: {
      get() {
        return this.selectData;
      },
      set(value) {
        this.$emit('update:selectData', value);
      },
    },
    customSize() {
      return this.size ? this.size : '-';
    },
    selectDataIds() {
      return this.selectData.length ? this.selectData.map(v => Number(v.hostId)) : [];
    }
  },
  methods: {
    refresh(id) {
      getVirtualByServerId(id)
        .then(res => {
          const { data } = res.data;
          //更新数据前，去除已选数据。表格刷新后默认清空该表格的选中状态
          // const ids = this.curTableData.map( i => {
          //     return i.id;
          // });
          // this.currentSelect = this.currentSelect.filter( e => {
          //     if(ids.includes(e.id)){
          //         return false
          //     }
          //     return true
          // });
          // this.currentSelect = aa;
          // this.curTableData = data;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    connectCallback(client) {
      this.stompClient.subscribe('/virtual', msg => {
        let { data: virtual } = JSON.parse(msg.body);
        const index = this.tableData.findIndex(item => item.id === virtual.id);
        if (index > -1) {
          this.tableData.splice(
            index,
            1,
            virtual
          )
        }
      });
    },
    refreshAll() {
      this.$emit('refresh-and-set-power');
    },
    validatePass() {
      this.validatePassModalVisible = true;
    },
    selectDbChangeFn(selectData, row) {
      if (selectData.includes(row)) {
        const ids = this.currentSelect.map(e => {
          return e.id;
        });
        if (!ids.includes(row.id)) {
          this.currentSelect.push(row);
        }
      } else {
        //需要优化，匹配到即跳出循环
        this.currentSelect = this.currentSelect.filter(e => {
          if (e.id === row.id) {
            return false;
          }
          return true;
        });
      }
    },
    selectAll(selection, list) {
      if (selection.length === 0) {
        this.currentSelect = this.currentSelect.filter(e => {
          let flag = true;
          list.forEach(i => {
            if (i.id === e.id) {
              flag = false;
            }
          });
          return flag;
        });
      } else {
        let data = [];
        list.forEach(e => {
          let flag = true;
          this.currentSelect.forEach(i => {
            if (i.id === e.id) {
              flag = false;
            }
          });
          flag && data.push(e);
        });
        this.currentSelect.push(...data);
      }
    },
    deleteOne({ row }) {
      this.$confirm(`此操作将删除虚拟机${row.vmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteVirtualInServerHost(row.id)
            .then(res => {
              const { message } = res.data;
              this.$message.success(message);
              this.$emit('refresh');
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
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
              this.$emit('refresh');
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
    handleSizeChange: function(size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
    },
    searchByName() {
      this.filterItem = this.inputSearch;
      this.currentPage = 1;
    },
    sortChangeFn({ column, prop, order }) {
      if (
        JSON.stringify(this.defaultSort) === JSON.stringify({ prop, order })
      ) {
        return;
      }
      this.defaultSort = { prop, order };
    },
    selectableFn(row) { // 仅能选择同设备下的虚拟机
      return !this.curSelectData.some(e => e.id === row.id) && (!this.selectDataIds.length || this.selectDataIds.includes(Number(row.hostId)));
    },
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>

