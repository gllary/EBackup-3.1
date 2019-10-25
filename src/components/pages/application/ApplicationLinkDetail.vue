<template>
  <section>
    <header class="detail-header"
            :class="$style.header">
      <el-row type="flex"
              justify="space-around"
              v-if="productionApp.host">
        <el-col :span="8">
          <section :class="$style.productionSection">
            <h4 :class="productionApp.role === 1 ? 'primaryLink' : 'viceLink'">
              {{productionApp.name}}
              <i-icon :class="$style.databaseRoleIcon"
                      :name="productionApp.role === 1 ? `${theme}-zhu` : 'bei'"></i-icon>
            </h4>
            <el-form size="small"
                     label-width="100px"
                     label-position="left"
                     class="item-info">
              <el-form-item label="设备环境">
                <span>生产环境</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ productionApp.createTime }}</span>
              </el-form-item>
              <el-form-item label="主机名">
                <span>{{ productionApp.host.name }}</span>
              </el-form-item>
              <el-form-item label="主机IP">
                <span>{{ productionApp.host.hostIp }}</span>
              </el-form-item>
            </el-form>
          </section>
        </el-col>
        <el-col :span="4">
          <section :class="$style.linkSection">
            <i-icon :name="`switch-${linkState.state}`"
                    :class="$style.switchIcon"></i-icon>
            <div>
              <el-tag :type="databaseLinkStateStyle(linkState.state)"
                      style="margin-left: 10px"
                      size="mini">{{ linkState.state | linkStateFilter }}</el-tag>
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
            <h4 :class="ebackupApp.role === 1 ? 'primaryLink' : 'viceLink'">
              {{ebackupApp.name}}
              <i-icon :class="$style.databaseRoleIcon"
                      :name="ebackupApp.role === 1 ? `${theme}-zhu` : 'bei'"></i-icon>
            </h4>
            <el-form size="small"
                     label-width="100px"
                     label-position="left"
                     class="item-info">
              <el-form-item label="设备环境">
                <span>易备环境</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ ebackupApp.createTime }}</span>
              </el-form-item>
              <el-form-item label="主机名">
                <span>{{ ebackupApp.host.name }}</span>
              </el-form-item>
              <el-form-item label="主机IP">
                <span>{{ ebackupApp.host.hostIp }}</span>
              </el-form-item>
            </el-form>
          </section>
        </el-col>
      </el-row>
    </header>
    <h3>操作记录</h3>
    <el-table :data="switches"
              :default-sort="{prop: 'switchTime', order: 'descending'}">
      <el-table-column label="切换时间"
                       width="220"
                       align="center"
                       prop="switchTime"></el-table-column>
      <el-table-column label="持续时间"
                       width="220"
                       align="center"
                       prop="consume">
        <template slot-scope="scope">
          <span v-if="!scope.row.consume">-</span>
          <timer v-else-if="scope.row.state === 1" :val="scope.row.consume"></timer>
          <span v-else>{{ scope.row.consume | durationFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型"
                       width="150"
                       align="center"
                       prop="type"
                       :formatter="switchTypeFormatter"></el-table-column>
      <el-table-column label="切换内容"
                       min-width="200"
                       header-align="center"
                       prop="content"></el-table-column>
      <el-table-column label="切换形式"
                       width="120"
                       align="center"
                       :formatter="switchManualFormatter"
                       prop="manual"></el-table-column>
      <el-table-column label="状态"
                       width="120"
                       align="center"
                       prop="state">
        <template slot-scope="scope">
          <i :class="switchStateIconClass(scope.row.state)"></i>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import { fetchLinkByLinkId, fetchSwitches } from '@/api/application';
import takeoverMixin from '@/components/mixins/takeoverMixins';
import themeMixin from '@/components/mixins/themeMixins';
import baseMixin from '@/components/mixins/baseMixins';
import IIcon from '@/components/IIcon';
import Timer from '@/components/Timer';
export default {
  name: 'ApplicationLinkDetail',
  props: {
    id: {
      type: String,
    },
  },
  mixins: [takeoverMixin, themeMixin, baseMixin],
  components: {
    IIcon,
    Timer
  },
  data() {
    return {
      linkState: {},
      productionApp: {},
      ebackupApp: {},
      latestSwitch: {},
      switches: []
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchLinkByLinkId(this.id)
        .then(res => {
          const {
            primaryApp,
            viceApp,
            latestSwitch,
            ...linkState
          } = res.data.data;
          this.linkState = linkState;
          this.productionApp = primaryApp;
          this.ebackupApp = viceApp;
          this.latestSwitch = latestSwitch;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchSwitches(this.id)
        .then(res => {
          const { data: switches } = res.data;
          this.switches = switches;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    switchStateIconClass(value) {
      switch (value) {
        case 0:
          return ['el-icon-time', this.$style.waitingColor];
        case 1:
          return ['el-icon-loading'];
        case 2:
          return ['el-icon-success', this.$style.successColor];
        case 3:
          return ['el-icon-error', this.$style.errorColor];
      }
    },
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
@import '@/style/color.scss';
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

