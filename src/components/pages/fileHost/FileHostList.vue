<template>
  <section>
    <el-row>
      <el-form inline
             size="small">
        <el-form-item label="操作系统">
          <el-checkbox-group v-model="sysTypeFilter">
            <el-checkbox-button label="Windows"></el-checkbox-button>
            <el-checkbox-button label="Linux"></el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item style="float: right;">
            <el-button type="success"
                      @click="toguide()">操作说明</el-button>
          </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary"
                    @click="addFn">添加</el-button>
      </el-form-item>
    </el-form>
    </el-row>
    <el-table :data="filteredInfos"
              style="width: 100%">
      <el-table-column label="主机名"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <router-link :to="`${scope.row.id}`"
                        append
                        class="routerLink">{{scope.row.hostName}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="hostIp"
                       label="主机IP"
                       width="240"
                       align="center"></el-table-column>
      <el-table-column prop="osName"
                       label="操作系统"
                       width="220"
                       align="center"></el-table-column>
      <el-table-column label="操作"
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
                     @click="deleteFileHost(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <database-modal  :visible.sync="createModalVisible"
                        :btn-loading="btnLoading"
                        :action="action"
                        :data="currentSelectData"
                        @confirm="confirmCall"></database-modal>
  </section>
</template>
<script>
import DatabaseModal from '@/components/pages/fileHost/DatabaseModal';
import tableMixin from '@/components/mixins/databaseTableMixin';
import { applyFilterMethods } from '@/utils/common';

export default {
  name: 'FileHostList',
  mixins: [tableMixin],
  data() {
    return {
      databaseType: 'file-host',
      sysTypeFilter: ['Windows', 'Linux'],
    };
  },
  computed: {
    filteredInfos() {
      const filterMethods = [];
      filterMethods.push(info => this.sysTypeFilter.indexOf(info.osName) >= 0);
      return applyFilterMethods(this.tableData, filterMethods);
    },
  },
  methods: {
    deleteFileHost(scope) {
      this.delete(scope, '此操作将删除此系统?');
    },
    toguide(path){
      this.$router.push({ name: 'fileSystemDeletion', query: { aId:'fileSystemDeletion' }})

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
