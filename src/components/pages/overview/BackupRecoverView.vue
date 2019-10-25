<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item>
        <el-radio-group v-model="radio" @change="switchEnvironment">
          <el-radio-button label="生产环境"></el-radio-button>
          <el-radio-button label="易备环境"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button icon="el-icon-refresh"
                   @click="refreshData">刷新</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary"
                   @click="dialogVisible=true">添加</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix el-card-head">
          <i-icon name="application"
                        class="envIcon"></i-icon>
          <span>应用界面</span>
        </div>
        <el-table :data="this.radio==='生产环境'?this.productionInfo:this.ebackupInfo">
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="position"
            label="职位"
            align="center"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="entrytime"
            label="入职时间"
            align="center"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="counttime"
            label="统计时间"
            align="center"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="salesamount"
            label="销售金额"
            align="center"
            min-width="180">
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
    <el-row :gutter="50" class="clearfix">
      <el-col :span="12" v-show="this.radio==='生产环境'" style="float: left">
					<canvas ref="leftDire"></canvas>
      </el-col>
      <el-col :span="12" v-show="this.radio==='易备环境'" style="float: right">
					<canvas ref="rightDire"></canvas>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix el-card-head">
            <i-icon name="production-env"
                          class="envIcon"></i-icon>
            <span>生产环境</span>
          </div>
          <el-table :data="this.productionData.salesInfo?
                           this.productionData.salesInfo.slice((productionPage-1)*productionPageSize,productionPage*productionPageSize):
                           this.productionData.salesInfo">
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="position"
              label="职位"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="entrytime"
              label="入职时间"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="counttime"
              label="统计时间"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="salesamount"
              label="销售金额"
              align="center"
              min-width="50">
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @current-change="productionCurrentChange"
              :current-page.sync="productionPage"
              :page-size="productionPageSize"
              layout="total, prev, pager, next"
              :total="productionTotal">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix el-card-head">
            <i-icon name="ebackup-env"
                          class="envIcon"></i-icon>
            <span>易备环境</span>
          </div>
          <el-table :data="this.ebackupData.salesInfo?
                           this.ebackupData.salesInfo.slice((ebackupPage-1)*ebackupPageSize,ebackupPage*ebackupPageSize):
                           this.ebackupData.salesInfo">
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="position"
              label="职位"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="entrytime"
              label="入职时间"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="counttime"
              label="统计时间"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="salesamount"
              label="销售金额"
              align="center"
              min-width="50">
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @current-change="ebackupCurrentChange"
              :current-page.sync="ebackupPage"
              :page-size="ebackupPageSize"
              layout="total, prev, pager, next"
              :total="ebackupTotal">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <overview-create-modal :visible.sync="dialogVisible"
                           :btn-loading="btnLoading"
                           @confirm="createFormData">
    </overview-create-modal>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import OverviewCreateModal from '@/components/pages/overview/OverviewCreateModal'
import { fetchProduction, fetchEbackup, createProduction } from '@/api/backuprestore';
import { overviewMixin } from '@/components/mixins/overviewMixin';
export default {
  name: 'BackupRecoverView',
  mixins: [overviewMixin],
  data() {
    return {
      radio: '生产环境',
    }
  },
  methods: {
    fetchData() {
      fetchProduction()
      .then(res => {
        this.productionData = res.data.data;
        if(this.radio==='生产环境')
          this.drawArrow(this.leftDire.getContext('2d'),280,30,170,140,45,10,3,'#27ca27',0);
      })
      .catch(error => {
        error => Promise.reject(error);
      });
      fetchEbackup()
      .then(res => {
        this.ebackupData = res.data.data;
        if(this.radio==='易备环境')
          this.drawArrow(this.rightDire.getContext('2d'),20,30,130,140,45,10,3,'#27ca27',1);
      })
      .catch(error => {
        error => Promise.reject(error);
      });
    },
    createFormData(data) {
      this.btnLoading=true;
      data.hostIp = this.productionData.hostIp;
      data.serviceIp = this.productionData.serviceIp;
      createProduction(data)
        .then(response => {
          this.$message.success(response.data.message);
          this.dialogVisible = false;
          this.productionData.salesInfo.push(response.data.data.salesInfo);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    refreshData() {
      const opt = {
        type: 'info',
        message: '正在更新中，请等待...',
        duration: 0,
      };
      const { close } = this.$message(opt);
      Promise.all([
        fetchProduction(),
        fetchEbackup(),
      ])
        .then(resArr => {
          this.productionData = resArr[0].data.data;
          this.ebackupData = resArr[1].data.data;
          if(this.radio==='生产环境') {
            this.drawArrow(this.leftDire.getContext('2d'),280,30,170,140,45,10,3,'#27ca27',0);
          } else {
            this.drawArrow(this.rightDire.getContext('2d'),20,30,130,140,45,10,3,'#27ca27',1);
          }
        })
        .then(() => {
          opt.type = 'success';
          opt.message = '更新成功';
          setTimeout(close, 1000);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    switchEnvironment() {
      if(this.radio === '易备环境') {
        this.drawArrow(this.rightDire.getContext('2d'),20,30,130,140,45,10,3,'#27ca27',1);
      } else {
        this.drawArrow(this.leftDire.getContext('2d'),280,30,170,140,45,10,3,'#27ca27',0);
      }
    },
  },
  components: {
    IIcon,
    OverviewCreateModal
  },
};
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
}
.envIcon {
  vertical-align: -0.3em;
}
.el-table {
  margin-top: -20px;
}
.el-card-head {
  text-align: center;
  font-weight: 700;
}
canvas {
  height: 200px;
  width: 100%;
}
</style>
