<template>
  <section v-loading="infoLoading"
           :element-loading-background="themeColor.loadingBackGround">
    <header class="plan-detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="huifushuju"
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
                     class="item-info">
              <el-row class="margin-right5">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="时间策略：">
                      <div>{{ timeStrategy | timeStrategyMapping }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="时间："
                                  style="width: 100%">
                      <div>
                        {{ timeStrategy !== 1 ? config.startTime : config.singleTime }}
                                <!-- size="small">{{ config.singleTime }}</el-tag> -->
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="星期："
                                  v-if="timeStrategy === 2"
                                  style="width: 100%">
                      <div>
                        <el-tag :class="$style.infoTag"
                                v-for="point in weekPoints"
                                :key="point"
                                size="small">{{ point }}</el-tag>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="日期："
                                  v-if="timeStrategy === 3"
                                  style="width: 100%">
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
                                  v-if="[2, 3].includes(timeStrategy)"
                                  style="width: 100%">
                      <div>
                        <el-tag :class="$style.infoTag"
                                v-for="point in timePoints"
                                :key="point"
                                size="small">{{point}}</el-tag>
                      </div>
                    </el-form-item>
                  </el-col>
                    <div v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'sybase', 'cache', 'insql', 'informix', 'postgresql', 'dm'].includes(target)">
                      <el-col :span="8">
                        <el-form-item label="恢复设备IP：">
                          <span>{{ config.hostIp }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="数据库名：">
                          <span>{{ config.dbName }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="端口：">
                          <span>{{ config.dbPort }}</span>
                        </el-form-item>
                      </el-col>
                    </div>
                    <div v-if="['windows', 'linux'].includes(target)">
                      <el-col :span="8">
                        <el-form-item label="存储目标路径：">
                          <span>{{ config.targetPath }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="NFS源路径："
                                      v-if="target === 'linux'">
                          <span>{{ config.sourcePath }}</span>
                        </el-form-item>
                      </el-col>
                      <!-- <el-col :span="8">
                        <el-form-item v-if="target === 'linux'"
                                      label="恢复方向：">
                          <span>{{ config.originDetailInfo}}</span>
                        </el-form-item>
                      </el-col> -->
                    </div>
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
                  <div v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'sybase', 'cache', 'insql', 'informix', 'postgresql', 'dm'].includes(target)">
                    <el-col :span="8">
                      <el-form-item  :label="['sqlserver', 'mysql', 'dm', 'sybase', 'cache', 'insql', 'informix', 'postgresql'].includes(target) ? '数据库名：':'实例名：'" >
                        <span>{{target === 'dm' ? machine.dbName : machine.instanceName}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="端口号：">
                        <span>{{machine.dbPort}}</span>
                      </el-form-item>
                    </el-col>
                  </div>
                  <div v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'dm', 'sybase', 'cache', 'informix', 'postgresql', 'insql', 'vmware', 'hw'].includes(target)">
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
        <el-tab-pane label="恢复记录">
          <el-table :data="restoreResult"
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
                                label="开始时间">
                    <span>{{ scope.row.startTime }}</span>
                  </el-form-item>
                  <!-- <el-form-item :class="$style.detailFormItem"
                                v-if="['windows', 'linux'].includes(target)"
                                label="恢复目标路径">
                    <span>{{ scope.row.detailInfo }}</span>
                  </el-form-item> -->
                  <el-form-item :class="$style.detailFormItem"
                                :label="hostIpLabel">
                    <span>{{ scope.row.hostIp }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="结束时间">
                    <span>{{ scope.row.endTime }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                :label="nameLabel">
                    <span>{{ scope.row.name }}</span>
                  </el-form-item>
                  <!-- <el-form-item :class="$style.detailFormItem"
                                v-if="['oracle', 'db2'].includes(target)"
                                label="实例名">
                    <span>{{ scope.row.dbName }}</span>
                  </el-form-item> -->
                  <!-- <el-form-item :class="$style.detailFormItem"
                                label="大小">
                    <span>{{ scope.row.size }}</span>
                  </el-form-item> -->
                  <el-form-item :class="$style.detailFormItem"
                                label="状态">
                    <span>
                      <el-tag size="mini"
                              :type="scope.row.state === 1 ? 'danger' : 'success'">{{ stateConverter(scope.row.state) }}</el-tag>
                    </span>
                  </el-form-item>
                  <el-form-item label="恢复路径"
                                v-if="['windows', 'linux'].includes(target)">
                    <span>{{ scope.row.restorePath }}</span>
                  </el-form-item>
                  <el-form-item label="错误信息"
                                v-if="scope.row.state === 1">
                    <span>{{ scope.row.errorMsg }}</span>
                  </el-form-item>
                </el-form>
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
            <el-table-column prop="hostIp"
                            :label="hostIpLabel"
                            align="center"
                            min-width="150px">
            </el-table-column>
            <el-table-column  prop="name"
                              :label="nameLabel"
                              v-if="['dm'].includes(target)"
                              align="center"
                              min-width="150px">
            </el-table-column>
            <!-- <el-table-column prop="detailInfo"
                            :label="target === 'oracle' ? '实例名':'数据库名'"
                            v-if="['oracle', 'sqlserver', 'mysql', 'db2'].includes(target)"
                            align="center"
                            min-width="150px">
            </el-table-column> -->
            <!-- <el-table-column prop="dbPort"
                            label="端口"
                            v-if="['dm'].includes(target)"
                            align="center"
                            min-width="50px"></el-table-column> -->
            <!-- <el-table-column prop="hostIp"
                            label="恢复主机IP"
                            v-if="['windows', 'linux', 'vmware', 'hw'].includes(target)"
                            align="center"
                            min-width="150px">
            </el-table-column> -->
            <!-- <el-table-column prop="newName"
                            label="新虚拟机名"
                            v-if="['vmware', 'hw'].includes(target)"
                            align="center"
                            min-width="200px">
            </el-table-column> -->
            <!-- <el-table-column prop="diskName"
                            label="恢复磁盘名"
                            v-if="target === 'vmware'"
                            align="center"
                            min-width="200px">
            </el-table-column> -->
            <!-- <el-table-column prop="detailInfo"
                              label="恢复目标路径"
                              v-if="['windows', 'linux'].includes(target)"
                              align="center"
                              min-width="150px"></el-table-column> -->
              <!-- <el-table-column v-if="target==='linux'"
                              prop="pointSourcePath"
                              label="恢复源路径"
                              align="center"
                              min-width="150px"></el-table-column> -->
              <!-- <el-table-column v-if="target==='linux'"
                              prop="nfsSourcePath"
                              label="恢复源NFS路径"
                              align="center"
                              min-width="150px"></el-table-column> -->
              <el-table-column  prop="restorePath"
                                label="恢复路径"
                                align="center"
                                v-if="['windows', 'linux'].includes(target)"
                                min-width="150px"></el-table-column>
              <!-- <el-table-column prop="backupResult.size"
                              :formatter="sizeFmt"
                              v-if="['windows', 'linux'].includes(target)"
                              label="大小"
                              align="center"
                              min-width="70px">
              </el-table-column> -->
              <el-table-column prop="state"
                              label="状态"
                              align="center"
                              min-width="70px">
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
import dayjs from 'dayjs';
import IIcon from '@/components/IIcon.vue';
import { fetchRestorePlanDetail, cancelRestoreHighlight } from '@/api/home';
import baseMixin from '@/components/mixins/baseMixins';
import {planDetailsMixin} from '@/components/mixins/planDetailsMixin';
import {
  restoreTimeStrategyMapping,
  restoreResultMapping,
} from '@/utils/constant';
export default {
  name: 'restore-detail',
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
    restoreResult() {
      return this.details.restoreResult ? this.details.restoreResult : [];
    },
    nameLabel() {
      if (['sqlserver', 'mysql','dm', 'sybase', 'cache', 'informix', 'postgresql', 'insql'].includes(this.target)) {
        return '数据库名';
      } else if (['oracle', 'db2'].includes(this.target)) {
        return '实例名';
      } else if (['vmware', 'hw'].includes(this.target)) {
        return '新虚拟机名';
      } else if (['windows', 'linux'].includes(this.target)) {
        return '文件名';
      }
      return '';
    },
    hostIpLabel() {
      if (['oracle', 'db2', 'sqlserver', 'mysql','dm', 'sybase', 'cache', 'insql', 'informix', 'postgresql'].includes(this.target)) {
        return '恢复设备IP';
      } else if (['vmware', 'hw', 'windows', 'linux'].includes(this.target)) {
        return '恢复主机IP';
      }
      return '';
    }
  },
  filters: {
    timeStrategyMapping(val) {
      return restoreTimeStrategyMapping[val];
    },
  },
  methods: {
    fetchData(id, type) {
      this.infoLoading = true;
      fetchRestorePlanDetail(id, type).then(res => {
        const {data} = res.data;
        this.details = data;
      }).catch(error => {
        this.$message.error(error);
      }).then(() => {
        this.infoLoading = false;
      });
    },
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return restoreResultMapping[stateCode];
    },
    expandChange(row, expandedRows){
      // 展开失败的扩展表
      if(expandedRows.includes(row) && row.state === 1) {
        cancelRestoreHighlight(row.id, this.details.machineType).then(res => {
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

