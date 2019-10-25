<template>
  <section>
    <el-table :data="backupResults">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <backup-result  :data="scope.row.fmtData"
                          :backupType="scope.row.backupType"
                          :type="type"
                          @single-restore-btn-click="restoreResultBtnClick"
                          @refresh="refreshResults"></backup-result>
        </template>
      </el-table-column>
      <el-table-column label="备份计划名称"
                       prop="name"
                       min-width="180px"
                       align="center"></el-table-column>
      <el-table-column label="计划创建时间"
                       prop="createTime"
                       min-width="180px"
                       align="center"
                       header-align="center"></el-table-column>
      <el-table-column  label="备份类型"
                       prop="backupType"
                       min-width="100px"
                       align="center"
                       header-align="center">
        <template slot-scope="scope">
          <span>{{scope.row.backupType |fileHostBackupTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       prop="state"
                       min-width="70px"
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
                       min-width="100px"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="del(scope.row)">删除</el-button>
          <!-- <el-button type="text"
                     style="margin-left:0"
                     size="small"
                     :disabled="scope.row.backupType === 3"
                     @click="restorePlanBtnClick(scope.row)">恢复</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import dayjs from 'dayjs';
import { filehostBackupTypeMapping } from '@/utils/constant';
import BackupResult from '@/components/pages/file/BackupResult';
import { deleteResultByPlanId } from '@/api/file';
import { fmtSizeFn } from '@/utils/common';
export default {
  name: 'BackupResultList',
  components: {
    BackupResult
  },
  props: {
    type: {
      type: String
    },
    data: {
      type: Array,
      required: true,
      default: () => []
    },
  },
  computed: {
    backupResults() {
      return this.fmtData(this.data);
    }
  },
  filters: {
    fileHostBackupTypeFilter(val) {
      return filehostBackupTypeMapping[val];
    }
  },
  methods: {
    getState(row) {
      const result = row.backupFiles;
      const state = 0;
      try {
        result.forEach(i => {
          if (i.state === 1) {
            throw new Error('跳出');
          }
        });
      } catch (error) {
        state === 1;
      }
      return state;
    },
    fmtData(data) {
      return data.map(res => {
        let filesData = res.backupFiles.map((r, i, arr) => {
          return Object.assign({}, r);
        });
        const map = {};
        filesData.forEach((result, index) => {
          const {size} = result;
          let fmtSize = 0;
          fmtSize = fmtSizeFn(size);
          result.size = fmtSize ? fmtSize : 0;
          // 当索引为0时，!0等于true，此处不建议用索引，可以绑定id进行唯一标识
          if (!map[result.sourcePath]) {
            map[result.sourcePath] = [];
            map[result.sourcePath].push(result);
          } else {
            map[result.sourcePath].push(result);
          }
        });
        const fmtData = Object.keys(map).map(e => {
          const fData = map[e].sort((a, b) => {
            return dayjs(b.endTime) - dayjs(a.endTime);
          });
          return Object.assign({}, map[e][0], {list: fData});
        });
        res.fmtData = fmtData;
        if(fmtData.find(item => item.state === 1)) {
          res.state = 1;
        } else {
          res.state = 0;
        }
        return res;
      });
    },
    // 点击恢复按钮
    restoreResultBtnClick(id, backupType, type) {
      this.$emit('single-restore-btn-click', id, backupType, type);
    },
    restorePlanBtnClick({ id, backupType }) {
      this.$emit('single-restore-btn-click', id, backupType, 'restorePlan');
    },
    del(row) {
      this.$confirm('请确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const id = row.id;
          deleteResultByPlanId(id).then(res => {
            const {message} = res.data;
            this.$message.success(message);
          }).catch( error => {
            this.$message.error(error);
          }).then(() => {
            this.refreshResults();
          })
        })
        .catch(() => { });
      // this.$emit('deleteResult', row.id);
    },
    refreshResults() {
      this.$emit('refresh');
    }
  }
};
</script>
<style lang="scss" module>
@import '@/style/color.scss';
</style>
