<template>
  <section>
    <!-- <el-row>
      <span class="title">备份计划</span>
      <el-button type="primary"
                 size="small"
                 style="float:right"
                 @click="$router.push({name: 'dashboard'})">返回</el-button>
    </el-row> -->
    <template>
      <el-tabs type="border-card"
               v-model="activeName"
               @tab-click="handleClick"
               :before-leave="beforeTabLeave">
        <el-tab-pane label="数据库"
                     name="database">
          <el-table :data="processedTableData"
                    @filter-change="filterChange"
                    :row-class-name="tableRowClassName"
                    v-loading="infoLoading"
                    :element-loading-background="themeColor.loadingBackGround"
                    ref="database"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pageSize}}
              </template>
            </el-table-column>
            <el-table-column label="计划名称"
                            prop="name"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'backupDetail', query: { id: scope.row.id, type: scope.row.type}}"
                             class="routerLink">
                  {{ scope.row.name }}
                </router-link>
              </template>              
            </el-table-column>
            <el-table-column prop="objName"
                             label="数据库名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${dbDetailRouter(scope.row)}`, params: { id: String(scope.row.objId)}}"
                             class="routerLink">
                  {{ scope.row.objName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="数据库类型"
                             align="center"
                             prop="objType"
                             :formatter="dbType"
                             :filters="dbTypeFilter"
                             column-key="objType"
                             min-width="100"></el-table-column>
            <el-table-column label="备份策略"
                             align="center"
                             :formatter="backupStrategyFmt"
                             prop="backupStrategy"
                             min-width="130">
            </el-table-column>
            <el-table-column label="时间策略"
                             align="center"
                             :formatter="timeStrategyFmt"
                             prop="timeStrategy"
                             min-width="100">
            </el-table-column>
            <el-table-column prop="state"
                             label="状态"
                             :formatter="stateFmt"
                             column-key="state"
                             align="center"
                             min-width="60">
              <!-- <template slot-scope="scope">
                <i v-if="scope.row.state === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template> -->
            </el-table-column>
            <el-table-column prop="highLight"
                             label="消息"
                             :filters="highlightFilter"
                             column-key="highLight"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i-icon v-if="scope.row.highLight === 1" name="gaojing"></i-icon>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="文件"
                     name="filehost">
          <el-table :data="processedTableData"
                    @filter-change="filterChange"
                    v-loading="infoLoading"
                    ref="filehost"
                    :row-class-name="tableRowClassName"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pageSize}}
              </template>
            </el-table-column>
            <el-table-column label="计划名称"
                             prop="name"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'backupDetail', query: { id: scope.row.id, type: scope.row.type}}"
                             class="routerLink">
                  {{ scope.row.name }}
                </router-link>
              </template>              
            </el-table-column>
            <el-table-column prop="objName"
                             label="主机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'filehostDetail', params: { id: String(scope.row.objId)}}"
                             class="routerLink">
                  {{ scope.row.objName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="系统类型"
                             align="center"
                             prop="objType"
                             :filters="osNameFilter"
                             :formatter="osNameFmt"
                             column-key="objType"
                             min-width="100"></el-table-column>
            <el-table-column label="备份策略"
                             align="center"
                             :formatter="fileBackupStrategyFmt"
                             prop="backupStrategy"
                             min-width="130">
            </el-table-column>
            <el-table-column label="时间策略"
                             align="center"
                             :formatter="timeStrategyFmt"
                             prop="timeStrategy"
                             min-width="100">
            </el-table-column>
            <el-table-column prop="state"
                             label="状态"
                             :formatter="stateFmt"
                             column-key="state"
                             align="center"
                             min-width="60">
              <!-- <template slot-scope="scope">
                <i v-if="scope.row.state === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template> -->
            </el-table-column>
            <el-table-column prop="highLight"
                             label="消息"
                             :filters="highlightFilter"
                             column-key="highLight"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i-icon v-if="scope.row.highLight === 1" name="gaojing"></i-icon>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="虚拟机"
                     name="vm">
          <el-table :data="processedTableData"
                    @filter-change="filterChange"
                    v-loading="infoLoading"
                    ref="vm"
                    :row-class-name="tableRowClassName"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pageSize}}
              </template>
            </el-table-column>
            <el-table-column label="计划名称"
                             prop="name"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'backupDetail', query: { id: scope.row.id, type: scope.row.type}}"
                             class="routerLink">
                  {{ scope.row.name }}
                </router-link>
              </template>              
            </el-table-column>
            <el-table-column prop="objName"
                             label="虚拟机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${vmDetailRouter(scope.row)}`, params: { id: String(scope.row.objId)}}"
                             class="routerLink">
                  {{ scope.row.objName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="虚拟机类型"
                             align="center"
                             prop="objType"
                             :formatter="vmTypeFmt"
                             :filters="vmTypeFilter"
                             column-key="objType"
                             min-width="100"></el-table-column>
            <el-table-column label="备份策略"
                             align="center"
                             :formatter="backupStrategyFmt"
                             prop="backupStrategy"
                             min-width="130">
            </el-table-column>
            <el-table-column label="时间策略"
                             align="center"
                             :formatter="timeStrategyFmt"
                             prop="timeStrategy"
                             min-width="100">
            </el-table-column>
            <el-table-column prop="state"
                             label="状态"
                             :formatter="stateFmt"
                             column-key="state"
                             align="center"
                             min-width="60">
              <!-- <template slot-scope="scope">
                <i v-if="scope.row.state === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template> -->
            </el-table-column>
            <el-table-column prop="highLight"
                             label="消息"
                             :filters="highlightFilter"
                             column-key="highLight"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i-icon v-if="scope.row.highLight === 1" name="gaojing"></i-icon>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-pagination style="text-align:right;margin-top:10px;"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="pageSize"
                     background
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </template>
  </section>
</template>
<script>
import IIcon from '../IIcon.vue';
import { paginationMixin, filterMixin } from '../mixins/commonMixin';
import themeMixin from '@/components/mixins/themeMixins';
import { fetchBackupPlan } from '@/api/home';
import {
  dbTypeMapping,
  dbDetailRouterMapping,
  backupStrategyMapping,
  timeStrategyMapping,
  operationStateMapping,
  vmTypeMapping,
  vmDetailRouterMapping,
  filehostBackupStrategyMapping
} from '../../utils/constant';
export default {
  name: 'backupPlans',
  mixins: [paginationMixin, filterMixin, themeMixin],
  components: {
    IIcon
  },
  data() {
    return {
      infoLoading: true,
      tableFilter: {},
      highlightFilter: [{
        text: '告警',
        value: 1
      }],
      osNameFilter: [{
        text: 'Windows',
        value: 'Windows'
      },{
        text: 'Linux',
        value: 'Linux'
      }],
      activeName: 'database',
      database: [],
      filehost: [],
      vm: []
    };
  },
  created() {
    this.fetchTabData();
    const query = this.$route.query;
  },
  computed: {
    tableData() {
      return this[this.activeName] ? this[this.activeName] : [];
    },
    // 数据库类型
    dbTypeFilter() {
      return this.mappingConvertToFilters(dbTypeMapping);
    },
    vmTypeFilter() {
      return this.mappingConvertToFilters(vmTypeMapping);
    }
  },
  methods: {
    fetchTabData() {
      fetchBackupPlan().then(res => {
        const { data } = res.data;
        this.database = data.filter(e => e.type === 1);
        this.filehost = data.filter(e => e.type === 2);
        this.vm = data.filter(e => e.type === 3);
        this.infoLoading = false;
      });
    },
    tableRowClassName({row}){
      if(row.highLight === 1) {
        return 'highLight'
      }
    },
    filterChange(filters) {
      const tkey = Object.keys(filters)[0];
      this.tableFilter = { ...this.tableFilter, [tkey]: filters[tkey] };
      this.filter = Object.assign({}, this.filter, this.tableFilter);
    },
    filterFn(item, i) {
      if (Array.isArray(this.filter[i]) && this.filter[i].length > 0) {
        // if (this.filter[i] === 'type') {
        //    return this.filter[i].includes(Number(item.machine[i]));
        // }
        return this.filter[i].includes(Number(item[i]));
      } else {
        return item[i].includes(this.filter[i]);
      }
    },
    handleClick(tab, event) {
      this.currentPage = 1;
      this.filter = {};
      this.tableFilter = {};
    },
    beforeTabLeave(newName, oldName) {
      this.$refs[oldName].clearFilter();
    },
    // da
    dbType(row) {
      return dbTypeMapping[row.objType];
    },
    osNameFmt(row) {
      if (row.objType === 1) {
        return 'Windows';
      } else if (row.objType === 2) {
        return 'Linux';
      }
      return row.objType;
    },
    vmTypeFmt(row) {
      return vmTypeMapping[row.objType];
    },
    dbDetailRouter(row) {
      return dbDetailRouterMapping[row.objType];
    },
    vmDetailRouter(row) {
      return vmDetailRouterMapping[row.objType];
    },
    backupStrategyFmt(row){
      return backupStrategyMapping[row.backupStrategy];
    },
    fileBackupStrategyFmt(row) {
      return filehostBackupStrategyMapping[row.backupStrategy];
    },
    timeStrategyFmt(row){
      return timeStrategyMapping[row.timeStrategy];
    },
    stateFmt(row){
      return operationStateMapping[row.state];
    },
    // 映射对象转数组对象
    mappingConvertToFilters(mapping) {
      // eslint-disable-next-line
      return Object.keys(mapping).map(key => {
        return {
          text: mapping[key],
          value: Number(key)
        };
      });
    },
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
<style >
.title {
  font-weight: 400;
  /* color: #606266; */
  padding-top: 0.5em;
  display: inline-block;
}
</style>
<style>
.el-table .highLight {
  background: oldlace;
}
</style>

