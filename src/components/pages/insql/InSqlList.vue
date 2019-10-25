<template>
  <section>
    <el-row>
      <el-form inline
               size="medium">
        <el-form-item style="float: left">
          <i-icon :name="`${theme}-list-btn`"
                  :class="`{ ${showType === 'list' ? 'active-btn' : 'inactive-btn'} }`"
                  @click.native="switchList"></i-icon>
          <span class="switch-division">/</span>
          <i-icon :name="`${theme}-card-btn`"
                  :class="`{ ${showType === 'card' ? 'active-btn' : 'inactive-btn'} }`"
                  @click.native="switchCard"></i-icon>
        </el-form-item>
        <el-form-item style="float: left">
          <el-input placeholder="请输入名称"
                    v-model="inputSearch"
                    @keyup.enter.native="searchByName">
            <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item style="float: right;">
            <el-button type="success"
                      @click="toguide">操作说明</el-button>
          </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="info"
                    @click="$router.push({name: 'insqlTakeOver'})">一键接管</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary"
                    @click="batchCreateModalVisible = true">批量添加</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary"
                    @click="addFn">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="processedTableData"
              style="width: 100%"
              @filter-change="filterChange"
              v-show="showType === 'list'">
      <el-table-column label="序号"
                       min-width="100"
                       fixed
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pageSize}}
        </template>
      </el-table-column>
      <el-table-column label="名称"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <router-link :to="`${scope.row.id}`"
                        append
                        class="routerLink">{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="instanceName"
                       label="数据库名"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="host.hostIp"
                       label="主机IP"
                       min-width="200"
                       align="center"></el-table-column>
      <!-- <el-table-column prop="loginName"
                       label="登录账号"
                       min-width="150"
                       align="center"></el-table-column> -->
      <el-table-column prop="role"
                       label="角色"
                       :filters="roleFilters"
                       column-key="role"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="roleTagType(scope.row.role)"
                  size="mini">
            {{ databaseRole(scope.row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="state"
                       label="状态"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="stateTagType(scope.row.state)"
                  size="mini">
            {{ databaseState(scope.row.state) }}
          </el-tag>
        </template>      
      </el-table-column>
      <el-table-column label="操作"
                       fixed="right"
                       width="150"
                       header-align="center"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="modifyDb(scope.row)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="deleteDb(scope.row)"></el-button>
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
                <el-tag :type="roleTagType(processedTableData[row * 3 + col].role)"
                        size="mini">
                  {{ databaseRole(processedTableData[row * 3 + col].role) }}
                </el-tag>
                <router-link :to="`${processedTableData[row * 3 + col].id}`"
                             class="title routerLink"
                             append>{{processedTableData[row * 3 + col].name}}</router-link>
                <el-tooltip content="删除" placement="top" effect="light">
                  <i class="el-icon-delete delete"
                  @click="deleteDb(processedTableData[row * 3 + col])"></i>
                </el-tooltip>
                <el-tooltip content="修改" placement="top" effect="light">
                  <i class="el-icon-edit edit"
                  @click="modifyDb(processedTableData[row * 3 + col])"></i>
                </el-tooltip>
              </div>
              <el-form label-position="right"
                      label-width="80px"
                      class="dbForm"
                      inline>
                <el-form-item label="数据库名"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].instanceName }}</span>
                </el-form-item>
                <el-form-item label="主机IP"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].host.hostIp }}</span>
                </el-form-item>
                <el-form-item label="端口"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].dbPort }}</span>
                </el-form-item>
                <el-form-item label="登录账号"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].loginName }}</span>
                </el-form-item>
              </el-form>
            </el-card>
            <div :class="processedTableData[row * 3 + col].state | wrapStyleFilter">
              <div :class="processedTableData[row * 3 + col].state | ribbonStyleFilter">{{ databaseState(processedTableData[row * 3 + col].state) }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </section>
    <el-pagination class="margin-top10 text-right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="showType === 'list' ? [5, 10, 15, 20] : [6, 9, 12, 15]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    <database-modal :visible.sync="createModalVisible"
                    :btn-loading="btnLoading"
                    :action="action"
                    :data="currentSelectData"
                    @confirm="confirmCall"></database-modal>
    <batch-database-create-modal type="insql"
                           :visible.sync="batchCreateModalVisible"
                           :btn-loading="btnLoading"
                           @confirm="batchCreateDb"></batch-database-create-modal>
  </section>
</template>
<script>
import DatabaseModal from '@/components/pages/insql/DatabaseModal';
import tableMixin from '@/components/mixins/databaseTableMixin';
import switchViewMixins from '@/components/mixins/switchViewMixins';
import BatchDatabaseCreateModal from '@/components/modal/BatchDatabaseCreateModal';
import { batchCreate } from '@/api/insql';

export default {
  name: 'InSqlList',
  mixins: [tableMixin, switchViewMixins],
  data(){
    return {
      databaseType: 'insql',
      batchCreateModalVisible: false,
      tableFilter: {},
      roleFilters: [
        { text: '无连接', value: 0 },
        { text: '主库', value: 1 },
        { text: '备库', value: 2 }
      ]
    }
  },
  watch: {
    inputSearch() {
      if (this.inputSearch === '') {
        this.filter = Object.assign({}, this.tableFilter);
        this.currentPage = 1;
      }
    }
  },
  methods: {
    filterChange(filters){
      this.tableFilter = Object.assign({}, this.tableFilter, filters);
      this.filter = Object.assign({}, this.filter, this.tableFilter);
    },
    filterFn(item, i){
      if(Array.isArray(this.filter[i]) && this.filter[i].length > 0){
        return this.filter[i].includes(item[i]);
      }else {
        return item[i].toLowerCase().includes(this.filter[i].toLowerCase());
      }
    },
    searchByName(){
      const name = this.inputSearch;
      this.filter = Object.assign({},{name}, this.tableFilter);
      this.currentPage = 1;
    },
    deleteDb(row) {
      this.delete(row, '确认删除此数据库?');
    },
    toguide(){
      this.$router.push({ name: 'addDataBase', query: { aId:'addDataBaseManual' }})
    },
    // 从服务器获取所有的Oracle数据库
    batchCreateDb(data){
      this.btnLoading = true;
      batchCreate(data)
        .then(res => {
          this.batchCreateModalVisible = false;
          this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    }
  },
  components: {
    DatabaseModal,
    BatchDatabaseCreateModal
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>
<style lang="scss" scoped>
@import '@/style/db.scss';
.margin-top20{
  margin-top: 20px;
}
.margin-top10{
  margin-top: 10px;
}
.text-right{
  text-align: right;
}
</style>
