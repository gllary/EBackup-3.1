<template>
  <section>
    <el-row>
      <el-form inline
               size="small">
        <el-form-item>
          <el-radio-group v-model="databaseType">
            <el-radio-button label="oracle">Oracle</el-radio-button>
            <el-radio-button label="sqlserver">SQLServer</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary"
                     @click="batchSwitch">添加</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
            <el-button type="success"
                      @click="toguide">操作说明</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-card :class="$style.disasterRecoverCard"
             :style="plan.state === 2 ? 'color: #999999;' : ''"
             v-for="plan in switchPlans"
             :key="plan.id">
      <div slot="header"
          class="clearfix">
        <el-tag size="mini"
                color="#233FCA"
                style="color: #ffffff">灾备</el-tag>
        <span>
          <router-link :to="`${plan.id}`"
                      append
                      class="routerLink">{{ plan.name }}</router-link>
        </span>
      </div>
      <el-row type="flex">
        <el-col :span="18">
          <el-form label-width="100px"
                  size="mini">
            <el-form-item label="计划创建时间"
                          width="40%">
              <span>{{ plan.createTime }}</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6"
                :class="$style.planInfo">
          <ul>
            <li>
              <h5>当前状态</h5>
              <div>
                <div style="display: inline-block">
                  <i v-if="plan.state === 0"
                    class="el-icon-time"
                    :class="operationStateStyle(plan.state)"></i>
                  <i v-else-if="plan.state === 1"
                    class="el-icon-loading"
                    :class="operationStateStyle(plan.state)"></i>
                  <i v-else-if="plan.state === 2"
                    class="el-icon-remove-outline"
                    :class="operationStateStyle(plan.state)"></i>
                  <span :class="operationStateStyle(plan.state)">{{ operationState(plan.state) || '-' }}</span>
                </div>
              </div>
            </li>
            <li>
              <h5>计划创建时间</h5>
              <div>{{plan.createTime || '计划未开始'}}</div>
            </li>
            <li>
              <h5>已持续时间</h5>
              <div v-if="plan.consumeTime">
                <timer v-if="plan.state === 1" :val="Number(plan.consumeTime)"></timer>
                <span v-else>{{plan.consumeTime | durationFilter}}</span>
              </div>
              <div v-else>-</div>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-card>        
      <!-- </el-tab-pane>
  </el-tabs> -->
    <batch-switch-modal :visible.sync="switchDialog"
                        :originLinks="switchLinks"
                        :flag="flag"
                        :btn-loading="btnLoading"
                        :databaseType="databaseType"
                        @confirm="addSwitchPlan"></batch-switch-modal>
  </section>
</template>
<script>
import { fetchAll, fetchNum } from '../../api/switch'
import IIcon from '@/components/IIcon'
import BatchSwitchModal from '../modal/BatchSwitchModal';
import { operationStateMapping } from '../../utils/constant'
import baseMixin from '../mixins/baseMixins';
import batchSwitchMinxin from '../mixins/batchSwitchMixins'
import { fetchLinks as fetchLinksSqlserver } from '../../api/sqlserver'
import { fetchLinks as fetchLinksOracle } from '../../api/oracle'
import Timer from '@/components/Timer';
export default {
  name: 'SwitchList',
  mixins: [baseMixin, batchSwitchMinxin],
  data() {
    return {
      planList: [],
      planNum: {},
      infoLoading: true,
      activeTab: 'plans',
      btnLoading: false,
      sqlserverLinks: [],
      oracleLinks: [],
      databaseType: 'oracle',
      timer: null
    }
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.setTimer();
  },
  destroyed() {
    this.clearTimer();
  },
  computed: {
    switchPlans() {
      return this.planList.filter(plan => plan.dbType === this.dbType)
    },
    links() {
      if(this.databaseType === 'oracle') {
        return this.oracleLinks
      } else if (this.databaseType === 'sqlserver') {
        return this.sqlserverLinks
      }
    }
  },
  methods: {
    toguide(){
      this.$router.push({ name: 'dataDaseTakeOver', query: { aId:'disasterDrills' }})
    },
    fetchData() {
      // fetchNum()
      //   .then(res => {
      //     const { data } = res.data
      //     this.planNum = data
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
      //   .then(() => {
      //     this.infoLoading = false;
      //   })
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.planList = data.sort((a, b) => Date.parse(b.createTime)-Date.parse(a.createTime))
        }),
      fetchLinksOracle()
        .then(res => {
          const { data: links } = res.data;
          this.oracleLinks = links;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchLinksSqlserver()
        .then(res => {
          const { data: links } = res.data;
          this.sqlserverLinks = links;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    setTimer() {
      this.clearTimer();
      this.timer = setInterval(() => {
        this.fetchData();
      }, 20000);
    },
    clearTimer() {
      clearInterval(this.timer);
    },
    operationStateStyle(state) {
      if (state === 0) {
        return this.$style.waitingColor;
      } else if (state === 1) {
        return this.$style.loadingColor;
      } else if(state === 2) {
        return this.$style.finishedColor;
      } else return '';
    },
    operationState(state) {
      return operationStateMapping[state];
    },
  },
  components: {
    IIcon,
    BatchSwitchModal,
    Timer
  }
}
</script>
<style lang="scss" module>
@import '../../style/color.scss';
@import '../../style/common.scss';
.disasterRecoverCard {
  margin-bottom: 15px;
  // color: #999999;
}
.planInfo {
  h5 {
    font-weight: 400;
    color: #888888;
    margin: 4px 0;
    text-align: right;
  }
  div {
    margin-left: 5px;
    text-align: right;
  }
  ul {
    list-style: none;
    margin: 0;
  }
  li {
    margin: 10px 0;
  }
}
</style>
<style>
.planMore .el-collapse-item__header {
  text-align: center;
  color: #409EFF;
}
.planMore .el-collapse-item__arrow {
  display: none;
}
</style>


