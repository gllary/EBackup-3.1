<template>
  <section>
    <el-row>
      <el-form inline
             size="small">
        <el-form-item style="float: right;">
          <el-button type="primary"
                    @click="createModalVisible=true">添加</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
            <el-button type="success"
                      @click="toguide('emilmanage')">操作说明</el-button>
        </el-form-item>
    </el-form>
    </el-row>
    <el-table :data="sortEmail"
              style="width: 100%">
      <el-table-column prop="mailHost"
                       label="主机名"
                       min-width="150"
                       fixed
                       align="center"></el-table-column>
      <el-table-column prop="mailTransportProtocol"
                       label="协议名"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="mailSmtpPort"
                       label="端口"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column label="状态"
                       min-width="100"
                       align="center"
                       prop="emailStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.emailStatus == 0">
            <i class="el-icon-circle-check" style="color: #67C23A;font-size: 18px">
            </i>
          </span>
          <span v-else>
            <i class="el-icon-remove" style="color: #909399;font-size: 18px"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="emailLoginName"
                       label="登录账号"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column label="操作"
                       min-width="150"
                       fixed="right"
                       align="center"
                       prop="state">
        <template slot-scope="scope">
          <el-tooltip content="修改"
                      placement="top"
                      effect="light">
            <el-button type="primary"
                     icon="el-icon-edit"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="selectOne(scope)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除"
                      placement="top"
                      effect="light">
            <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="deleteOne(scope)"></el-button>
          </el-tooltip>
          <el-tooltip :content="`${scope.row.emailStatus==1?'启用':'禁用'}`"
                      placement="top"
                      effect="light">
            <el-button :type="`${scope.row.emailStatus==1?'success':'info'}`"
                       :icon="`${scope.row.emailStatus==1?'el-icon-check':'el-icon-minus'}`"
                       circle
                       :class="$style.miniCricleIconBtn"
                       @click="changeState(scope.$index, scope.row)"
                       size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <email-manager-create-modal :visible.sync="createModalVisible"
                                :btn-loading="btnLoading"
                                @confirm="createFormData">
    </email-manager-create-modal>
    <email-manager-update-modal :visible.sync="updateModalVisible"
                                :btn-loading="btnLoading"
                                @confirm="updateFormData"
                                :email-info="originEmail">
    </email-manager-update-modal>
  </section>
</template>
<script>
import { fetchAll, createOne, modifyOne, deleteOne } from '../../api/email';
import EmailManagerCreateModal from '../modal/EmailManagerCreateModal';
import EmailManagerUpdateModal from '../modal/EmailManagerUpdateModal';
export default {
  name: 'EmailManager',
  data() {
    return {
      emails: [],
      selectedId: '',
      createModalVisible: false,
      updateModalVisible: false,
      btnLoading: false,
    }
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
          this.emails = data;
        })
        .catch(error => {
          error => Promise.reject(error);
        })
    },
    createFormData(data) {
      this.btnLoading=true;
      createOne(data)
        .then(response => {
          this.$message.success(response.data.message);
          this.createModalVisible = false;
          this.emails.push(response.data.data);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
          this.fetchData();
        })
    },
    selectOne({ row }) {
      this.selectedId = row.emailId;
      this.updateModalVisible = true;
    },
    updateFormData(data) {
      this.btnLoading = true;
      modifyOne(data)
        .then(res => {
          const { data, message } = res.data;
          // FIXME: mock数据保持id一致，生产环境必须删除下面一行
          data.emailId = this.originEmail.emailId;
          this.emails.splice(
            this.emails.findIndex(email => email.emailId === data.emailId),
            1,
            data
          );
          this.selectedId = '';
          this.updateModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
          this.fetchData();
        });
    },
    deleteOne({ row: info, $index }) {
      this.$confirm('此操作将删除此系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteOne(info.emailId)
            .then(() => {
              this.emails.splice($index, 1);
              this.$message.success({
                message: '删除成功!',
              });
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(error => {});
    },
    changeState(index, row) {
      this.$confirm(`此操作将${row.emailStatus === 0? '启用' : '禁用'}${row.mailHost}，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let newRow = Object.assign({},this.emails.find(list => list.emailId === row.emailId));
          newRow.emailStatus = newRow.emailStatus==='0'?'1':'0';
          modifyOne(newRow)
            .then(response => {
              this.$message.success('修改成功');
              this.emails.splice(index, 1, response.data.data);
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              this.fetchData();
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作!'
          })
        });
    },
  },
  computed: {
    originEmail() {
      return this.emails.find(email => email.emailId === this.selectedId) || {};
    },
    sortEmail() {
      return this.emails.sort((a,b) =>{
        return a.emailStatus-b.emailStatus;
      });
    }
  },
  components: {
    EmailManagerCreateModal,
    EmailManagerUpdateModal,
  }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
