<template>
  <section>
    <el-row>
      <el-form inline
               size="medium">
        <el-form-item style="float: right;">
        <el-button type="success"
                  @click="toguide">操作说明</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="info"
                     @click="$router.push({name: 'applicationTakeOver'})">一键接管</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary"
                    @click="addFn">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="processedTableData">
      <el-table-column label="序号"
                       min-width="60"
                       fixed
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pageSize}}
        </template>
      </el-table-column>
      <el-table-column label="名称"
                       prop="name"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column label="主机IP"
                       prop="host.hostIp"
                       align="center"
                       min-width="200"></el-table-column>
      <el-table-column label="角色"
                       prop="role"
                       align="center"
                       min-width="100">
        <template slot-scope="scope">
          <el-tag :type="roleTagType(scope.row.role)"
                  size="mini">
            {{ databaseRole(scope.row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间"
                       prop="createTime"
                       align="center"
                       min-width="150"></el-table-column>
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
                     @click="modifyFn(scope)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="deleteFn(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="margin-top10 text-right"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[5, 10, 15, 20]"
                  :page-size="pageSize"
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
    </el-pagination>
    <operate-modal :visible.sync="modalVisible"
                   :action="action"
                   :data="currentSelectData"
                   @confirm="confirmCall"></operate-modal>
  </section>
</template>
<script>
import {
  fetchAll
} from '@/api/application';
import { paginationMixin, sortMixin } from '@/components/mixins/commonMixin';
import { databaseRoleMapping } from '@/utils/constant';
import OperateModal from '@/components/pages/application/OperateModal';
import { deleteOne } from '@/api/application';
export default {
  name: 'ApplicationList',
  mixins: [paginationMixin, sortMixin],
  components: {
    OperateModal
  },
  data() {
    return {
      tableData: [],
      defaultSort: { prop: 'createTime', order: 'descending' },
      currentSelectData: null,
      modalVisible: false,
      action: 'create'
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    toguide(){
      this.$router.push({ name: 'addApplication', query: { aId:'addApplication' }})
    },
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.tableData = data;
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    roleTagType(role) {
      switch (role) {
        case 1:
          return '';
        case 0:
        case 2:
          return 'info';
        default:
          return '';
      }
    },
    databaseRole(role) {
      return databaseRoleMapping[role];
    },
    addFn() {
      this.modalVisible = true;
      this.action = 'create';
      this.currentSelectData = null;
    },
    modifyFn({ row }) {
      this.modalVisible = true;
      this.action = 'update';
      this.currentSelectData = row;
    },
    deleteFn({ row }) {
      this.$confirm(`此操作将删除${row.name}应用服务器？是否继续`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteOne(row.id)
            .then(() => {
              this.fetchData();
              this.$message.success('删除成功！');
            })
            .catch(error => {
              this.$message.error(error);
            })
        })
        .catch(() => {
          this.$message.info('已取消删除操作！');
        })
    },
    confirmCall() {
      this.fetchData();
    }
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>
<style scoped>
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

