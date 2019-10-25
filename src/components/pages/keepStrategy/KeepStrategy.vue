<template>
  <section>
    <el-row>
      <el-form inline
               size="small">
               <el-form-item style="float: right;">
                  <el-button type="success"
                            @click="toguide('StoreAddress')">操作说明</el-button>
              </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary"
                    @click="createStrategy()">添加</el-button>
        </el-form-item>
      </el-form>
      
    </el-row>
    <el-table :data="strategys"
              style="width: 100%">
      <el-table-column prop="hostType"
                       label="设备类型"
                       align="center"
                       min-width="120"
                       :formatter="convertHostType"></el-table-column>
      <el-table-column prop="keepType"
                       label="保留策略"
                       align="center"
                       min-width="150"
                       :formatter="convertKeepType"></el-table-column>
      <el-table-column prop="keepDate"
                       label="时间策略"
                       align="center"
                       min-width="110"
                       :formatter="convertKeepDate"></el-table-column>
      <el-table-column align="center"
                       min-width="150"
                       label="调度时间">
        <template slot-scope="scope">
          <span v-if="!scope.row.scheduleDate || scope.row.hostType !== 3"></span>
          <el-tag size="mini"
                  v-else>
            {{ Number(scope.row.keepDate) === 1 ? convertWeek(scope.row) : scope.row.scheduleDate + '号' }} {{ scope.row.scheduleTime }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="容器数量"
                       min-width="80"
                       align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.totalContainer || scope.row.keepType !== 1"></span>
          <span v-else>{{ scope.row.totalContainer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前容器"
                       min-width="80"
                       align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.currentContainer || scope.row.keepType !== 1"></span>
          <span v-else>{{ scope.row.currentContainer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备份集清除脚本路径"
                       show-overflow-tooltip
                       min-width="180"
                       align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.scriptsPath || scope.row.hostType !== 3 || scope.row.keepType !== 2"></span>
          <span v-else>{{ scope.row.scriptsPath }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="120"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="modifyStrategy(scope)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="deleteStrategy(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <operate-modal :visible.sync="modalVisible"
                   :btn-loading="btnLoading"
                   :action="operate"
                   :data="selectData"
                   :all-host-type="allHostType"
                   @confirm="confirmCall"></operate-modal>
  </section>
</template>
<script>
import {
  fetchAll,
  modifyOne,
  createOne,
  deleteOne
} from '@/api/keepstrategy';
import {
  useTypeMapping,
  keepStrategyMapping,
  keepDateMapping,
  weekMapping
} from '@/utils/constant';
import OperateModal from '@/components/pages/keepStrategy/OperateModal';
const OperateOne = {
  create: createOne,
  update: modifyOne
};
export default {
  name: 'KeepStrategy',
  data() {
    return {
      strategys: [],
      modalVisible: false,
      btnLoading: false,
      operate: 'create',
      selectData: null
    }
  },
  created() {
    this.fetchData();
  },
  computed: {
    allHostType() {
      return this.strategys.map(strategy => strategy.hostType);
    }
  },
  methods: {
    toguide(id){
      let select = id;
      localStorage.setItem('id',select);
      this.$router.push({ name: 'equipmentManage', query: { aId:'configurationManage' }})
    },
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.strategys = data;
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    convertHostType(row) {
      return useTypeMapping[row.hostType];
    },
    convertKeepType(row) {
      return keepStrategyMapping[row.keepType];
    },
    convertKeepDate(row) {
      if(!row.keepDate || row.hostType !== 3)
        return '';
      return keepDateMapping[row.keepDate];
    },
    convertWeek(row) {
      return weekMapping[row.scheduleDate];
    },
    createStrategy() {
      this.operate = 'create';
      this.selectData = {};
      this.modalVisible = true;
    },
    modifyStrategy(scope) {
      this.operate = 'update';
      this.selectData = scope.row;
      this.modalVisible = true;
    },
    confirmCall(formData) {
      this.btnLoading = true;
      OperateOne[this.operate](formData)
        .then(res => {
          const { message } = res.data;
          this.fetchData();
          this.modalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    deleteStrategy(scope) {
      this.$confirm(`此操作将删除${this.convertHostType(scope.row)}备份保留策略, 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteOne(scope.row.id)
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
    }
  },
  components: {
    OperateModal
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>

