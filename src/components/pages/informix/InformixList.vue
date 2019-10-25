<template>
  <section>
    <el-row>
      <el-form size="medium"
               inline>
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
        <el-form-item style="float: right">
          <el-button type="primary"
                     @click="addFn">添加</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="success"
                    @click="toguide">操作说明</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="processedTableData"
              class="custom-scrollbar"
              style="width: 100%"
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
      <el-table-column prop="serverName"
                       label="服务名"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="dbPort"
                       label="端口"
                       align="center"
                       width="80"></el-table-column>
      <el-table-column prop="host.hostIp"
                       label="主机IP"
                       min-width="150"
                       align="center"></el-table-column>
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
                       width="120"
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
                <el-form-item label="服务名"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].serverName }}</span>
                </el-form-item>
                <el-form-item label="端口"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].dbPort }}</span>
                </el-form-item>
                <el-form-item label="主机IP"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].host.hostIp }}</span>
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
  </section>
</template>
<script>
import DatabaseModal from '@/components/pages/informix/DatabaseModal';
import tableMixin from '@/components/mixins/databaseTableMixin';
import switchViewMixins from '@/components/mixins/switchViewMixins';

export default {
  name: 'InformixList',
  mixins: [tableMixin, switchViewMixins],
  data(){
    return {
      databaseType: 'informix',
    }
  },
  watch: {
    inputSearch() {
      if (this.inputSearch === '') {
        this.filter = {};
        this.currentPage = 1;
      }
    }
  },
  methods: {
    filterFn(item, i){
      return item[i].toLowerCase().includes( this.filter[i].toLowerCase());
    },
    searchByName(){
      const name = this.inputSearch;
      this.filter = Object.assign({},{name});
      this.currentPage = 1;
    },
    deleteDb(row) {
      this.delete(row, '确认删除此数据库?');
    },
    toguide(){
      this.$router.push({ name: 'addDataBase', query: { aId:'addDataBaseManual' }})
    }
  },
  components: {
    DatabaseModal
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