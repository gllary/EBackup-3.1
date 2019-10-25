<template>
  <section>
    <el-table :data="items"
              style="width: 100%">
      <el-table-column prop="oracleBackupStrategy"
                       label="oracle备份集保留策略"
                       min-width="150"
                       fixed
                       align="center"></el-table-column>
      <el-table-column prop="sqlserverBackupStrategy"
                       label="sqlserver备份集保留策略"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="fileBackupStrategy"
                       label="文件备份集存储策略"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column label="虚拟机备份集保留策略"
                       min-width="150"
                       align="center"
                       prop="vmBackupStrategy"></el-table-column>
      <el-table-column label="操作"
                       min-width="150"
                       fixed="right"
                       align="center"
                       prop="state">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="dialogVisible=true"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改策略"
              :visible.sync="dialogVisible"
              :before-close="closeDialog"
              @close="modalClosed"
              @open="modalOpened">
      <el-form ref="updateForm"
               status-icon
               :model="formData"
               label-width="180px"
               size="small">
        <el-form-item label="oracle备份集保留策略" prop="oracleBackupStrategy">
          <el-input-number v-model="formData.oracleBackupStrategy" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="sqlserver备份集保留策略" prop="sqlserverBackupStrategy">
          <el-input-number v-model="formData.sqlserverBackupStrategy" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="文件备份集存储策略" prop="fileBackupStrategy">
          <el-input-number v-model="formData.fileBackupStrategy" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="虚拟机备份集保留策略" prop="vmBackupStrategy">
          <el-input-number v-model="formData.vmBackupStrategy" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="submitForm"
                   :loading="btnLoading">确定</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import { fetchAll, modifyOne } from '../../api/backupstrategy';
import isEqual from 'lodash/isEqual';
export default {
  name: 'StrategyManager',
  data() {
    return {
      dialogVisible: false,
      btnLoading: false,
      formData: {},
      originFormData: {},
      items: [],
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data
          this.items = data;
        })
        .catch(error => {
          error => Promise.reject(error);
        })
    },
    submitForm() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.btnLoading=true;
          modifyOne(this.formData)
            .then(res => {
              this.dialogVisible = false;
              const { data, message } = res.data;
              this.$message.success(message);
              this.items.splice(
                0,
                1,
                data
              );
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              this.btnLoading=false;
            });
        } else {
          return false;
        }
      });
    },
    modalOpened() {
      this.originFormData = { ...this.items[0] };
      this.formData = { ...this.items[0] };
    },
    closeDialog(done) {
      if (!isEqual(this.formData, this.originFormData)) {
        this.$confirm('有未保存的修改，是否退出？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      } else {
        this.dialogVisible = false;
      }
    },
    modalClosed() {
      this.$refs.updateForm.clearValidate();
    },
  }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
