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
          <el-button type="primary"
                      @click="addFn">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="processedTableData"
              style="width: 100%"
              @filter-change="filterChange"
              v-show="showType === 'list'">
      <el-table-column label="主机名"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <router-link :to="`${scope.row.id}`"
                        append
                        class="routerLink">{{scope.row.hostName}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="别名"
                       prop="hostAlias"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="hostIp"
                       label="主机IP"
                       min-width="200"
                       align="center"></el-table-column>
      <el-table-column label="操作系统"
                       min-width="180"
                       prop="osName"
                       column-key="osName"
                       :filters="Array.from(new Array('Windows', 'Linux'), val => ({text: val, value: val}))"
                       align="center">
        <template slot-scope="scope">
          {{ scope.row.osName+`${scope.row.systemVersion?'-'+scope.row.systemVersion:''}` }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间"
                       min-width="180"
                       align="center">
        <template slot-scope="scope">
          <el-tag size="mini">{{ scope.row.createTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="150"
                       header-align="center"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="modifyFn(scope.row)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="deleteFileHost(scope.row)"></el-button>
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
                <i-icon :name="processedTableData[row * 3 + col].osName.toLowerCase()"
                        class="titleIcon"></i-icon>
                <router-link :to="`${processedTableData[row * 3 + col].id}`"
                             append
                             class="title routerLink">{{processedTableData[row * 3 + col].hostName}}</router-link>
                <el-tooltip content="删除" placement="top" effect="light">
                  <i class="el-icon-delete delete"
                     @click="deleteFileHost(processedTableData[row * 3 + col])"></i>
                </el-tooltip>
                <el-tooltip content="修改" placement="top" effect="light">
                  <i class="el-icon-edit edit"
                     @click="modifyFn(processedTableData[row * 3 + col])"></i>
                </el-tooltip>
              </div>
              <el-form label-position="right"
                      label-width="80px"
                      class="dbForm"
                      inline>
                <el-form-item label="别名"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].hostAlias }}</span>
                </el-form-item>
                <el-form-item label="主机IP"
                              class="formItem">
                  <span>{{ processedTableData[row * 3 + col].hostIp }}</span>
                </el-form-item>
                <el-form-item label="创建时间"
                              class="formItem">
                  <el-tag size="mini"
                          type="primary">{{ processedTableData[row * 3 + col].createTime }}</el-tag>
                </el-form-item>
              </el-form>
            </el-card>
            <!-- <div :class="processedTableData[row * 3 + col].state | wrapStyleFilter">
              <div :class="processedTableData[row * 3 + col].state | ribbonStyleFilter">{{ databaseState(processedTableData[row * 3 + col].state) }}</div>
            </div> -->
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
                   :total="total"></el-pagination>
    <database-modal  :visible.sync="modalVisible"
                     :btn-loading="btnLoading"
                     :action="action"
                     :data="currentSelectData"
                     @confirm="confirmCall"></database-modal>
  </section>
</template>
<script>
import DatabaseModal from '@/components/pages/file/DatabaseModal';
import { applyFilterMethods } from '@/utils/common';
import { paginationMixin, filterMixin, sortMixin } from '@/components/mixins/commonMixin';
import themeMixin from '@/components/mixins/themeMixins';
import switchViewMixins from '@/components/mixins/switchViewMixins';
import { fetchAll, createOne, modifyOne, deleteOne } from '@/api/file';
const OperateFileHost = {
  create: createOne,
  update: modifyOne
}
export default {
  name: 'FileHostList',
  mixins: [paginationMixin, filterMixin, sortMixin, switchViewMixins, themeMixin],
  data() {
    return {
      tableData: [],
      inputSearch: '',
      tableFilter: {},
      modalVisible: false,
      action: 'create',
      currentSelectData: null,
      btnLoading: false,
      defaultSort: { prop: 'createTime', order: 'descending' },
    };
  },
  watch: {
    inputSearch() {
      if (this.inputSearch === '') {
        this.filter = Object.assign({}, this.tableFilter);
        this.currentPage = 1;
      }
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.tableData = Array.isArray(data) ? data : [];
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    searchByName(){
      const hostName = this.inputSearch;
      this.filter = Object.assign({},{hostName}, this.tableFilter);
      this.currentPage = 1;
    },
    filterChange(filters){
      this.tableFilter = Object.assign({}, this.tableFilter, filters);
      this.filter = Object.assign({}, this.filter, this.tableFilter);
    },
    filterFn(item, i) {
      if(Array.isArray(this.filter[i]) && this.filter[i].length > 0){
        return this.filter[i].includes(item[i]);
      }else {
        return item[i].toLowerCase().includes(this.filter[i].toLowerCase());
      }
    },
    addFn() {
      this.modalVisible = true;
      this.action = 'create';
      this.currentSelectData = null;
    },
    toguide(){
      this.$router.push({ name: 'fileSystemDeletion', query: { aId:'fileSystemManual' }})
    },

    modifyFn(row) {
      this.modalVisible = true;
      this.action = 'update';
      this.currentSelectData = row;
    },
    deleteFileHost(row) {
      this.$confirm('此操作将删除此系统', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteOne(row.id)
            .then(() => {
              this.fetchData();
              this.$message.success({
                message: '删除成功!',
              });
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(() => {});
    },
    confirmCall(data, type) {
      this.btnLoading = true;
      OperateFileHost[type](data)
        .then(res => {
          const { message } = res.data;
          this.fetchData();
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.modalVisible = false;
          this.btnLoading = false;
        })
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
@import '@/assets/theme/variable.scss';
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