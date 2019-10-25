<template>
  <section>
    <el-form inline
             size="small">
             <el-form-item style="float: right;">
                <el-button type="success"
                          @click="toguide('emilset')">操作说明</el-button>
            </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary"
                   :disabled="Boolean(emailConfigs.length)"
                   @click="createOne">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="emailConfigs"
              style="width: 100%">
      <el-table-column prop="senderEmail"
                       label="发件人"
                       min-width="180"
                       align="center"></el-table-column>
      <el-table-column label="收件人"
                       min-width="180"
                       align="center">
        <template slot-scope="scope">
          <div v-for="(receiver, index) in scope.row.receiverEmail"
               :key="index">{{ receiver }}</div>
        </template>
      </el-table-column>
      <el-table-column label="抄送"
                       min-width="180"
                       align="center">
        <template slot-scope="scope">
          <div v-for="(cc, index) in scope.row.carbonCopy"
               :key="index">{{ cc }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="timeStrategy"
                       label="时间策略"
                       align="center">
        <template slot-scope="scope">
          <span>{{ emailConfigTimeStrategyMapping[scope.row.timeStrategy] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送时间"
                       align="center"
                       min-width="140">
        <template slot-scope="scope">
          <el-tag size="mini"
                  type="primary">{{ sendTimeFmt(scope.row) }}</el-tag>
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
                     @click="modifyOne(scope.row)"
                     :class="$style.miniCricleIconBtn"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     @click="deleteOne(scope.row)"
                     :class="$style.miniCricleIconBtn"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <operate-email-config-modal :visible.sync="operateModalVisible"
                                :action="action"
                                :email-config="selectOne"
                                @refresh="fetchData"></operate-email-config-modal>
  </section>
</template>
<script>
import { fetchAll, deleteOne } from '@/api/emailConfig';
import { weekMapping, emailConfigTimeStrategyMapping } from '@/utils/constant';
import OperateEmailConfigModal from '@/components/pages/emailConfig/OperateEmailConfigModal';
export default {
  name: 'EmailConfigList',
  components: {
    OperateEmailConfigModal
  },
  data() {
    return {
      emailConfigs: [],
      emailConfigTimeStrategyMapping,
      operateModalVisible: false,
      selectOne: {},
      action: 'create'
    };
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
          const { data: emailConfigs } = res.data;
          this.emailConfigs = Array.isArray(emailConfigs) ? emailConfigs : [];
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    sendTimeFmt(timeConfig) {
      const { timeStrategy, weekPoint, datePoint, sendTime } = timeConfig;
      switch(timeStrategy) {
        case 1:
          return sendTime;
        case 2:
          return `${weekMapping[weekPoint]} ${sendTime}`;
        case 3:
          return `${datePoint}号 ${sendTime}`;;
        default:
          return ['-'];
      }
    },
    createOne() {
      this.operateModalVisible = true;
      this.action = 'create';
      this.selectOne = {};
    },
    modifyOne(emailConfig) {
      this.operateModalVisible = true;
      this.action = 'modify';
      this.selectOne = emailConfig;
    },
    deleteOne(emailConfig) {
      this.$confirm('即将删除此邮件配置，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteOne(emailConfig.id)
            .then(res => {
              const { message } = res.data;
              this.$message.success(message);
              this.fetchData();
            })
        })
        .catch(() => {
          this.$message.info('已取消操作');
        })
    }
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>