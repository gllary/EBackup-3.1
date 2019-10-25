<template>
  <section>
    <el-row>
      <el-form inline>
        <el-form-item style="float: left">
          <i-icon :name="`${theme}-list-btn`"
                  :class="`{ ${showType === 'list' ? 'active-btn' : 'inactive-btn'} }`"
                  @click.native="switchList"></i-icon>
          <span class="switch-division">/</span>
          <i-icon :name="`${theme}-card-btn`"
                  :class="`{ ${showType === 'card' ? 'active-btn' : 'inactive-btn'} }`"
                  @click.native="switchCard"></i-icon>
        </el-form-item>
        <el-form-item style="float: left" class="input-with-select">
          <el-input placeholder="请输入内容"
                    v-model="inputSearch"
                    @keyup.enter.native="searchByName">
            <el-select v-model="selectTag" slot="prepend" placeholder="请选择" style="width: 90px;">
              <el-option label="设备名" value="name"></el-option>
              <el-option label="设备IP" value="hostIp"></el-option>
              <el-option label="操作IP" value="serviceIp"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item style="float: right;">
            <el-button type="success"
                      @click="toguide">操作说明</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary"
                     @click="createModalVisible = true">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="processedTableData"
              @filter-change="filterChange"
              style="width: 100%"
              v-show="showType === 'list'">
      <el-table-column label="序号"
                       min-width="60"
                       fixed
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pageSize}}
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="设备名"
                       min-width="150"
                       align="center">
        <template slot-scope="scope">
          <span v-html="showData(scope.row.name, scope.column.property)"
                class="hight-light-content"></span>
        </template>
      </el-table-column>
      <el-table-column prop="hostIp"
                       label="设备IP"
                       min-width="120"
                       align="center">
        <template slot-scope="scope">
          <span v-html="showData(scope.row.hostIp, scope.column.property)"
                class="hight-light-content"></span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceIp"
                       label="操作IP"
                       min-width="150"
                       align="center">
        <template slot-scope="scope">
          <span v-html="showData(scope.row.serviceIp || '', scope.column.property)"
                class="hight-light-content"></span>
        </template>
      </el-table-column>
      <el-table-column prop="hostType"
                       label="设备类型"
                       :formatter="judgeHost"
                       :filters="hostTypeFilters"
                       column-key="hostType"
                       min-width="100"
                       align="center"></el-table-column>
      <el-table-column prop="databaseType"
                       label="用途类型"
                       :formatter="judgeDatabase"
                       :filters="databaseTypeFilters"
                       column-key="databaseType"
                       min-width="120"
                       align="center"></el-table-column>
      <el-table-column prop="osName"
                       label="操作系统"
                       :formatter="judgeOsName"
                       :filters="Array.from(new Array('Windows', 'Linux', 'AIX'), val => ({text: val, value: val}))"
                       column-key="osName"
                       min-width="100"
                       align="center"></el-table-column>
      <!-- <el-table-column prop="loginName"
                       label="登录账号"
                       min-width="100"
                       show-overflow-tooltip  
                       align="center"></el-table-column> -->
      <el-table-column prop="storeType"
                       label="存储方式"
                       min-width="100"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.storeType | storeTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="150"
                       header-align="center"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-row>
            <i-icon :name="`${theme}-monitor`" class="monitorClass" @click.native="linkMonitor(scope.row)" v-show="configMsg.monitorWeb"></i-icon>
            <el-button type="primary"
                      icon="el-icon-edit"
                      circle
                      size="mini"
                      :class="$style.miniCricleIconBtn"
                      @click="selectOne(scope.row)"></el-button>
            <el-button type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                      :class="$style.miniCricleIconBtn"
                      @click="deleteItem(scope.row)"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <section v-show="showType === 'card'"
             style="min-height: 400px">
      <el-row :gutter="20"
              v-for="row in Array.from(new Array(Math.ceil(processedTableData.length / 3)), (val, index) => index)"
              style="margin-bottom: 10px"
              :key="`row${row}`">
        <el-col :span="8"
                v-for="col in [0, 1, 2]"
                :key="`col${col}`"
                v-if="row * 3 + col < processedTableData.length">
          <div class="silk-ribbon"
               ref="silkRibbon"
               style="height: 0">
            <el-card class="content"
                     ref="content">
              <div class="header">
                <i-icon :name="processedTableData[row * 3 + col].databaseType | hostIconFilter"
                        class="hostIcon"></i-icon>
                <span class="title">{{ processedTableData[row * 3 + col].name }}</span>
                <el-tooltip content="删除" placement="top" effect="light">
                  <i class="el-icon-delete delete"
                  @click="deleteItem(processedTableData[row * 3 + col])"></i>
                </el-tooltip>
                <el-tooltip content="修改" placement="top" effect="light">
                  <i class="el-icon-edit edit"
                  @click="selectOne(processedTableData[row * 3 + col])"></i>
                </el-tooltip>
                <el-tooltip content="监控" placement="top" effect="light">
                  <i-icon :name="`${theme}-monitor`"
                          class="monitor"
                          @click.native="linkMonitor(processedTableData[row * 3 + col])" v-show="configMsg.monitorWeb"></i-icon>
                </el-tooltip>
              </div>
              <el-form label-position="right"
                      label-width="80px"
                      class="hostForm"
                      inline>
                <el-form-item label="设备IP"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].hostIp }}</span>
                </el-form-item>
                <el-form-item label="操作IP"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].serviceIp }}</span>
                </el-form-item>
                <el-form-item label="存储方式"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].storeType | storeTypeFilter }}</span>
                </el-form-item>
                <el-form-item label="操作系统"
                              class="formItem">
                  <el-tag size="mini"
                          type="primary">{{ judgeOsName(processedTableData[row * 3 + col]) }}</el-tag>
                </el-form-item>
              </el-form>
            </el-card>
            <div :class="processedTableData[row * 3 + col].hostType | wrapStyleFilter">
              <div :class="processedTableData[row * 3 + col].hostType | ribbonStyleFilter">{{ processedTableData[row * 3 + col].hostType | hostTypeFilter }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </section>
    <div class="block" style="text-align: right">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="showType === 'list' ? [5, 10, 15, 20] : [6, 9, 12, 15]"
                     :page-size="pageSize"
                     background
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <host-create-modal type="host"
                       :visible.sync="createModalVisible"
                       :host-names="hostNames"
                       @confirm="createItem"
                       :btn-loading="btnLoading"></host-create-modal>
    <host-update-modal type="host"
                       :visible.sync="updateModalVisible"
                       :host-names="hostNames"
                       :item-info="selectedHost"
                       @confirm="updateItem"
                       :btn-loading="btnLoading"></host-update-modal>
  </section>
</template>
<script>
import { listMixin } from '@/components/mixins/databaseListMixin';
import { webSocketMixin, paginationMixin, filterMixin, sortMixin } from '@/components/mixins/commonMixin';
import themeMixin from '@/components/mixins/themeMixins';
import switchViewMixins from '@/components/mixins/switchViewMixins';
import HostCreateModal from '@/components/modal/HostCreateModal';
import HostUpdateModal from '@/components/modal/HostUpdateModal';
import IIcon from '@/components/IIcon';
import { createOne, deleteOne, modifyOne } from '@/api/host';
import { getMonitorInfo } from '@/api/home';
import { mapActions } from 'vuex';
import { storeTypeMapping } from '@/utils/constant';
import {
  hostTypeMapping,
  databaseTypeMapping,
  windowsTypeMapping,
  oracleVersionMapping
} from '@/utils/constant';

const useTypeIconName = {
  1: 'oracle',
  2: 'sqlserver',
  3: 'fileHost',
  4: 'vmware',
  5: 'mysql',
  6: 'db2',
  7: 'dm',
  8: 'appHost',
  9: 'sybase',
  10: 'cacheDB',
  11: 'insql',
  12: 'informix',
  13: 'postgresql'
}

export default {
  name: 'DeviceManager',
  mixins: [listMixin, paginationMixin, filterMixin, sortMixin, switchViewMixins, themeMixin],
  data() {
    return {
      wsuri: '/test',
      selectedId: '',
      tableData: [],
      tableFilter: {},
      defaultSort: { prop: 'createdTime', order: 'descending' },
    };
  },
  computed: {
    // 从vuex中获取hosts列表
    hostsInVuex() {
      return this.$store.state.host.hosts;
    },
    selectedHost() {
      return this.$store.getters.selectedHost(this.selectedId);
    },
    hostNames() {
      return this.tableData.map(host => host.name);
    },
    hostTypeFilters() {
      return Object.keys(hostTypeMapping).map(type => ({
        text: hostTypeMapping[Number(type)],
        value: Number(type)
      }))
    },
    databaseTypeFilters() {
      return Object.keys(databaseTypeMapping).map(db => ({
        text: databaseTypeMapping[Number(db)],
        value: Number(db)
      }))
    },
    configMsg() {
      return this.$store.state.nav.configMsg;
    }
  },
  filters: {
    storeTypeFilter(type) {
      return storeTypeMapping[type];
    },
    hostIconFilter(type) {
      return useTypeIconName[type];
    },
    hostTypeFilter(type) {
      return hostTypeMapping[type];
    },
    ribbonStyleFilter(type) {
      return type === 1 ? 'production-silk-ribbon' : 'ebackup-silk-ribbon';
    },
    wrapStyleFilter(type) {
      return type === 1 ? 'production-wrap' : 'ebackup-wrap';
    }
  },
  watch: {
    hostsInVuex(data){
      this.tableData = Object.assign([], this.hostsInVuex);
    },
    inputSearch() {
      if (this.inputSearch === '') {
        this.filter = Object.assign({}, this.tableFilter);
        this.currentPage = 1;
      }
    }
  },
  created() {
    this.tableData = Object.assign([], this.hostsInVuex);
  },
  methods: {
    toguide(){
      this.$router.push({ name: 'equipmentManage', query: { aId:'equipmentManage' }})
    },
    judgeHost(data) {
      return hostTypeMapping[data.hostType];
    },
    judgeOsName(data){
      let str = data.osName;
      if(data.osName === 'Windows' && [2, 10, 11].includes(data.databaseType) && windowsTypeMapping[data.windowsType]){
        str += (' ' + windowsTypeMapping[data.windowsType]);
      }
      return str;
    },
    judgeDatabase(data) {
      let db = databaseTypeMapping[data.databaseType];
      if(data.databaseType=== 1) {
        return db + ' ' + oracleVersionMapping[data.oracleVersion];
      }
      return db;
    },
    // 搜索关键字高亮
    showData(val, property) {
      val = val + '';
      const firstIndex = val.toLowerCase().indexOf(this.inputSearch.toLowerCase());
      if (firstIndex>-1 && this.inputSearch && this.selectTag === property) {
        const highLightWords = val.substr(firstIndex, this.inputSearch.length);
        return val.replace(highLightWords, '<span>'+highLightWords+'</span>');
      }
      return val;
    },
    fetchData() {},
    filterChange(filters) {
      this.tableFilter = Object.assign({},this.tableFilter, filters);
      this.filter = Object.assign({}, this.filter, this.tableFilter);
      this.currentPage = 1;
    },
    filterFn(item, i){
      if(Array.isArray(this.filter[i]) && this.filter[i].length > 0){
        return this.filter[i].includes(item[i]);
      } else {
        return item[i].toLowerCase().includes(this.filter[i].toLowerCase());
      }
    },
    searchByName(){
      this.filter = Object.assign({}, this.tableFilter, {[this.selectTag]: this.inputSearch});
      this.currentPage = 1;
    },
    linkMonitor(row) {
      const objId = row.id;
      getMonitorInfo(objId, 'device').then(res => {
        const {message, data} = res.data;
        const {token, id, origin} = data;
        let popup = window.open(origin + '/monitor/common');
        // let popup = window.open('http://localhost:8080/monitor/common');
        window.addEventListener('message', e => {
          if (e.origin === origin && e.data === 'monitor') {
            let obj = {
              token,
              id,
              type: 'deviceDashboard',
              theme: this.theme
            }
            popup.postMessage(obj, origin);
          }
        });
      }).catch(error => {
        this.errorMessage(error);
      })
    },
    createItem(host) {
      this.btnLoading = true;
      if(!(host.osName === 'Windows' && [2, 10, 11].includes(host.databaseType))) {
        delete host.windowsType;
      }
      createOne(host)
        .then(res => {
          this.createModalVisible = false;
          this.$message.success(res.data.message);
        })
        .catch(error => {
          this.errorMessage(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    deleteItem(host) {
      this.$confirm('确认删除此设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteOne(host.id)
            .then(() => {
              this.$message.success({ message: '删除成功!' });
            })
            .catch(error =>{
              this.errorMessage(error);
            })
        })
        .catch(error => {
          this.$message.info('已取消删除操作!');
        });
    },
    updateItem(host) {
      this.btnLoading = true;
      if(!(host.osName === 'Windows' && [2, 10, 11].includes(host.databaseType))) {
        delete host.windowsType;
      }
      modifyOne(host)
        .then(res => {
          this.updateModalVisible = false;
          this.$message.success(res.data.message);
        })
        .catch(error => {
          this.errorMessage(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    wsCall(e) {
    },
  },
  components: {
    HostCreateModal,
    HostUpdateModal,
    IIcon
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
<style lang="scss" scoped>
@import '@/style/db.scss';
@import '@/assets/theme/variable.scss';
.hostIcon {
  height: 2em;
  width: 2em;
  vertical-align: -0.6em;
}
.hostIcon .title {
  vertical-align:middle;
}
.hostForm {
  margin-top: -10px;
}
.production-silk-ribbon,
.ebackup-silk-ribbon {
  text-align: center;
  display: inline-block;
  width: 200px;
  height: 30px;
  line-height: 30px;
  position: absolute;
  border: 1px dashed #fff;
  color: #fff;
  position: absolute;
	bottom: 40px;
	right: -50px;
  z-index: 2;
  transform: rotate(315deg);
}
.production-silk-ribbon {
  box-shadow: 0 0 0 3px #12A17C,0px 21px 5px -18px rgba(0,0,0,0.6);
	background: #12A17C;
}
.ebackup-silk-ribbon {
  box-shadow: 0 0 0 3px #BB266D,0px 21px 5px -18px rgba(0,0,0,0.6);
	background :#BB266D;
}
.silk-ribbon {
	position: relative;
  overflow: visible!important;

}
.ebackup-wrap,
.production-wrap {
	width:100%;
	height: 100%;
	position:absolute;
	bottom: -8px;
	right: -8px;
	overflow:hidden;
}
.ebackup-wrap:before,
.production-wrap:before {
	content: "";
	display: block;
	border-radius: 0 0 10px 10px;
	width: 40px;
	height: 8px;
	position: absolute;
	right: 100px;
  bottom: 0;
}
.ebackup-wrap:after,
.production-wrap:after {
	content:"";
	display:block;
	border-radius:0px 10px 10px 0px;
	width:8px;
	height:40px;
	position:absolute;
	right:0px;
	bottom:100px;
}
.ebackup-wrap:before,
.ebackup-wrap:after {
  background: #881c4f;
}
.production-wrap:before,
.production-wrap:after {
  background: #0f5d49;
}
.hight-light-content {
  /deep/ span {
    @include primary-color;
  }
}
</style>
