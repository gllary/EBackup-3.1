<template>
  <section v-loading="infoLoading"
           :element-loading-background="themeColor.loadingBackGround">
    <header class="plan-detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="beifen"
                    class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>{{details.name}}</h1>
              </el-col>
            </el-row>
            <el-form label-position="right"
                     label-width="130px"
                     size="small"
                     :inline="true"
                     class="item-info">
              <el-row class="margin-right5">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="备份策略：">
                      <span>{{ backupStrategy }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="时间策略：">
                      <div>{{ timeStrategy | timeStrategyMapping }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="时间：">
                      <div>{{ timeStrategy !== 0 ? config.startTime : config.singleTime }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="星期："  v-if="timeStrategy === 4">
                      <div>
                        <el-tag v-for="point in weekPoints"
                                :key="point"
                                size="small">{{point}}</el-tag>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="日期：" v-if="timeStrategy === 5">
                      <div>
                        <el-tag :class="$style.infoTag"
                                v-for="point in datePoints"
                                :key="point"
                                size="small">{{point}}</el-tag>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="时间点："
                                  v-if="[3,4,5].indexOf(timeStrategy) >= 0">
                      <div>
                        <el-tag :class="$style.infoTag"
                                v-for="point in timePoints"
                                :key="point"
                                size="small">{{point}}</el-tag>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="间隔："
                                  v-if="timeStrategy === 1|| timeStrategy === 2">
                      <div>
                        <el-tag :class="$style.infoTag"
                                size="small">{{config.timeInterval}}分钟</el-tag>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="源文件路径："
                                  v-if="['windows', 'linux'].includes(target)">
                      <span>{{ config.sourcePath }}</span>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item label="存储目标路径："
                                  v-if="target === 'linux'">
                      <span>{{ details.pointTargetPath }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="NFS目标路径："
                                  v-if="target === 'linux'">
                      <span>{{ details.nfsTargetPath }}</span>
                    </el-form-item>
                  </el-col> -->
                  <!-- <el-col :span="8">
                    <el-form-item v-if="target === 'windows'"
                                  label="是否备份系统：">
                      <span>{{ details.backupSystem === 'sys' ? '是' : '否' }}</span>
                    </el-form-item>
                  </el-col> -->
                </el-row>
                <el-row class="machineRow">
                  <el-col :span="8">
                    <el-form-item label="主机名：" v-if="['windows', 'linux'].includes(target)">
                      <span>
                        <router-link :to="linkObject"
                                     class="routerLink">
                          {{machine.hostName}}
                        </router-link>
                      </span>
                    </el-form-item>
                    <el-form-item :label="['vmware', 'hw'].includes(target) ? '虚拟机名称：':'数据库别名：'" v-else>
                      <span>
                        <router-link :to="linkObject"
                                    class="routerLink">
                          {{ machine.name }}
                        </router-link>
                      </span>
                    </el-form-item>
                    
                  </el-col>
                  <el-col :span="8" v-if="['windows', 'linux'].includes(target)">
                    <el-form-item label="主机IP：">
                      <el-tag size="small">{{machine.hostIp}}</el-tag>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="类型：">
                      <el-tag size="small">{{target|commonTypeFilter}}</el-tag>
                    </el-form-item>
                  </el-col>
                  <div v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'dm', 'sybase', 'cache', 'insql', 'informix', 'postgresql'].includes(target)">
                    <el-col :span="8">
                      <el-form-item  :label="['sqlserver', 'mysql', 'dm', 'sybase', 'cache', 'insql', 'informix', 'postgresql'].includes(target) ? '数据库名：':'实例名：'" >
                        <span>{{target === 'dm' ? machine.dbName : machine.instanceName}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="端口号：">
                        <el-tag size="small">{{machine.dbPort}}</el-tag>
                      </el-form-item>
                    </el-col>
                  </div>
                  <div v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'dm', 'sybase', 'vmware', 'hw', 'cache', 'insql', 'informix', 'postgresql'].includes(target)">
                    <el-col :span="8">
                      <el-form-item label="所属设备IP：">
                        <span>{{machine.host ? machine.host.hostIp : ''}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="设备系统类型：">
                        <span>{{machine.host ? machine.host.hostSystem : ''}}</span>
                      </el-form-item>
                    </el-col>
                  </div>
                  <div v-if="['vmware', 'hw'].includes(target)">
                    <el-col :span="8">
                      <el-form-item label="虚拟机主机IP：">
                        <span>{{machine.vmHost ? machine.vmHost.serverIp : ''}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="虚拟机主机类型：">
                        <span>{{machine.vmHost ? serverTypeFilter(machine.vmHost.serverType): ''}}</span>
                      </el-form-item>
                    </el-col>
                  </div>
                </el-row>
              </el-row>
            </el-form>
          </el-col>
        </el-row>

      </div>
    </header>
    <el-tabs class="tabsClass">
        <el-tab-pane label="备份集">
          <el-table :data="backupResult"
                    style="width: 100%; margin-top: 15px"
                    @expand-change="expandChange"
                    :default-sort="{ prop: 'endTime', order: 'descending' }">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form inline
                        label-width="100px"
                        size="small"
                        class="result-detail-form">
                  <el-form-item :class="$style.detailFormItem"
                                label="备份类型">
                    <span>{{backupTypeFilterMethod(scope.row.backupType)}}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="存储目标路径">
                    <span>{{ scope.row.path }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="开始时间">
                    <span>{{ scope.row.startTime }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                v-if="['windows', 'linux'].includes(target)"
                                label="源文件路径">
                    <span>{{ scope.row.sourcePath }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                 v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'dm', 'sybase', 'cache', 'insql', 'informix', 'postgresql', 'vmware', 'hw'].includes(target)"
                                label="文件名">
                    <span>{{ scope.row.fileName }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="结束时间">
                    <span>{{ scope.row.endTime }}</span>
                  </el-form-item>
                  <!-- <el-form-item :class="$style.detailFormItem"
                                label="NFS目标路径"
                                v-if="target==='linux'">
                    <span>{{ scope.row.nfsTargetPath }}</span>
                  </el-form-item> -->
                  <el-form-item :class="$style.detailFormItem"
                                label="文件标识符"
                                v-if="target==='windows'">
                    <span>{{ scope.row.versionInfo }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="大小">
                    <span>{{ ['windows', 'linux'].includes(target) ? fmtSizeFn(scope.row.size) : scope.row.size }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="状态">
                    <span>
                      <el-tag size="mini"
                              :type="scope.row.state === 1 ? 'danger' : 'success'">{{ stateConverter(scope.row.state) }}</el-tag>
                    </span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="持续时间">
                    <!-- <span>{{ scope.row.consume | durationFilter }}</span> -->
                    <span>{{ scope.row.consume }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                v-if="target === 'dm'"
                                label="备份日志">
                    <span>{{scope.row.logType |logTypeFilter}}</span>
                  </el-form-item>
                  <el-form-item label="错误信息"
                                v-if="scope.row.state === 1">
                    <span>{{ scope.row.errorMsg }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <!-- <el-table-column label="文件标识符"
                            prop="versionInfo"
                            v-if="target==='windows'"
                            min-width="180px"
                            align="center"></el-table-column> -->
            <el-table-column label="源文件路径"
                            v-if="['windows', 'linux'].includes(target)"
                            prop="sourcePath"
                            min-width="180px"
                            align="center"
                            header-align="center"></el-table-column>
            <el-table-column  label="备份文件名"
                              v-if="['oracle','sqlserver', 'mysql', 'db2', 'dm', 'sybase', 'cache', 'insql', 'informix', 'postgresql', 'vmware', 'hw'].includes(target)"
                              prop="fileName"
                              min-width="180px"
                              align="left"
                              header-align="center"></el-table-column>
            <el-table-column  label="备份类型"
                            prop="backupType"
                            min-width="100px"
                            align="center"
                            header-align="center">
              <template slot-scope="scope">
                <span>{{backupTypeFilterMethod(scope.row.backupType)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="开始时间"
                            prop="startTime"
                            min-width="150px"
                            align="center"></el-table-column>
            <el-table-column label="结束时间"
                            prop="endTime"
                            min-width="150px"
                            :sortable="true"
                            align="center"></el-table-column>
            <el-table-column label="大小"
                            prop="size"
                            min-width="100px"
                            align="center">
              <template slot-scope="scope">
                <span>{{ ['windows', 'linux'].includes(target) ? fmtSizeFn(scope.row.size) : scope.row.size }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态"
                            prop="state"
                            min-width="70px"
                            align="center">
              <template slot-scope="scope">
                <i v-if="scope.row.state === 0"
                  class="el-icon-success"
                  :class="$style.successColor"></i>
                <i v-else
                  class="el-icon-error"
                  :class="$style.errorColor"></i>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        
    </el-tabs>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon.vue';
import { fetchBackupPlanDetail, cancelHighlight } from '@/api/home';
import baseMixin from '@/components/mixins/baseMixins';
import {planDetailsMixin} from '@/components/mixins/planDetailsMixin';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  backupTypeMapping,
  backupResultMapping,
  yesOrNoMapping,
  filehostBackupTypeMapping
} from '@/utils/constant';

export default {
  name: 'backup-detail',
  mixins: [baseMixin, planDetailsMixin],
  components: {
    IIcon
  },
  data() {
    return {
      // infoLoading: false,
      // details: {},
    };
  },
  computed: {
    backupResult() {
      return this.details.backupResult ? this.details.backupResult : [];
    },
    backupConfig() {
      return this.details.config ? this.details.config : {};
    },
    backupStrategy() {
      const type = this.details.config ? this.details.config.backupStrategy : 0;
      return backupStrategyMapping[type];
    },
  },
  filters: {
    timeStrategyMapping(val) {
      return timeStrategyMapping[val];
    },
    // backupTypeFilter(val) {
    //   // filehostBackupTypeMapping[val];
    //   console.log(this.target, this.backupStrategy)
    //   return backupTypeMapping[val];
    // },
    logTypeFilter(val) {
      return yesOrNoMapping[val];
    },
  },
  methods: {
    fetchData(id, type) {
      this.infoLoading = true;
      fetchBackupPlanDetail(id, type).then(res => {
        const {data} = res.data;
        this.details = data;
      }).catch(error => {
        this.$message.error(error);
      }).then(() => {
        this.infoLoading = false;
      });
    },
    backupTypeFilterMethod(val) {
      if (['windows', 'linux'].includes(this.target)) {
        return filehostBackupTypeMapping[val];
      }
      return backupTypeMapping[val];
    },
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return backupResultMapping[stateCode];
    },
    expandChange(row, expandedRows){
      // 展开失败的扩展表
      if(expandedRows.includes(row) && row.state === 1) {
        cancelHighlight(row.id, this.details.machineType).then(res => {
          // console.log('ok')
        });
      }
    },
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
@import '@/style/color.scss';
$primary-color: #409eff;
/* 标签之间的间隔在for循环下消失了 */
.infoTag {
  margin: 0 2px;
}
.detailFormItem {
  margin: {
    right: 0 !important;
    bottom: 0 !important;
  }
  width: 30%;
  &:nth-child(2n) {
    width: 69%;
  }
}
.hostLinkInOs {
  border: 1px dotted $primary-color;
  border-radius: 5px;
  & legend {
    color: $primary-color
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/theme/variable.scss';
.margin-right5 {
  margin-right: 5px;
}
.tabsClass{
  margin-top: -39px;
}
.machineRow{
  margin-top: 10px;
}
.plan-detail-header{
  @include content-background-color;
  margin: -20px -20px 0 -20px;
  padding: 10px 10px 50px 10px;
}
</style>

