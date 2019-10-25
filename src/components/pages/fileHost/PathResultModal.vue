<template>
  <section>
<el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
              >
      <span slot="title">
        备份集列表
      </span>
    <el-table :data="processedTableData|NotNullfilter" size="small"
              @sort-change="sortChangeFn"
              :default-sort="defaultSort">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form inline
                   label-width="130px"
                   size="mini"
                   class="path-result-detail-form">
            <el-form-item :class="$style.detailFormItem"
                          label="备份文件名">
              <span>{{ scope.row.fileName }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="备份文件存放路径">
              <span>{{ scope.row.targetPath }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="开始时间">
              <span>{{ scope.row.startTime }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="备份文件源路径">
              <span>{{ scope.row.sourcePath }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="结束时间">
              <span>{{ scope.row.endTime }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="NFS挂载点路径"
                          v-if="type==='linux'">
              <span>{{ scope.row.pointPath }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="文件标识符"
                          v-if="type==='windows'">
              <span>{{ scope.row.identifier }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="大小">
              <span>{{ scope.row.size }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="状态">
              <span>
                <el-tag size="mini"
                        :type="scope.row.state === 1 ? 'danger' : 'success'">{{ stateConverter(scope.row.state) }}</el-tag>
              </span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="持续时间">
              <span>{{ scope.row.consume | durationFilter }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="错误信息"
                          v-if="scope.row.state === 1">
              <span>{{ scope.row.errorMsg }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="源文件路径"
                       prop="sourcePath"
                       show-overflow-tooltip
                       min-width="80px"
                       align="center"
                       header-align="center"></el-table-column>
      <el-table-column label="备份文件名"
                       prop="fileName"
                       min-width="80px"
                       show-overflow-tooltip
                       align="center"
                       header-align="center"></el-table-column>
      <el-table-column label="开始时间"
                       prop="startTime"
                       min-width="140px"
                       align="center"></el-table-column>
      <el-table-column label="结束时间"
                       prop="endTime"
                       min-width="140px"
                       :sortable="true"
                       align="center"></el-table-column>
      <el-table-column label="大小"
                       prop="size"
                       min-width="60px"
                       align="center"></el-table-column>
      <el-table-column label="状态"
                      fixed="right"
                       prop="state"
                       min-width="45px"
                       align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.state === 0"
             class="el-icon-success"
             :class="$style.successColor"></i>
          <i v-else
             class="el-icon-error"
             :class="$style.errorColor"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                      fixed="right"
                       min-width="45px"
                       align="left">
        <template slot-scope="scope">
            <el-button type="text"
                        size="small"
                        @click="del(scope.row)">删除</el-button>
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
    <span slot="footer">
        <el-button @click="cancelBtnClick" >取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import dayjs from 'dayjs';
import baseMixin from '@/components/mixins/baseMixins';
// import backupResultMixin from '@/components/mixins/backupResultMixin';
import { paginationMixin, sortMixin } from '@/components/mixins/commonMixin';
import { fmtSizeFn } from '@/utils/common';
import {deleteResultById} from '@/api/file';
import { backupResultMapping} from '@/utils/constant';

export default {
  name: 'BackupResult',
  mixins: [baseMixin, paginationMixin, sortMixin],
  props: {
    type: {
      type: String
    },
    visible: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Array
    }
  },
  data() {
    return {
      pageSize: 5,
      defaultSort: { prop: 'endTime', order: 'descending' }
    }
  },
  computed: {
    // 文件服务器备份集中 只有最新对备份集才能用于恢复
    tableData() {
      console.log(this.total)
      return this.data;
    },
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    },
  },
  methods: {
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return backupResultMapping[stateCode];
    },
    del(row) {
      this.$confirm('请确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const id = row.id;
          deleteResultById(id).then(res => {
            const {message} = res.data;
            this.$message.success(message)
          }).catch( error => {
            this.$message.error(error);
          });
        })
        .catch(() => { });
    },
    cancelBtnClick() {
      this.modalVisible = false;
    }
  }
};
</script>
<style lang="scss" module>
@import '@/style/color.scss';
.detailFormItem {
  margin: {
    right: 0 !important;
    bottom: 0 !important;
  }
  width: 45%;
  &:nth-child(2n) {
    width: 54%;
  }
}
</style>
<style>
.margin-top10{
  margin-top: 10px;
}
.text-right{
  text-align: right;
}
.path-result-detail-form .el-form-item__label,.path-result-detail-form .el-form-item__content{
  font-size: 12px !important;
}
</style>

