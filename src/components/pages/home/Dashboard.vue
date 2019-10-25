<template>
  <section>
    <template>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="pie-card">
            <div slot="header" class="clearfix">
              <span class="card-title">数据备份</span>
            </div>
            <div class="text item">
              <draw-pie id="backupTotal"
                        type="backup"
                        echarts-name="数据备份"></draw-pie>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="pie-card">
            <div slot="header" class="clearfix">
              <span class="card-title">恢复演练</span>
            </div>
            <div class="text item">
              <!-- <three-dimensional-pie id="restoreTotal"
                                     type="restore"
                                     style="height: 100%"></three-dimensional-pie> -->
              <draw-pie id="restoreTotal"
                        type="restore"
                        echarts-name="恢复演练"></draw-pie>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="pie-card">
            <div slot="header" class="clearfix">
              <span class="card-title">一键接管</span>
            </div>
            <div class="text item">
              <!-- <three-dimensional-pie id="takeoverTotal"
                                     type="takeover"
                                     style="height: 100%"></three-dimensional-pie> -->
              <draw-pie id="takeoverTotal"
                        type="takeover"
                        echarts-name="一键接管"></draw-pie>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card class="pie-card"
               style="margin-bottom: 10px"
               v-if="hasInspectConfig">
        <div slot="header" class="clearfix">
          <span class="card-title">智能巡检</span>
        </div>
        <div :class="$style.nfsNotUsed" v-if="!Object.keys(inspect).length && !Object.keys(record).length">
          <span>暂未使用</span>
        </div>
        <el-row class="text item"
                v-else>
          <el-col :span="8"
                  v-if="inspect.jobCountByMonth + inspect.jobCountByOne + inspect.jobCountByQuarter">
            <inspection :inspect="inspect"
                        id="inspect"></inspection>
          </el-col>
          <el-col :span="16"
                  :offset="Number(`${inspect.jobCountByMonth + inspect.jobCountByOne + inspect.jobCountByQuarter ? 0 : 4}`)">
            <inspection-records :record="record"
                                id="inspectRecords"></inspection-records>
          </el-col>
        </el-row>
      </el-card>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card" style="width: 100%">
            <div slot="header" class="clearfix">
              <span class="card-title">空间使用情况</span>
            </div>
            <div class="text item" v-show="Object.keys(spaceDetail).length">
              <el-row>
                <el-col :span="Object.keys(spaceDetail).length > 1 ? 12 : 24" ref="col">
                  <div  ref="space1">
                    <cylinder :data="spaceChartData[0]"></cylinder>
                  </div>
                </el-col>
                <el-col :span="12" v-show="Object.keys(spaceDetail).length > 1">
                  <div  ref="space2">
                    <cylinder :data="spaceChartData[1]"></cylinder>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div :class="$style.nfsNotUsed" v-show="!Object.keys(spaceDetail).length">
              <span>暂未使用</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" style="width: 100%">
            <div slot="header" class="clearfix">
              <span class="card-title">已使用空间分配情况</span>
            </div>
            <div class="text item" id="nfsBarContent">
              <three-dimensional-bar style="height: 100%"
                                     id="spaceRatio"
                                     :source-data="nfsPieData"></three-dimensional-bar>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>
    <el-row>
      <span class="title">设备状态</span>
    </el-row>
    <div style="position:relative">
      <el-button type="info"
                 size="small"
                 plain
                 style="position: absolute; top:3px; right:3px; z-index: 10"
                 @click="$router.push({
                 path: 'morestate',
                 query: { activeName: activeName }})">MORE</el-button>
      <el-tabs type="border-card"
               v-model="activeName">
        <el-tab-pane label="数据库备份"
                     name="databaseBackup">
          <el-table :data="databaseBackup|NotNullfilter"
                    ref="databaseBackup"
                    v-loading="infoLoading"
                    :element-loading-background="themeColor.loadingBackGround"
                    style="width: 100%">
            <el-table-column label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${dbDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'backup' }}"
                             class="routerLink">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             align="center"
                             show-overflow-tooltip
                             min-width="100"></el-table-column>
            <el-table-column label="数据库类型"
                             align="center"
                             prop="ddvType"
                             :formatter="dbType"
                             :filters="dbTypeFilter"
                             :filter-method="filterHandle"
                             min-width="100"></el-table-column>
            <el-table-column label="备份结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ dateFmt(scope.row.endTime) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             show-overflow-tooltip
                             min-width="100">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="backupSize"
                             label="备份集大小"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="backupState"
                             label="状态"
                             :filters="filterBackupStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column prop="backupPath"
                             label="备份存储路径"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"
                             fixed="right"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据库恢复"
                     name="databaseRestore">
          <el-table :data="databaseRestore"
                    v-loading="infoLoading"
                    :element-loading-background="themeColor.loadingBackGround"
                    ref="databaseRestore"
                    style="width: 100%">
            <el-table-column label="名称"
                             align="center"
                             show-overflow-tooltip
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: `${dbDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'restore' }}"
                             class="routerLink">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"></el-table-column>
            <el-table-column label="数据库类型"
                             align="center"
                             prop="ddvType"
                             :formatter="dbType"
                             :filters="dbTypeFilter"
                             :filter-method="filterHandle"
                             min-width="120"></el-table-column>
            <el-table-column label="恢复结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ dateFmt(scope.row.endTime) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             min-width="180"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             prop="restoreState"
                             :filters="filterRestoreStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <i v-if="scope.row.restoreState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据库接管"
                     name="databaseTakeOver">
          <el-table :data="databaseTakeOver"
                    v-loading="infoLoading"
                    :element-loading-background="themeColor.loadingBackGround"
                    ref="databaseTakeOver"
                    style="width: 100%">
            <el-table-column label="实例名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${takeOverRouter(scope.row)}`, params: { id: String(scope.row.id) }}"
                             class="routerLink">
                  {{ scope.row.instanceName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="primaryHostIp"
                             label="主机IP"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="主库状态"
                             align="center"
                             min-width="100"
                             prop="primaryState"
                             :filters="dbStateFilter"
                             :filter-method="filterHandle">
              <template slot-scope="scope">
                <el-tag :type="stateTagType(scope.row.primaryState)"
                        size="mini">
                  {{ databaseTypeConverter(scope.row.primaryState) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="viceHostIp"
                             label="备库IP"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="备库状态"
                             align="center"
                             :filters="dbStateFilter"
                             prop="viceState"
                             :filter-method="filterHandle"
                             min-width="100">
              <template slot-scope="scope">
                <el-tag :type="stateTagType(scope.row.viceState)"
                        size="mini">
                  {{ databaseTypeConverter(scope.row.viceState) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="连接状态"
                             prop="overState"
                             :filters="dbLinkStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <el-tag :type="linkTagType(scope.row.overState)"
                        size="mini">
                  {{ linkTypeConverter(scope.row.overState) }}
                </el-tag>
              </template>              
            </el-table-column>
            <el-table-column label="初始化完成时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini"
                        v-if="scope.row.initFinishTime">{{ scope.row.initFinishTime }}</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="文件备份"
                     name="filehostBackup">
          <el-table :data="filehostBackup|NotNullfilter"
                    v-loading="infoLoading"
                    :element-loading-background="themeColor.loadingBackGround"
                    ref="filehostBackup"
                    style="width: 100%">
            <el-table-column label="主机IP"
                             align="center"
                             show-overflow-tooltip
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'filehostDetail', params: { id: String(scope.row.id), type: 'backup' }}"
                             class="routerLink">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="主机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="备份结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             show-overflow-tooltip
                             min-width="100">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="backupSize"
                             label="备份集大小"
                             :formatter="sizeFormatter"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="backupState"
                             label="状态"
                             :filters="filterBackupStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column prop="backupPath"
                             label="备份存储路径"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"
                             fixed="right"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="文件恢复"
                     name="filehostRestore">
          <el-table :data="filehostRestore"
                    v-loading="infoLoading"
                    :element-loading-background="themeColor.loadingBackGround"
                    ref="filehostRestore"
                    style="width: 100%">
            <el-table-column label="恢复主机IP"
                             show-overflow-tooltip
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: 'filehostDetail', params: { id: String(scope.row.id), type: 'restore' }}"
                             class="routerLink">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="name"
                             label="数据库名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"></el-table-column> -->
            <el-table-column label="恢复结束时间"
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>           
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             show-overflow-tooltip
                             min-width="180">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             prop="restoreState"
                             :filters="filterRestoreStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <i v-if="scope.row.restoreState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="应用服务器接管"
                     name="appTakeOver">
          <el-table :data="appTakeOver"
                    v-loading="infoLoading"
                    ref="appTakeOver"
                    style="width: 100%">
            <el-table-column label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${takeOverRouter(scope.row)}`, params: { id: String(scope.row.id) }}"
                             class="routerLink">
                  {{ scope.row.instanceName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="primaryHostIp"
                             label="主机IP"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="viceHostIp"
                             label="备库IP"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="连接状态"
                             prop="overState"
                             :filters="dbLinkStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <el-tag :type="linkTagType(scope.row.overState)"
                        size="mini">
                  {{ linkTypeConverter(scope.row.overState) }}
                </el-tag>
              </template>              
            </el-table-column>
            <el-table-column label="初始化完成时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.initFinishTime">{{ scope.row.initFinishTime }}</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="虚拟机备份"
                     name="vmBackup">
          <el-table :data="vmBackup|NotNullfilter"
                    v-loading="infoLoading"
                    :element-loading-background="themeColor.loadingBackGround"
                    ref="vmBackup"
                    style="width: 100%">
            <el-table-column label="虚拟机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${vmDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'backup' }}"
                             class="routerLink">
                  {{ scope.row.name }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="ascription"
                             label="所属物理主机"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="ddvType"
                             :formatter="vmType"
                             :filters="vmTypeFilter"
                             :filter-method="filterHandle"
                             label="虚拟机类型"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="备份结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             show-overflow-tooltip
                             min-width="100">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="backupSize"
                             label="备份集大小"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="backupState"
                             label="状态"
                             :filters="filterBackupStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column prop="backupPath"
                             label="备份存储路径"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"
                             fixed="right"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="虚拟机恢复"
                     name="vmRestore">
          <el-table :data="vmRestore"
                    v-loading="infoLoading"
                    :element-loading-background="themeColor.loadingBackGround"
                    ref="vmRestore"
                    style="width: 100%">
            <el-table-column label="虚拟机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: `${vmDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'restore' }}"
                             class="routerLink">
                  {{ scope.row.name }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="ascription"
                             label="所属物理主机"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"></el-table-column>
            <el-table-column prop="ddvType"
                             :formatter="vmType"
                             :filters="vmTypeFilter"
                             :filter-method="filterHandle"
                             label="虚拟机类型"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="恢复结束时间"
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>           
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             show-overflow-tooltip
                             min-width="180">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             prop="restoreState"
                             :filters="filterRestoreStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <i v-if="scope.row.restoreState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="虚拟机接管"
                     name="vmTakeOver">
          <el-table :data="vmTakeOver"
                    v-loading="infoLoading"
                    ref="vmTakeOver"
                    style="width: 100%">
            <el-table-column label="虚拟机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${vmTakeOverRouter(scope.row)}`, params: { id: String(scope.row.id) }}"
                             class="routerLink">
                  {{ scope.row.vmName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="sourceIp"
                             label="源虚拟机IP"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="源物理主机IP"
                             align="center"
                             min-width="100"
                             prop="sourceVmHost"></el-table-column>
            <el-table-column label="虚拟机类型"
                             prop="vmType"
                             align="center"
                             min-width="100"
                             :filters="vmTypeFilter"
                             :filter-method="filterHandle">
              <template slot-scope="scope">
                <span>{{ vmTypeMapping[scope.row.vmType] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="targetIp"
                             label="同步虚拟机IP"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="同步物理主机IP"
                             align="center"
                             prop="targetVmHost"
                             min-width="100"></el-table-column>
            <!-- <el-table-column label="说明"
                             align="center"
                             min-width="150">
              <template slot-scope="scope">
                <span>{{ [0, 1].includes(scope.row.linkState) ? '源虚拟机' : '同步虚拟机' }}提供服务</span>
              </template>
            </el-table-column> -->
            <el-table-column label="接管状态"
                             prop="linkState"
                             :filters="vmLinkStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <el-tag size="mini"
                        :type="vmLinkTagType(scope.row.linkState)">
                  {{ vmLinkType(scope.row.linkState) }}
                </el-tag>
              </template>              
            </el-table-column>
            <el-table-column label="创建时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.createTime }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<script>
import { fetchSpaceUse } from '@/api/home';
import { fetchInspectRecords } from '@/api/inspection';
import { fmtSizeFn, keepTwoDecimalFull } from '@/utils/common';
import { useTypeMapping } from '@/utils/constant';
import baseMixin from '@/components/mixins/baseMixins';
import themeMixin from '@/components/mixins/themeMixins';
import inspectionMixin from '@/components/mixins/inspectionMixins';
import dashboardTabMixin from '@/components/mixins/dashboardTabMixins';
// import echartsLiquidfill from 'echarts-liquidfill';
// import 'echarts-gl';
import Cylinder from '@/components/common/Cylinder';
import DrawPie from '@/components/pages/home/DrawPie';
import Inspection from '@/components/pages/home/Inspection';
import InspectionRecords from '@/components/pages/home/InspectionRecords';
import ThreeDimensionalPie from '@/components/pages/home/ThreeDimensionalPie';
import ThreeDimensionalBar from '@/components/pages/home/ThreeDimensionalBar';
export default {
  name: 'Dashboard',
  mixins: [baseMixin, dashboardTabMixin, themeMixin, inspectionMixin],
  components: {
    Cylinder,
    DrawPie,
    Inspection,
    InspectionRecords,
    ThreeDimensionalPie,
    ThreeDimensionalBar
  },
  data() {
    return {
      spaceDetail: {},
      inspect: {},
      record: {},
      infoLoading: true, // table动画加载
      spaceData: { // 用于存放空间使用情况的数据，存储二可能不存在
        name: [],
        percentData: [],
        explain: []
      },
      spaceChartData: []
    };
  },
  computed: {
    nfsInUsedPercent() {
      if(this.spaceDetail.nfsData.total===0) {
        return 100;
      }
      return this.calcPercent(this.spaceDetail.nfsData.inUsed, this.spaceDetail.nfsData.total);
    },
    shareInUsedPercent() {
      if(this.spaceDetail.shareData.total===0) {
        return 100;
      }
      return this.calcPercent(this.spaceDetail.shareData.inUsed, this.spaceDetail.shareData.total);
    },
    nfsAssignedSpace() {
      return this.spaceDetail&&this.spaceDetail.nfsData&&this.spaceDetail.nfsData.nfsUseDetails;
    },
    nfsPieData() {
      let data = {};
      if (this.spaceDetail && this.spaceDetail.nfsData)
        this.spaceDetail.nfsData.nfsUseDetails.forEach(detail => {
          data[detail.nfsUseType] = detail.nfsUseSize;
        });
      return data;
    }
  },
  mounted() {
    this.fetchData();
    this.fetchTabData();
    this.activeName = 'databaseBackup';
  },
  watch: {
    theme() {
      this.drawSpaceChartData();
    },
    hasInspectConfig(val) {
      if (val) {
        this.fetchInspectData();
      }
    }
  },
  methods: {
    fetchData() {
      fetchSpaceUse()
        .then(res => {
          const { data: spaceData } = res.data;
          this.spaceDetail = spaceData;
          if(this.spaceDetail.nfsData) {
            this.spaceData.name.push('存储1');
            this.spaceData.percentData.push(this.nfsInUsedPercent);
            this.spaceData.explain.push(this.addUnit(this.spaceDetail.nfsData.inUsed)+'/'+this.addUnit(this.spaceDetail.nfsData.total)+'\t\t'+'剩余空间：'+this.addUnit(this.spaceDetail.nfsData.unUsed));
          }
          if(this.spaceDetail.shareData) {
            this.spaceData.name.push('存储2');
            this.spaceData.percentData.push(this.shareInUsedPercent);
            this.spaceData.explain.push(this.addUnit(this.spaceDetail.shareData.inUsed)+'/'+this.addUnit(this.spaceDetail.shareData.total)+'\t\t'+'剩余空间：'+this.addUnit(this.spaceDetail.shareData.unUsed));
          }
        })
        .then(() => {
          this.drawSpaceChartData();
        })
        .catch(error => {
          this.$message.error(error);
        });
      if (this.hasInspectConfig) {
        this.fetchInspectData();
      }
    },
    fetchInspectData() {
      fetchInspectRecords(this.inspectUrl)
        .then(res => {
          const { data } = res.data;
          this.inspect = data.inspect;
          this.record = data.record;
        })
    },
    calcPercent(diviver, dividend) {
      if(Number(dividend) === 0) {
        return 100;
      }
      if(Number(diviver) < 0) {
        return 0;
      }
      return keepTwoDecimalFull((diviver/dividend)*100);
    },
    // 单位由M开始转化
    addUnit(data) {
      if (Number(data) < 0) {
        return 0;
      }
      return fmtSizeFn(Number(data)*1024*1024);
    },
    spaceColor(percent) {
      if (percent < 80) {
        return '#32b769';
      } else if (percent < 90) {
        return '#ca8327';
      } else if (percent >= 90) {
        return '#ca3f27';
      }
    },
    drawSpaceChartData() {
      if(Object.keys(this.spaceDetail).length) {
        this.spaceChartData = [{
          id: 'canvas1',
          value: this.spaceData.percentData[0]/100 > 1 ? 1 : this.spaceData.percentData[0]/100,
          width: this.$refs.space1 ? (this.$refs.space1.innerWidth || this.$refs.space1.clientWidth) : 0,
          height: 200,
          color: [this.spaceColor(this.spaceData.percentData[0]), '#C3E9F5'],
          title: {
              show: true,
              text: '存储1',
              style: {
                color: this.themeColor.echartsTitleColor,
                fontSize: '14px',
              }
            },
            subTitle: {
              show: true,
              text: this.spaceData.explain[0],
              style: {
                color: this.spaceColor(this.spaceData.percentData[0]),
                fontSize: '12px',
              }
            }
        }];
        if(Object.keys(this.spaceDetail).length > 1) {
          this.spaceChartData.push({
            id: 'canvas2',
            value: this.spaceData.percentData[1]/100 > 1 ? 1 : this.spaceData.percentData[1]/100,
            width: this.$refs.space2 ? (this.$refs.space2.innerWidth || this.$refs.space2.clientWidth) : 0,
            height: 200,
            color: [this.spaceColor(this.spaceData.percentData[1]), '#D1EBD0'],
            title: {
              show: true,
              text: '存储2',
              style: {
                color: this.themeColor.echartsTitleColor,
                fontSize: '14px',
              }
            },
            subTitle: {
              show: true,
              text: this.spaceData.explain[1],
              style: {
                color: this.spaceColor(this.spaceData.percentData[1]),
                fontSize: '12px',
              }
            }
          })
        }
      }
    }
   },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
$success-color: rgba(145, 199, 174, 1);
$error-color: rgba(212, 130, 101, 1);
.nfsNotUsed {
  font-size: 4em;
  color: #c0c4cc;
  min-height: 144px;
  margin: auto;
  width: 280px;
  span {
    line-height: 3.3em;
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/theme/variable.scss';
.title {
  font-weight: 400;
  // color: #606266;
  padding-top: 0.5em;
  display: inline-block;
}

.text {
    font-size: 14px;
}

.item {
  margin-bottom: 18px;
  height: 300px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.pie-card {
  width: 100%;
  height: 350px;
}

.box-card {
  width: 100%;
  height: 420px;
}

#barChart div {
  margin: 0 auto
}

.card-title {
  display: block;
  text-align: center;
  font-weight: 700;
}

.el-row {
  margin-bottom: 10px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>
