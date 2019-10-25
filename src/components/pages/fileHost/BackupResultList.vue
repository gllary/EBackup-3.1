<template>
  <section>
    <el-table :data="data"
              >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <backup-result  :data="scope.row.backupFiles"
                          :type="type"
                          @single-restore-btn-click="restoreBtnClick"></backup-result>
        </template>
      </el-table-column>
      <el-table-column label="备份计划名称"
                       prop="name"
                       min-width="180px"
                       align="center"></el-table-column>
      <el-table-column label="备份开始时间"
                       prop="startTime"
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
      <!-- <el-table-column label="状态"
                       prop="state"
                       min-width="70px"
                       align="center">
        <template slot-scope="scope">
          <i v-if="getState(scope.row) === 0"
             class="el-icon-success"
             :class="$style.successColor"></i>
          <i v-else
             class="el-icon-error"
             :class="$style.errorColor"></i>
        </template>
      </el-table-column> -->
      <el-table-column label="操作"
                       min-width="100px"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import { fileHostBackupTypeMapping } from '@/utils/constant';
import BackupResult from '@/components/pages/fileHost/BackupResult';
import {deleteResultByPlanId} from '@/api/fileHost';
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
  },
  filters: {
    fileHostBackupTypeFilter(val) {
      return fileHostBackupTypeMapping[val];
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
    // 点击恢复按钮
    restoreBtnClick({ id }) {
      this.$emit('single-restore-btn-click', id);
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
            this.$message.success(message)
          }).catch( error => {
            this.$message.error(error);
          });
        })
        .catch(() => { });
    }
  }
};
</script>
<style lang="scss" module>
@import '@/style/color.scss';
</style>
