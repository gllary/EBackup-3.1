<template>
  <section>
    <el-row>
      <el-form inline
               size="small">
        <el-form-item style="float: right;">
        <el-button type="success"
                  @click="toguide('CloudStorage')">操作说明</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary"
                    @click="createOne()"
                    :disabled="items.length > 1">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="items"
              style="width: 100%">
      <el-table-column prop="ak"
                       label="访问密匙"
                       align="center"
                       show-overflow-tooltip
                       tooltip-effect="light"></el-table-column>
      <el-table-column prop="sk"
                       label="安全密匙"
                       align="center"
                       show-overflow-tooltip
                       tooltip-effect="light"></el-table-column>
      <el-table-column prop="endPoint"
                       label="区域地址"
                       align="center"
                       show-overflow-tooltip
                       tooltip-effect="light"></el-table-column>
      <el-table-column label="操作"
                        width="200"
                        align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                      icon="el-icon-edit"
                      circle
                      size="mini"
                      :class="$style.miniCricleIconBtn"
                      @click="modifyOne(scope)"></el-button>
          <el-button type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                      :class="$style.miniCricleIconBtn"
                      @click="deleteOne(scope)"></el-button>
        </template>
      </el-table-column>      
    </el-table>
    <operate-modal :visible.sync="modalVisible"
                   :btn-loading="btnLoading"
                   :action="operate"
                   :source-data="selectData"
                   @confirm="confirm"></operate-modal>
  </section>
</template>

<script>
import { fetchAll, createOne, modifyOne, deleteOne } from '@/api/cloudConfig';
import OperateModal from '@/components/pages/cloudConfig/OperateModal';

const operateType = {
  create: createOne,
  update: modifyOne
};

export default {
  name: 'CloudStorageList',
  data() {
    return {
      items: [],
      operate: 'create',
      selectData: {},
      modalVisible: false,
      btnLoading: false
    }
  },
  components: {
    OperateModal
  },
  created() {
    this.fetchData();
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
          this.items = data;
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    createOne() {
      this.operate = 'create';
      this.selectData = {};
      this.modalVisible = true;
    },
    modifyOne({ row }) {
      this.operate = 'update';
      this.selectData = row;
      this.modalVisible = true;
    },
    deleteOne({ row }) {
      this.$confirm('此操作将删除该存储, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOne(row.id)
          .then(res => {
            const { message } = res.data;
            this.fetchData();
            this.$message.success(message);
          })
          .catch(error => {
            this.$message.error(error);
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    confirm(formData) {
      this.btnLoading = true;
      operateType[this.operate](formData)
        .then(res => {
          const { message } = res.data;
          this.modalVisible = false;
          this.fetchData();
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    }
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>