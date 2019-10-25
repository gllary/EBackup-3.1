<template>
  <section>
    <el-row>
      <el-form inline
               size="small">
        <el-form-item style="float: right;">
            <el-button type="success"
            @click="toguide('port')">操作说明</el-button>
        </el-form-item>
      </el-form>
    </el-row> 

    <el-table :data="ports"
              style="width: 100%">
      <el-table-column type="index"
                        width="100"
                        align="center"></el-table-column>
      <el-table-column prop="type"
                        label="类型"
                        min-width="200"
                        :formatter="convertType"
                        align="center"></el-table-column>
      <el-table-column prop="port"
                        label="端口号"
                        min-width="200"
                        align="center"></el-table-column>
      <el-table-column label="操作"
                        width="200"
                        align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                      icon="el-icon-edit"
                      circle
                      size="mini"
                      :class="$style.miniCricleIconBtn"
                      @click="modifyPort(scope)"></el-button>
          <!-- <el-button type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                      :class="$style.miniCricleIconBtn"
                      @click="deletePort(scope)"></el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <operate-port-modal :visible.sync="modalVisible"
                        :btn-loading="btnLoading"
                        :action="operate"
                        :data="selectData"
                        :all-type="allType"
                        @confirm="confirmCall"></operate-port-modal>
  </section>
</template>
<script>
import { portHostTypeMapping } from '@/utils/constant';
import { fetchAll, deleteOne, createOne, modifyOne } from '@/api/port';
import OperatePortModal from '@/components/pages/port/OperatePortModal';
const OperateOne = {
  create: createOne,
  update: modifyOne
};
export default {
  name: 'PortList',
  data() {
    return {
      ports: [],
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
    allType() {
      return this.ports.map(v => v.type);
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
          this.ports = data;
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    convertType({ type }) {
      return portHostTypeMapping[type];
    },
    createPort() {
      this.operate = 'create';
      this.selectData = {};
      this.modalVisible = true;
    },
    modifyPort(scope) {
      this.operate = 'update';
      this.selectData = scope.row;
      this.modalVisible = true;
    },
    deletePort(scope) {
      this.$confirm(`此操作将删除${this.convertType(scope.row)}的端口号${scope.row.port}, 是否继续？`, '提示', {
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
  },
  components: {
    OperatePortModal
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>

