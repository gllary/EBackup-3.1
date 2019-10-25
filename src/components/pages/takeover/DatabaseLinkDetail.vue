<template>
  <section>
    <header class="detail-header"
            :class="$style.header">
      <el-row type="flex"
              justify="space-around">
        <el-col :span="8">
          <section :class="$style.productionSection">
            <h4>
              <router-link :class="productionDatabase.role === 1 ? 'primaryLink' : 'viceLink'"
                           :to="`/db/${databaseType}/${productionDatabase.id}`">
                {{productionDatabase.name}}
              </router-link>
              <i-icon :class="$style.databaseRoleIcon"
                      :name="productionDatabase.role === 1 ? `${theme}-zhu` : 'bei'"></i-icon>
            </h4>
            <el-form size="small"
                     label-width="100px"
                     label-position="left"
                     class="item-info">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="数据库版本">
                    <span>{{ productionDatabase.dbVersion }}</span>
                  </el-form-item>
                  <el-form-item :label="instanceName">
                    <span>{{ productionDatabase.instanceName }}</span>
                  </el-form-item>
                  <el-form-item label="登录名">
                    <span>{{ productionDatabase.loginName }}</span>
                  </el-form-item>

                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备环境">
                    <span>生产环境</span>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-tag :type="databaseStateStyle(productionDatabase.state)"
                            size="mini">{{productionDatabase.state | databaseStateFilter}}</el-tag>
                  </el-form-item>
                </el-col>

                <el-form-item v-if="databaseType === 'oracle'"
                              label="监听名">
                  <span>{{ productionDatabase.lsn }}</span>
                </el-form-item>
              </el-row>
              <el-form-item label="所属业务系统">
                <span>{{ productionDatabase.application }}</span>
              </el-form-item>
            </el-form>
          </section>
        </el-col>
        <el-col :span="4">
          <section :class="$style.linkSection">
            <el-tooltip content="切换实例"
                        placement="top">
              <i-icon :name="`switch-${linkState.state}`"
                      :class="$style.switchIcon"
                      @click.native="switchIconClick"></i-icon>
            </el-tooltip>
            <div>
              <el-tag :type="databaseLinkStateStyle(linkState.state)"
                      style="margin-left: 10px"
                      size="mini">{{ linkState.state | linkStateFilter }}</el-tag>
            </div>
            <p v-if="databaseType === 'oracle'">
              <span>临时端口：</span>
              <span>{{linkState.tempPort}}</span>
            </p>
            <div v-if="linkState.initTime">
              <span>初始化持续时间：</span>
              <timer v-if="linkState.state === 1" :val="linkState.initTime"></timer>
              <span v-else>{{ linkState.initTime | durationFilter }}</span>
            </div>
            <div>
              <div :class="$style.linkMsg">
                {{linkState.errMsg}}
              </div>
            </div>
          </section>
        </el-col>
        <el-col :span="8">
          <section :class="$style.ebackupSection">
            <h4>
              <router-link :class="productionDatabase.role === 1 ? 'primaryLink' : 'viceLink'"
                           :to="`/db/${databaseType}/${ebackupDatabase.id}`">
                {{ebackupDatabase.name}}
              </router-link>
              <i-icon :class="$style.databaseRoleIcon"
                      :name="ebackupDatabase.role === 1 ? `${theme}-zhu` : 'bei'"></i-icon>
            </h4>
            <el-form size="small"
                     label-width="100px"
                     label-position="left"
                     class="item-info">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="数据库版本">
                    <span>{{ ebackupDatabase.dbVersion }}</span>
                  </el-form-item>
                  <el-form-item :label="instanceName">
                    <span>{{ ebackupDatabase.instanceName }}</span>
                  </el-form-item>
                  <el-form-item label="登录名">
                    <span>{{ ebackupDatabase.loginName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备环境">
                    <span>易备环境</span>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-tag :type="databaseStateStyle(ebackupDatabase.state)"
                            size="mini">{{ebackupDatabase.state | databaseStateFilter}}</el-tag>
                  </el-form-item>
                  <el-form-item v-if="databaseType === 'oracle'"
                                label="监听名">
                    <span>{{ ebackupDatabase.lsn }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="所属业务系统">
                <span>{{ ebackupDatabase.application }}</span>
              </el-form-item>
            </el-form>
          </section>
        </el-col>
      </el-row>
    </header>
    <h3>操作记录</h3>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane v-for="(msg, index) in tabMsgs"
                   :key="index"
                   :name="msg.name"
                   :label="msg.label">
        <link-detail-table :records="switches|formatType(activeName)"></link-detail-table>
      </el-tab-pane>
    </el-tabs>
    <switch-database-links-modal :visible.sync="switchModalVisible"
                                 :database-links-ready-to-switch="[databaseLink]"
                                 @confirm="switchModalConfirm"></switch-database-links-modal>
  </section>
</template>
<script>
import SwitchDatabaseLinksModal from '@/components/pages/takeover/SwitchDatabaseLinksModal';
import LinkDetailTable from '@/components/pages/takeover/LinkDetailTable';
import takeoverMixin from '@/components/mixins/takeoverMixins';
import themeMixin from '@/components/mixins/themeMixins';
import baseMixin from '@/components/mixins/baseMixins';
import IIcon from '@/components/IIcon';
import Timer from '@/components/Timer';
import { switchTypeMapping } from '@/utils/constant';
// import {
//   createSwitches,
// } from '@/api/oracle';
import {
  fetchLinkByLinkId,
  fetchSwitches,
  createSwitches
} from '@/api/common';
const switchType = {
  oracle: ['1', '2', '3', '4', '5', '6', '7'],
  insql: ['1', '2', '3'],
  sqlserver: ['1', '2', '3', '5'],
  mysql: ['1', '2', '3', '4', '5', '6', '7']
}
export default {
  name: 'DatabaseLinkDetail',
  props: {
    id: {
      type: String,
    },
  },
  mixins: [takeoverMixin, themeMixin, baseMixin],
  data() {
    return {
      linkState: {},
      productionDatabase: {},
      ebackupDatabase: {},
      latestSwitch: {},
      switches: [],
      switchModalVisible: false,
      activeName: ''
    };
  },
  created() {
    this.fetchData();
    this.activeName = this.tabMsgs[0].name;
  },
  filters: {
    formatType(records, name) {
      if(records.length<=0) {
        return [];
      }
      return records.filter(record => record.type === Number(name));
    }
  },
  computed: {
    databaseType() {
      const path = this.$route.path;
      // /db/xxx/takeover/12345
      return this.$route.path.substring(4, path.indexOf('/', 4));
    },
    instanceName() {
      if (this.databaseType === 'oracle') {
        return '实例名';
      } else {
        return '数据库名';
      }
    },
    databaseLink() {
      // 传给SwitchModal的数据
      return {
        primaryDatabase: this.productionDatabase,
        viceDatabase: this.ebackupDatabase,
      };
    },
    tabMsgs() {
      return switchType[this.databaseType].map(type => ({
        label: Number(type) === 1 && ['sqlserver', 'insql', 'mysql'].includes(this.databaseType) ? '切换数据库' : switchTypeMapping[type],
        name: type
      }));
    }
  },
  methods: {
    fetchData() {
      fetchLinkByLinkId(this.databaseType, this.id)
        .then(res => {
          const {
            primaryDatabase,
            viceDatabase,
            latestSwitch,
            ...linkState
          } = res.data.data;
          this.linkState = linkState;
          this.productionDatabase = primaryDatabase;
          this.ebackupDatabase = viceDatabase;
          this.latestSwitch = latestSwitch;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchSwitches(this.databaseType, this.id)
        .then(res => {
          const { data: switches } = res.data;
          this.switches = Array.isArray(switches) ? switches : [];
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    switchIconClick() {
      this.switchModalVisible = true;
    },
    switchModalConfirm() {
      createSwitches(this.databaseType, {
        linkIds: [this.id],
      })
        .then(res => {
          const { data: theSwitch } = res.data;
          this.latestSwitch = theSwitch[0];
          this.switches.push(theSwitch[0]);
          this.switchModalVisible = false;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
  },
  components: {
    IIcon,
    SwitchDatabaseLinksModal,
    LinkDetailTable
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
.header {
  padding-bottom: 10px;
}
.productionSection {
  h4 {
    text-align: center;
  }
}
.databaseRoleIcon {
  vertical-align: -0.2em;
  margin-left: 1em;
}
.linkSection {
  font-size: 0.8em;
  text-align: center;
}
.linkMsg {
  display: inline-block;
  text-align: left;
  margin-top: 10px;
}
.ebackupSection {
  h4 {
    text-align: center;
  }
}
.switchIcon {
  width: 3em;
  height: 3em;
  cursor: pointer;
}
</style>
