<template>
  <section>
    <el-form inline size="medium">
      <el-form-item style="float: right">
        <el-button type="info"
                   @click="$router.push({name: 'versionList'})">版本库</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary">部署</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="processedTableData"
              tooltip-effect="light">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="right"
                   label-width="100px"
                   inline>
            <el-form-item label="操作系统"
                          class="detailFormItem">
              <span>{{ props.row.agentOs }}</span>
            </el-form-item>
            <el-form-item label="wrapper部署"
                          class="detailFormItem">
              <el-tag :type="props.row.depPackage.isWrapper | wrapperTagFilter"
                      size="mini">
                {{ props.row.depPackage.isWrapper | yesOrNoFilter }}
              </el-tag>
            </el-form-item>
            <el-form-item label="安装路径"
                          class=""></el-form-item>
            <el-form-item label="部署时间"
                          class="detailFormItem">
              <i class="el-icon-time"></i>
              <span>{{ props.row.startTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号"
                       width="60"
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pageSize}}
        </template>
      </el-table-column>
      <el-table-column label="代理IP"
                       width="130"
                       align="center"
                       prop="agentIp"></el-table-column>
      <el-table-column label="部署包"
                       min-width="100"
                       align="center"
                       prop="depPackage.packageName"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-popover trigger="hover"
                      placement="top">
            <span>
              {{ scope.row.depPackage.updateMsg }}
            </span>
            <div slot="reference">
              <i class="el-icon-info"></i>
              <span>{{ scope.row.depPackage.packageName }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="所属版本"
                       min-width="100"
                       show-overflow-tooltip
                       align="center"
                       prop="depPackage.version.versionCode">
        <template slot-scope="scope">
          <el-popover trigger="hover"
                      placement="top">
            <span>
              {{ scope.row.depPackage.version.versionMsg }}
            </span>
            <div slot="reference">
              <i class="el-icon-info"></i>
              <span>{{ scope.row.depPackage.version.versionCode }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="部署状态"
                       min-width="60"
                       align="center"
                       prop="depState">
        <template slot-scope="scope">
          <el-tag size="mini"
                  :type="scope.row.depState | depStateTagFilter">
            {{ scope.row.depState |  deployStateFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <el-tooltip effect="light"
                      content="修改"
                      placement="top-start">
            <el-button type="primary"
                     icon="el-icon-edit"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"></el-button>
          </el-tooltip>
          <el-tooltip effect="light"
                      content="卸载"
                      placement="top-start">
            <el-button type="danger"
                       icon="el-icon-edit"
                       circle
                       size="mini"
                       :class="$style.miniCricleIconBtn"></el-button>
          </el-tooltip>
          <el-tooltip effect="light"
                      content="启动"
                      placement="top-start">
            <el-button type="success"
                       icon="el-icon-check"
                       circle
                       size="mini"
                       :class="$style.miniCricleIconBtn"></el-button>
          </el-tooltip>
          <el-tooltip effect="light"
                      content="停止"
                      placement="top-start">
            <el-button type="info"
                       icon="el-icon-minus"
                       circle
                       size="mini"
                       :class="$style.miniCricleIconBtn"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 10px; text-align: right"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[5, 10, 15, 20]"
                  :page-size="pageSize"
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
    </el-pagination>
  </section>
</template>

<script>
import { fetchPackageRecords } from '@/api/deploy';
import { paginationMixin, sortMixin } from '@/components/mixins/commonMixin';
import { yesOrNoMapping, deployStateMapping } from '@/utils/constant';
export default {
  name: 'VersionManager',
  mixins: [paginationMixin, sortMixin],
  data() {
    return {
      tableData: [],
      defaultSort: { prop: 'startTime', order: 'descending' },
    }
  },
  created() {
    this.fetchData();
  },
  filters: {
    yesOrNoFilter(type) {
      return yesOrNoMapping[type];
    },
    deployStateFilter(state) {
      return deployStateMapping[state];
    },
    depStateTagFilter(type) {
      if(type === 2) {
        return 'success';
      } else if ([3, 4].includes(type)) {
        return 'danger';
      } else if (type === 5) {
        return 'info';
      }
      return 'warning';
    },
    wrapperTagFilter(type) {
      if(type === 1) {
        return 'primary';
      }
      return 'info';
    }
  },
  methods: {
    fetchData() {
      fetchPackageRecords()
        .then(res => {
          const { data } = res.data;
          this.tableData = data;
        })
        .catch(error => {
          this.$message.error(error);
        });
    }
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>
<style scoped>
.detailFormItem {
  width: 50%;
  margin-right: 0;
  margin-bottom: 0;
}
.detailFormItem:nth-child(2n){
  width: 69%;
}
</style>

