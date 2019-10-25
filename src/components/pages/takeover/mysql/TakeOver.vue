<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item v-show="enterFromMenu">
        <el-radio-group v-model="databaseType" size="small">
          <el-radio label="oracle" border>Oracle</el-radio>
          <el-radio label="sqlserver" border>SQLServer</el-radio>
          <el-radio label="insql" border>InSql</el-radio>
          <el-radio label="mysql" border>MySql</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="!enterFromMenu"
                    style="float: right;">
        <el-button type="info"
                   @click="$router.push({name: `${databaseType}List`})">数据库列表</el-button>
      </el-form-item>
      <el-form-item v-show="!enterFromMenu"
                    style="float: right;">
        <el-button type="primary"
                   @click="displayLinkCreateModal">添加</el-button>
      </el-form-item>
      <el-form-item style="float: right;"
                    v-show="['oracle', 'sqlserver'].includes(databaseType)">
        <el-button type="primary"
                   @click="batchSwitch">批量切换</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button icon="el-icon-refresh"
                   @click="refreshData">刷新</el-button>
      </el-form-item>
    </el-form>
    <section style="clear: both;">
      <el-row>
        <el-col :span="10">
          <div :class="$style.envHeader">
            <h2>
              <i-icon name="production-env"
                      :class="$style.envIcon"></i-icon>
              <span>生产环境</span>
            </h2>
          </div>
        </el-col>
        <el-col :span="10"
                :offset="4">
          <div :class="$style.envHeader">
            <h2>
              <i-icon name="ebackup-env"
                      :class="$style.envIcon"></i-icon>
              <span>易备环境</span>
            </h2>
          </div>
        </el-col>
      </el-row>
      <div v-for="hostLink in sortByStartTime(links)"
           :key="hostLink.id">
        <div :class="$style.hostLinkContainer">
          <fieldset :class="$style.hostLinkInOs">
            <legend>
              <span>{{ osType(hostLink.primaryHost) }}</span>
            </legend>
            <el-row type="flex"
                    justify="space-around">
              <el-col :span="10">
                <div :class="$style.hostInfo">
                  <el-popover placement="right"
                              trigger="hover"
                              width="300"
                              :disabled="!hostLink.vipIpMark"
                              :open-delay="200">
                    <h4 style="margin: 5px 0; padding: 3px 0;">非主节点</h4>
                    <p v-if="!(hostLink.primaryNodes && hostLink.primaryNodes.length)">暂无子节点</p>
                    <div v-else>
                      <p v-for="primaryNode in hostLink.primaryNodes"
                         :key="primaryNode.id">
                        <el-row>
                          <el-col :span="12">{{ primaryNode.name }}</el-col>
                          <el-col :span="12"
                                  :class="$style.hostIp">{{ primaryNode.hostIp }}</el-col>
                        </el-row>
                      </p>
                    </div>
                    <div slot="reference" :class="$style.wordHover">
                      <i-icon name="host-production"
                              :class="$style.hostIcon"></i-icon>
                      <span>{{ hostLink.primaryHost.name }}</span>
                    </div>
                  </el-popover>
                  <div>
                    <el-row>
                      <el-col :span="8"
                              style="min-height: 1px;">
                        <el-popover placement="right"
                                    trigger="hover"
                                    width="150"
                                    :open-delay="200">
                          <h4 style="margin: 5px 0; padding: 3px 0;">非主节点VIP</h4>
                          <p v-if="!sonNodeVip(hostLink).length">暂无</p>
                          <div v-else>
                            <p v-for="(vip, index) in sonNodeVip(hostLink)"
                              :key="index"
                              :class="$style.hostIp">{{ vip }}</p>
                          </div>
                          <div v-show="hostLink.vipIpMark && hostLink.vipIpMark === 1"
                               :class="$style.wordHover"
                               slot="reference">
                            <i-icon :class="$style.ipIcon"
                                    :name="`${theme}-vip`"></i-icon>
                            <span :class="$style.hostIp">{{ hostLink.primaryHost.vip }}</span>
                          </div>
                        </el-popover>
                      </el-col>
                      <el-col :span="8">
                        <i-icon name="ip"
                                :class="$style.ipIcon"></i-icon>
                        <span :class="$style.hostIp">{{ hostLink.primaryHost.hostIp }}</span>
                      </el-col>
                      <el-col :span="8"
                              v-show="hostLink.serviceIpMark === 1 && ['Linux', 'RAC'].includes(osType(hostLink.primaryHost))">
                        <el-tooltip content="提供服务中"
                                    effect="light"
                                    placement="right"
                                    :open-delay="200">
                          <div :class="$style.wordHover">
                            <i-icon :class="$style.ipIcon"
                                    name="service"></i-icon>
                            <span :class="$style.hostIp">{{ hostLink.primaryHost.serviceIp }}</span>
                          </div>
                        </el-tooltip>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
              <el-col :span="4">
                <div :class="$style.hostSwitch">
                  <div>
                    <el-popover placement="right"
                                trigger="hover"
                                width="300"
                                :open-delay="200">
                      <h4 style="margin: 5px 0; padding: 3px 0;">最近操作</h4>
                      <p v-if="(!hostLink.latestSwitch || [1, 4, 5, 6].includes(hostLink.latestSwitch.type))">暂无操作</p>
                      <!-- 切换IP, 单切IP -->
                      <el-form v-else-if="[2, 7].includes(hostLink.latestSwitch.type)"
                               size="mini"
                               label-width="70px">
                        <el-form-item :class="$style.switchFormItem"
                                      label="切换内容">
                          <span>{{ hostLink.latestSwitch.content }}</span>
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      label="切换方式">
                          <span>{{ hostLink.latestSwitch.manual | switchManualFilter }}</span>
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      label="状态">
                          <el-tag :type="hostLink.latestSwitch.state === 2 ? 'success' : 'danger' "
                                  size="mini">
                            {{ hostLink.latestSwitch.state | switchStateFilter }}
                          </el-tag>
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      v-if="hostLink.latestSwitch.state !== 1"
                                      label="完成时间">
                          <span>{{ hostLink.latestSwitch.switchTime }}</span>
                        </el-form-item>
                      </el-form>
                      <!-- 解除连接 -->
                      <el-form v-else-if="hostLink.latestSwitch.type === 3"
                              size="mini"
                              label-width="70px">
                        <el-form-item :class="$style.switchFormItem"
                                      label="解除信息">
                          <span>{{ hostLink.latestSwitch.content }}</span>
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      label="状态">
                          <el-tag :type="switchStateStyle(hostLink.latestSwitch.state)"
                                  size="mini">
                            {{ hostLink.latestSwitch.state | switchStateFilter }}
                          </el-tag>
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      v-if="hostLink.latestSwitch.state !== 1"
                                      label="完成时间">
                          <span>{{ hostLink.latestSwitch.switchTime }}</span>
                        </el-form-item>
                      </el-form>
                      <i-icon :name="`${theme}-link`"
                              :class="$style.hostSwitchIcon"
                              slot="reference"></i-icon>
                    </el-popover>
                  </div>
                  <div v-if="hostLink.latestSwitch && hostLink.latestSwitch.state === 1 && [2, 3, 7].includes(hostLink.latestSwitch.type)"
                       style="margin-top: 12px;">
                    <i class="el-icon-loading"></i>
                    <span style="font-size: 0.9em; vertical-align: 0.1em;"
                          class="switch-text">{{ hostLink.latestSwitch.type | switchTypeFilter }}中...</span>
                  </div>
                  <template v-else>
                    <div style="margin: -3px 0 -6px;">
                      <el-button type="text"
                                 :disabled="!hostLink.databaseLinks.some(dbLink => dbLink.primaryDatabase.role === 2)"
                                 @click="switchMultiDatabasesToProduction(hostLink)">切主</el-button>
                      <el-button type="text"
                                 @click="switchHostIp(hostLink)"
                                 :disabled="osType(hostLink.primaryHost) === 'AIX'">切IP</el-button>
                      <el-button type="text"
                                :disabled="!hostLink.databaseLinks.some(dbLink => dbLink.viceDatabase.role === 2)"
                                @click="switchMultiDatabaseToEbackup(hostLink)">切备</el-button>
                    </div>
                    <div v-show="!enterFromMenu">
                      <el-button type="text"
                                 @click="removeHostLink(hostLink)"
                                 :class="$style.removeHostLink">解除连接</el-button>
                    </div>
                  </template>
                </div>
              </el-col>
              <el-col :span="10">
                <div :class="$style.hostInfo">
                  <div>
                    <i-icon name="host-ebackup"
                            :class="$style.hostIcon"></i-icon>
                    <span>{{ hostLink.viceHost.name }}</span>
                    <el-dropdown style="position: absolute; right: 0px; top: -9px;" size="small">
                      <el-button size="mini">
                        更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :disabled="false" v-if="['oracle', 'sqlserver'].includes(databaseType)"
                                          @click.native="queryVerifyResult(hostLink)">验证结果</el-dropdown-item>
                        <span v-if="[1, 5].includes(hostLink.primaryHost.databaseType)">
                          <el-dropdown-item :disabled="!availableSingleSwitchIp(hostLink)"
                                            @click.native="singleSwitchIp(hostLink)">单切IP</el-dropdown-item>
                          <el-dropdown-item :disabled="!hostLink.databaseLinks.some(link => availableSingleSwitchDb(hostLink, link))"
                                            @click.native="singleSwitchMultiDatabases(hostLink)">单切实例</el-dropdown-item>
                          <!-- <el-dropdown-item :disabled="!hostLink.databaseLinks.some(link => availableRestoreSingleSwitch(hostLink, link))"
                                            @click.native="restoreSingleSwitch(hostLink, true)">单切恢复</el-dropdown-item> -->
                          <el-dropdown-item :disabled="!hostLink.databaseLinks.some(link => availableCutBackSingle(link))"
                                            @click.native="readyToCutBack(hostLink, true)">回切初始化</el-dropdown-item>
                        </span>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div>
                    <el-row>
                      <el-col :span="8"
                              style="min-height: 1px;">
                        <el-popover placement="right"
                                    trigger="hover"
                                    width="150"
                                    :open-delay="200">
                          <h4 style="margin: 5px 0; padding: 3px 0;">非主节点VIP</h4>
                          <p v-if="!sonNodeVip(hostLink).length">暂无</p>
                          <div v-else>
                            <p v-for="vip in sonNodeVip(hostLink)"
                              :key="vip.id"
                              :class="$style.hostIp">{{ vip }}</p>
                          </div>
                          <div v-show="hostLink.vipIpMark && hostLink.vipIpMark === 2"
                               :class="$style.wordHover"
                               slot="reference">
                            <i-icon :class="$style.ipIcon"
                                    :name="`${theme}-vip`"></i-icon>
                            <span :class="$style.hostIp">{{ hostLink.primaryHost.vip }}</span>
                          </div>
                        </el-popover>
                      </el-col>
                      <el-col :span="8">
                        <i-icon name="ip"
                                :class="$style.ipIcon"></i-icon>
                        <span :class="$style.hostIp">{{ hostLink.viceHost.hostIp }}</span>
                      </el-col>
                      <el-col :span="8"
                              v-show="hostLink.serviceIpMark === 2 && ['Linux', 'RAC'].includes(osType(hostLink.viceHost))">
                        <el-tooltip content="提供服务中"
                                    effect="light"
                                    placement="right"
                                    :open-delay="200">
                          <div :class="$style.wordHover">
                            <i-icon :class="$style.ipIcon"
                                    name="service"></i-icon>
                            <span :class="$style.hostIp">{{ hostLink.viceHost.serviceIp }}</span>
                          </div>
                        </el-tooltip>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 数据库连接的排列 -->
            <el-row v-for="dbLink in sortByCreateTime(hostLink.databaseLinks)"
                    :key="dbLink.id"
                    style="position: relative; display: flex">
              <el-col :span="10">
                <div :class="dbLink.primaryDatabase.role === 1 ? $style.primaryDatabaseInfo : $style.viceDatabaseInfo">
                  <el-row type="flex"
                          align="middle">
                    <el-col :span="8">
                      <h4>
                        <router-link :class="dbLink.primaryDatabase.role === 1 ? 'primaryLink' : 'viceLink'"
                                     :to="`/db/${databaseType}/${dbLink.primaryDatabase.id}`">
                          {{dbLink.primaryDatabase.name}}
                        </router-link>
                      </h4>
                    </el-col>
                    <el-col :span="5"
                            :class="$style.dbInfoCol">
                      <h5>{{ instanceName }}</h5>
                      <p>{{ dbLink.primaryDatabase.instanceName }}</p>
                    </el-col>
                    <el-col :span="5"
                            :class="$style.dbInfoCol">
                      <h5>登录名</h5>
                      <p>{{ dbLink.primaryDatabase.loginName }}</p>
                    </el-col>
                    <el-col :span="3"
                            :class="$style.dbInfoCol">
                      <h5>状态</h5>
                      <p>
                        <el-tag :type="databaseStateStyle(dbLink.primaryDatabase.state)"
                                size="mini">{{ dbLink.primaryDatabase.state | databaseStateFilter }}</el-tag>
                      </p>
                    </el-col>
                    <el-col :span="3">
                      <div :class="dbLink.primaryDatabase.role === 1 ? $style.primaryRole : $style.viceRole">
                        <span style="font-size: 3vw;">{{ dbLink.primaryDatabase.role | databaseRoleFilter}}</span>
                      </div>
                    </el-col>
                  </el-row>

                </div>
              </el-col>
              <el-col :span="4" style="align-items: center; align-self: center;">
                <div :class="$style.databaseSwitch">
                  <el-popover placement="right"
                              trigger="hover"
                              width="300"
                              :open-delay="200">
                    <el-form size="mini"
                             label-width="70px">
                      <el-form-item :class="$style.switchFormItem"
                                    label="连接状态">
                        <el-tag :type="databaseLinkStateStyle(dbLink.state)"
                                size="mini">{{ dbLink.state | linkStateFilter }}</el-tag>
                      </el-form-item>
                      <el-form-item :class="$style.switchFormItem"
                                    label="信息">
                        <span>{{ dbLink.errMsg }}</span>
                      </el-form-item>
                    </el-form>
                    <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">最近操作</h4>
                    <p v-if="!dbLink.latestSwitch || ![1, 4, 5, 6].includes(dbLink.latestSwitch.type)">暂无操作</p>
                    <el-form v-else
                             size="mini"
                             label-width="70px">
                      <el-form-item :class="$style.switchFormItem"
                                    label="切换内容">
                        <span>{{ dbLink.latestSwitch.content }}</span>
                      </el-form-item>
                      <el-form-item :class="$style.switchFormItem"
                                    label="切换方式">
                        <span>{{ dbLink.latestSwitch.manual | switchManualFilter }}</span>
                      </el-form-item>
                      <el-form-item :class="$style.switchFormItem"
                                    label="状态">
                        <el-tag size="mini"
                                :type="switchStateStyle(dbLink.latestSwitch.state)">
                          {{ dbLink.latestSwitch.state | switchStateFilter }}
                        </el-tag>
                      </el-form-item>
                      <el-form-item :class="$style.switchFormItem"
                                    v-if="dbLink.latestSwitch.consume"
                                    label="持续时间">
                        <timer v-if="dbLink.latestSwitch.state === 1" :val="dbLink.latestSwitch.consume"></timer>
                        <span v-else>{{ dbLink.latestSwitch.consume | durationFilter }}</span>
                      </el-form-item>
                      <el-form-item :class="$style.switchFormItem"
                                    v-if="dbLink.latestSwitch.state !== 1"
                                    label="完成时间">
                        <span>{{ dbLink.latestSwitch.switchTime }}</span>
                      </el-form-item>
                    </el-form>
                    <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                         v-if="dbLink.state === 1">
                      <div :class="$style.rightMask"></div>
                      <i-icon name="transportationRight"
                              :class="$style.transportationIcon"></i-icon>
                    </div>
                    <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                         v-else-if="dbLink.state === 6">
                      <div :class="$style.leftMask"></div>
                      <i-icon name="transportationLeft"
                              :class="$style.transportationIcon"></i-icon>
                    </div>
                    <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                         v-else>
                      <i-icon :name="`switch-${dbLink.state}`"
                              :class="$style.switchIcon"></i-icon>
                    </div>
                  </el-popover>
                  <div v-if="dbLink.latestSwitch && dbLink.latestSwitch.state === 1 && [1, 4, 5, 6].includes(dbLink.latestSwitch.type)"
                       style="margin-top: 6px;">
                    <i class="el-icon-loading"></i>
                    <span style="font-size: 0.9em; vertical-align: 0.1em;"
                          class="switch-text">
                      <template v-if="dbLink.latestSwitch.type === 1">切换{{instanceName.substring(0, instanceName.length-1)}}中...</template>
                      <template v-else>{{ dbLink.latestSwitch.type | switchTypeFilter}}中...</template>
                    </span>
                  </div>
                  <div v-else-if="dbLink.failOverOnGoing"
                       style="margin-top: 6px;">
                    <i class="el-icon-loading"></i>
                    <span style="font-size: 0.9em; vertical-align: 0.1em;"
                          class="switch-text">
                      {{ dbLink.failOverState === 1 ? '关闭故障转移' : '开启故障转移'}}中...
                    </span>
                  </div>
                  <div v-else>
                    <div v-if="availableFailOver(hostLink)">
                      <el-button type="text"
                                 @click="failOver(dbLink)"
                                 :class="$style.failOver">{{dbLink.failOverState === 1?'关闭故障转移':'开启故障转移'}}</el-button>
                    </div>
                    <div>
                      <el-dropdown v-if="[1, 5].includes(hostLink.primaryHost.databaseType)">
                        <span :class="$style.dropdownLink">
                          切换操作<i class="el-icon-arrow-down el-icon--right" style="font-size: 12px; margin-left: 0"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="switchDatabase(dbLink.id)">切换实例</el-dropdown-item>
                          <el-dropdown-item @click.native="singleSwitchDatabase(dbLink.id)"
                                            :disabled="!availableSingleSwitchDb(hostLink, dbLink)">单切实例</el-dropdown-item>
                          <!-- <el-dropdown-item @click.native="restoreSingleSwitch(hostLink, false, [dbLink])"
                                            :disabled="!availableRestoreSingleSwitch(hostLink, dbLink)">单切恢复</el-dropdown-item> -->
                          <el-dropdown-item @click.native="readyToCutBack(hostLink, false, [dbLink])"
                                            :disabled="!(availableCutBackSingle(dbLink))">回切初始化</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                      <el-button type="text"
                                 v-else
                                 @click="switchDatabase(dbLink.id)">切换{{instanceName.substring(0, instanceName.length-1)}}</el-button>
                      <el-button type="text"
                                 @click="jumpToLinkDetail(dbLink.id)">查看详情</el-button>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="10">
                <div :class="dbLink.viceDatabase.role === 1 ? $style.primaryDatabaseInfo : $style.viceDatabaseInfo">
                  <el-row type="flex"
                          align="middle">
                    <el-col :span="8">
                      <h4>
                        <router-link :class="dbLink.viceDatabase.role === 1 ? 'primaryLink' : 'viceLink'"
                                     :to="`/db/${databaseType}/${dbLink.viceDatabase.id}`">
                          {{dbLink.viceDatabase.name}}
                        </router-link>
                      </h4>
                    </el-col>
                    <el-col :span="5"
                            :class="$style.dbInfoCol">
                      <h5>{{ instanceName }}</h5>
                      <p>{{ dbLink.viceDatabase.instanceName }}</p>
                    </el-col>
                    <el-col :span="5"
                            :class="$style.dbInfoCol">
                      <h5>登录名</h5>
                      <p>{{ dbLink.viceDatabase.loginName }}</p>
                    </el-col>
                    <el-col :span="3"
                            :class="$style.dbInfoCol">
                      <h5>状态</h5>
                      <p>
                        <el-tag :type="databaseStateStyle(dbLink.viceDatabase.state)"
                                size="mini">{{ dbLink.viceDatabase.state | databaseStateFilter }}</el-tag>
                      </p>
                    </el-col>
                    <el-col :span="3">
                      <div :class="dbLink.viceDatabase.role === 1 ? $style.primaryRole : $style.viceRole">
                        <span style="font-size: 3vw;">{{ dbLink.viceDatabase.role | databaseRoleFilter}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </fieldset>
        </div>
      </div>
    </section>
    <cut-back-modal :visible.sync="cutBackVisible"
                    :cut-back-msg="hostLinkSwitchMsg"
                    :btn-loading="btnLoading"
                    :multiply="multiply"
                    @confirm="cutBackConfirm"></cut-back-modal>
    <single-switch-ip-modal :visible.sync="singleSwitchIpModalVisible"
                            :single-switch-ip-msg="hostLinkSwitchMsg"
                            :btnLoading="btnLoading"
                            @confirm="singleSwitchIpConfirm"></single-switch-ip-modal>
    <switch-database-links-modal :visible.sync="switchDatabasesModalVisible"
                                 :database-links-ready-to-switch="databaseLinksReadyToSwitch"
                                 :btn-loading="btnLoading"
                                 :single-switch-databases="singleSwitchDatabases"
                                 @confirm="switchDatabaseLinksConfirm"></switch-database-links-modal>
    <restore-switch-modal :visible.sync="restoreSwitchVisible"
                          :restore-switch-msg="hostLinkSwitchMsg"
                          :btnLoading="btnLoading"
                          :multiply="multiply"
                          @confirm="restoreSwitchConfirm"></restore-switch-modal>
    <switch-ip-modal :visible.sync="switchIpModalVisible"
                     :host-link-ready-to-switch="hostLinkReadyToSwitch"
                     :btn-loading="btnLoading"
                     @confirm="switchIpConfirm"></switch-ip-modal>
    <remove-host-link-modal :visible.sync="removeHostLinkModalVisible"
                            :ready-to-remove-host-link.sync="hostLinkSwitchMsg"
                            :btn-loading="btnLoading"
                            @confirm="removeHostLinkConfirm"></remove-host-link-modal>
    <fail-over-modal :visible.sync="failOverModalVisible"
                     :fail-over-msg="dbSwitchMsg"
                     :btn-loading="btnLoading"
                     @confirm="failOverConfirm"></fail-over-modal>
    <database-link-create-modal :production-hosts="availableProductionHosts"
                                :links="links"
                                :ebackup-hosts="availableEbackupHosts"
                                :visible.sync="linkCreateModalVisible"
                                :type="databaseType"
                                :btn-loading="btnLoading"
                                @confirm="createLink"></database-link-create-modal>
    <batch-switch-modal :visible.sync="switchDialog"
                        :originLinks="switchLinks"
                        :flag="flag"
                        :btn-loading="btnLoading"
                        :databaseType="databaseType"
                        @confirm="addSwitchPlan"></batch-switch-modal>
    <TakeoverVerificationResult :id="selectLinkId" :visible.sync="verifyResultModalVisible"></TakeoverVerificationResult>
  </section>
</template>
<script>
import BatchSwitchModal from '@/components/modal/BatchSwitchModal';
import DatabaseLinkCreateModal from '@/components/pages/takeover/DatabaseLinkCreateModal';
import CutBackModal from '@/components/pages/takeover/CutBackModal';
import RestoreSwitchModal from '@/components/pages/takeover/RestoreSwitchModal';
import RemoveHostLinkModal from '@/components/pages/takeover/RemoveHostLinkModal';
import SingleSwitchIpModal from '@/components/pages/takeover/SingleSwitchIpModal';
import SwitchIpModal from '@/components/pages/takeover/SwitchIpModal';
import SwitchDatabaseLinksModal from '@/components/pages/takeover/SwitchDatabaseLinksModal';
import FailOverModal from '@/components/pages/takeover/FailOverModal';
import TakeoverVerificationResult from '@/components/modal/TakeoverVerificationResult';
import IIcon from '@/components/IIcon';
import Timer from '@/components/Timer';
import dayjs from 'dayjs';
import {
  fetchDBList,
  fetchLinks,
  createLinks,
  createSwitches,
  createSingleSwitches,
  singleSwitchInstance,
  readyToCutBack
} from '@/api/common';
import {
  createSwitches as switchHostIp,
  vipSwitches as switchVip,
  fetchAll,
  deleteLinks,
  singleSwitchIp
} from '@/api/host';
import { validatePassword } from '@/api/user';
import {
  databaseStateMapping,
  databaseRoleMapping,
  linkStateMapping,
  switchStateMapping,
  switchManualMapping
} from '@/utils/constant';
import takeoverMixin from '@/components/mixins/takeoverMixins';
import batchSwitchMixin from '@/components/mixins/batchSwitchMixins';
import themeMixin from '@/components/mixins/themeMixins';
import baseMixin from '@/components/mixins/baseMixins';
// 模拟数据
// import { items, links, hosts, hosts2 } from '../../utils/mock-data';

const switchMethod = {
  switchPrimary: createSwitches,
  switchVice: createSwitches,
  switchInstance: createSwitches,
  singleSwitchInstance: singleSwitchInstance,
  singleSwitchRestore: '',
  readyToCutBack: ''
}

const switchIpMethod = {
  true: switchVip,
  false: switchHostIp
}

export default {
  name: 'TakeOver',
  mixins: [takeoverMixin, batchSwitchMixin, themeMixin, baseMixin],
  components: {
    IIcon,
    Timer,
    DatabaseLinkCreateModal,
    BatchSwitchModal,
    CutBackModal,
    RestoreSwitchModal,
    RestoreSwitchModal,
    RestoreSwitchModal,
    SingleSwitchIpModal,
    SwitchDatabaseLinksModal,
    SwitchIpModal,
    RemoveHostLinkModal,
    FailOverModal,
    TakeoverVerificationResult
  },
  data() {
    return {
      items: [], // 所有的数据库
      links: [], // 数据库连接
      linkCreateModalVisible: false,
      databaseLinkIdsReadyToSwitch: [],
      btnLoading: false,
      hostLinkIdReadyToSwitch: -1, // 切IP
      singleSwitchDatabases: false, // 标记单切实例还是双切实例
      cutBackVisible: false,
      restoreSwitchVisible: false,
      singleSwitchIpModalVisible: false,
      switchDatabasesModalVisible: false,
      switchIpModalVisible: false,
      removeHostLinkModalVisible: false,
      failOverModalVisible: false,
      hostLinkSwitchMsg: {}, // 即将切换的设备连接
      dbSwitchMsg: {}, // 即将切换的数据库连接
      multiply: false, // 标记单个或批量操作
      timer: null,
      verifyResultModalVisible: false,
      selectLinkId: null,
      switchType: '',
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.setTimer(this.timer);
  },
  destroyed: function() {
    this.clearTimer(this.timer);
  },
  watch: {
    $route: function() {
      this.items = [];
      this.links = [];
      this.fetchData();
    },
  },
  computed: {
    databaseType: {
      get() {
        const path = this.$route.path;
        // /db/xxx/takeover
        return this.$route.path.substring(4, path.lastIndexOf('/'));
      },
      set(value) {
        this.$router.push({ name: `${value}TakeOverView` });
      },
    },
    // 判断是不是从菜单进入，有不同的展示形式
    enterFromMenu() {
      return this.$route.path.substring(1, 3) === 'db' ? false : true;
    },
    specialHosts() {
      return this.$store.getters.mysqlHosts;
    },
    /**
      设备ID与其下数据库的对应关系
      hostId: {
        databases: [
          {database}, ...
        ]
      }
     */
    hostsDatabaseMap() {
      const res = {};
      this.specialHosts.forEach(host => {
        const databases = this.items.filter(
          db => db.host.id === host.id && !this.databaseLinks.map(dbLink => dbLink.primaryDatabase.id).includes(db.id)
        );
        res[host.id] = {
          databases,
        };
      });
      return res;
    },
    productionHosts() {
      return this.specialHosts.filter(host => host.hostType === 1);
    },
    ebackupHosts() {
      return this.specialHosts.filter(host => host.hostType === 2);
    },
    // 可以进行初始化连接操作的生产设备
    // 该设备下可能没有数据库／实例 需要进一步筛选
    availableProductionHosts() {
      return this.productionHosts.map(host => {
          const databases = this.hostsDatabaseMap[host.id].databases || [];
          return { databases, ...host };
        });
    },
    // 可以进行初始化连接操作的易备设备
    // 该设备可能有数据库／实例 需要进一步筛选
    availableEbackupHosts() {
      return this.ebackupHosts.map(host => {
          const databases = this.hostsDatabaseMap[host.id].databases || [];
          return { databases, ...host };
        });
    },
    databaseLinks() {
      return this.links.reduce((accumulator, hostLink) => {
        const links = hostLink.databaseLinks;
        const productionHost = hostLink.primaryHost;
        const ebackupHost = hostLink.viceHost;
        links.forEach(link => {
          link.primaryDatabase.host = productionHost;
          link.viceDatabase.host = ebackupHost;
        });
        return [...accumulator, ...links];
      }, []);
    },
    // 即将切换的数据库连接
    databaseLinksReadyToSwitch() {
      return this.databaseLinks.filter(
        link => this.databaseLinkIdsReadyToSwitch.indexOf(link.id) >= 0
      );
    },
    // 即将切换的设备连接
    hostLinkReadyToSwitch() {
      return this.links.find(
        hostLink => hostLink.id === this.hostLinkIdReadyToSwitch
      );
    },
    instanceName() {
      if (this.databaseType === 'oracle') {
        return '实例名';
      } else {
        return '数据库名';
      }
    },
  },
  methods: {
    fetchData() {
      fetchDBList(this.databaseType)
        .then(res => {
          const { data } = res.data;
          this.items = data;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchLinks(this.databaseType)
        .then(res => {
          const { data: links } = res.data;
          this.links = links;
        })
        .catch(error => {
          this.$message.error(error);
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
        fetchDBList(this.databaseType),
        fetchLinks(this.databaseType),
      ])
        .then(resArr => {
          const { data } = resArr[0].data;
          const { data: links } = resArr[1].data;
          this.items = data;
          this.links = links;
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
    displayLinkCreateModal() {
      this.linkCreateModalVisible = true;
    },
    // 解除连接
    removeHostLink(hostLink) {
      this.removeHostLinkModalVisible = true;
      this.hostLinkSwitchMsg = hostLink;
    },
    // 回切初始化(单个、批量)
    cutBackSwitch(hostLink, multiply, link = []) {
      this.switchType = 'readyToCutBack';
      this.cutBackVisible = true;
      const { databaseLinks, ...other } = hostLink;
      this.multiply = multiply;
      const readyToCutBackLinks = multiply ? databaseLinks.filter(item => this.availableCutBackSingle(item)) : link;
      this.hostLinkSwitchMsg = { databaseLinks: readyToCutBackLinks, ...other };
    },
    // 单切恢复（单个、批量）
    restoreSingleSwitch(hostLink, multiply, link = []) {
      this.switchType = 'singleSwitchRestore';
      this.restoreSwitchVisible = true;
      const { databaseLinks, ...other } = hostLink;
      this.multiply = multiply;
      const readyToSwitchDbLinks = multiply ? hostLink.databaseLinks.filter(item => this.availableRestoreSingleSwitch(hostLink, item)) : link;
      this.hostLinkSwitchMsg = { databaseLinks: readyToSwitchDbLinks, ...other };
      console.log(this.hostLinkSwitchMsg);
    },
    // 切主
    switchMultiDatabasesToProduction(hostLink) {
      const links = hostLink.databaseLinks
        .filter(dbLink => dbLink.primaryDatabase.role === 2)
        .map(dbLink => dbLink.id);
      this.switchType = 'switchPrimary';
      this.databaseLinkIdsReadyToSwitch = links;
      this.switchDatabasesModalVisible = true;
    },
    // 切备
    switchMultiDatabaseToEbackup(hostLink) {
      const links = hostLink.databaseLinks
        .filter(dbLink => dbLink.viceDatabase.role === 2)
        .map(dbLink => dbLink.id);
      this.switchType = 'switchVice';
      this.databaseLinkIdsReadyToSwitch = links;
      this.switchDatabasesModalVisible = true;
    },
    // 双切单个实例
    switchDatabase(databaseLinkId) {
      this.switchType = 'switchInstance';
      this.databaseLinkIdsReadyToSwitch = [databaseLinkId];
      this.switchDatabasesModalVisible = true;
    },
    // 单切多个实例
    singleSwitchMultiDatabases(hostLink) {
      this.switchType = 'singleSwitchInstance';
      const links = hostLink.databaseLinks
        .filter(dbLink => dbLink.viceDatabase.role === 2)
        .map(dbLink => dbLink.id);
      // this.switchType = 'switchVice';
      this.databaseLinkIdsReadyToSwitch = links;
      this.switchDatabasesModalVisible = true;
      // this.switchMultiDatabaseToEbackup(hostLink);
      // this.singleSwitchDatabases = true;
    },
    // 单切单个实例
    singleSwitchDatabase(databaseLinkId) {
      this.switchType = 'singleSwitchInstance';
      // this.switchDatabase(databaseLinkId);
      this.databaseLinkIdsReadyToSwitch = [databaseLinkId];
      this.switchDatabasesModalVisible = true;
      // this.singleSwitchDatabases = true;
    },
    // 切IP(临时IP、服务IP、scanIP、vip)
    switchHostIp(hostLink) {
      this.hostLinkIdReadyToSwitch = hostLink.id;
      this.switchIpModalVisible = true;
    },
    // 单切IP
    singleSwitchIp(hostLink) {
      this.hostLinkSwitchMsg = hostLink;
      this.singleSwitchIpModalVisible = true;
    },
    // 故障转移
    failOver(link) {
      this.dbSwitchMsg = link;
      this.failOverModalVisible = true;
    },
    // 回切初始化
    cutBackConfirm(switchIds) {
      this.btnLoading = true;
      readyToCutBack(this.databaseType, {linkIds: switchIds})
        .then(res => {
          const { data, message } = res.data;
          this.databaseLinks.forEach(link => {
            if (switchIds.includes(link.id)) {
              link.latestSwitch = data.find(s => s.linkId === link.id);
            }
          })
          this.cutBackVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    // 单切IP
    singleSwitchIpConfirm(singleSwitchIpMsg) {
      this.btnLoading = true;
      const req = {
        originViceIp: this.singleSwitchOriginIp(singleSwitchIpMsg),
        targetViceIp: this.singleSwitchTargetIp(singleSwitchIpMsg)
      };
      const id = singleSwitchIpMsg.id;
      singleSwitchIp(id, req)
        .then(res => {
          const { message } = res.data;
          this.fetchData();
          this.singleSwitchIpModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    // 切换实例(单切/双切)
    switchDatabaseLinksConfirm() {
      this.btnLoading = true;
      console.log(this.switchType, switchMethod, switchMethod[this.switchType]);
      switchMethod[this.switchType](this.databaseType, {
          linkIds: this.databaseLinkIdsReadyToSwitch,
        })
          .then(res => {
            const { data, message } = res.data;
            // 修改的是computed数据的引用，引用指向的就是data中的数据
            this.switchDatabasesModalVisible = false;
            this.$message.success(message);
            this.fetchData();
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {
            this.btnLoading = false;
          });
    },
    // 单切恢复
    restoreSwitchConfirm(switchIds) {
      this.btnLoading = true;
      readyToCutBack(this.databaseType, {linkIds: switchIds})
        .then(res => {
          const { data, message } = res.data;
          this.databaseLinks.forEach(link => {
            if (switchIds.includes(link.id)) {
              link.latestSwitch = data.find(s => s.linkId === link.id);
            }
          });
          this.$message.success(message);
          this.restoreSwitchVisible = false;
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    // 切vip或者切服务IP、scanIP、临时IP(服务IP、scanIP、临时IP用的同一个url)
    switchIpConfirm(switchVip) {
      this.btnLoading = true;
      switchIpMethod[switchVip](this.hostLinkIdReadyToSwitch)
        .then(res => {
          const { data, message } = res.data;
          this.switchIpModalVisible = false;
          this.$message.success(message);
          this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    // 解除连接
    removeHostLinkConfirm(readyToRemoveHostLink) {
      this.btnLoading = true;
      deleteLinks(readyToRemoveHostLink.id)
        .then(res => {
          const { data: cancelOperation } = res.data;
          this.links.find(
            link => link.id === readyToRemoveHostLink.id
          ).latestSwitch = cancelOperation;
          this.removeHostLinkModalVisible = false;
          this.$message.info('正在尝试解除连接，请等待');
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    // 故障转移
    failOverConfirm(failOverMsg) {
      this.btnLoading = true;
      this.$set(failOverMsg, 'failOverOnGoing', true); // 标识是否正在开启或关闭故障转移
      const req = {
        linkId: failOverMsg.id,
        data: {
          failOverState: failOverMsg.failOverState
        }
      }
      failOverOracle(req)
        .then(res => {
          const { data: failOverOperation } = res.data;
          const msgType = !failOverOperation.operationState?'success':'error';
          this.databaseLinks.find(
            link => link.id === failOverMsg.id
          ).failOverState = failOverOperation.failOverState;
          this.failOverModalVisible = false;
          this.$message[msgType](failOverOperation.msg);
        })
        .catch(error => {
          this.$message.error(error);
        }).
        then(() => {
          this.btnLoading = false;
          this.$delete(failOverMsg, 'failOverOnGoing');
        });
    },
    // 回切初始化或单切恢复
    readyToCutBack(hostLink, multiply, link = []) {
      console.log(hostLink)
      // this.$confirm('此操作将执行回切初始化，是否先进行单切恢复？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.restoreSingleSwitch(hostLink, multiply, link);
      //   })
      //   .catch(() => {
      this.cutBackSwitch(hostLink, multiply, link);
        // });
    },
    /**
        可以单切实例的环境：
        1、windows的10g、11g、12c
        2、linux的11g、12c
        3、rac的10g、11g
        4、AIX的11g
        生产库-主，易备库-备
    */
    availableSingleSwitchDb({ primaryHost }, { viceDatabase }) {
      if(viceDatabase.role === 2) {
        if(this.databaseType === 'mysql') {
          return true;
        }
      }
      return false;
    },
    /**
     * 可以单切IP的环境：
     * 1、windows的10g、11g、12c
     * 2、linux的11g、12c
     **/
    availableSingleSwitchIp({ primaryHost }) {
      if(this.databaseType === 'mysql') {
        return true;
      }
      return false;
    },
    /**
     * 可以使用故障转移的环境：
     * 1、windows的11g、12c
     * 2、linux的11g、12c
       3、rac的11g
     * 4、AIX的11g
     */
    availableFailOver({ primaryHost }) {
      if(primaryHost.databaseType === 1) {
        switch(this.osType(primaryHost)) {
          case 'Windows':
          case 'Linux':
            return [2, 3].includes(primaryHost.oracleVersion);
          case 'RAC':
          case 'AIX':
            return primaryHost.oracleVersion === 2;
          default:
            return false;
        }
      }
      return false;
    },
    /**
      可以批量单切恢复的实例: windows、linux下的11g,12C环境
      生产库非正常，易备库环境为主
      故障转移处于关闭状态
    */
    availableRestoreSingleSwitch({ primaryHost }, dbLink) {
      if(dbLink.viceDatabase.role === 1 && dbLink.primaryDatabase.state !== 1 && dbLink.failOverState === 0) {
        if(this.databaseType === 'mysql') {
          return false;
        }
      }
      return false;
    },
    /** ● 连接：异常不可接管
        ● 易备库主，正常
        ● 生产库备，非正常
    **/
    availableCutBackSingle({ state, viceDatabase, primaryDatabase }) {
      return (state === 3 || state === 4);
    },
    jumpToLinkDetail(linkId) {
      if (this.databaseType === 'oracle') {
        this.$router.push({
          name: 'oracleLinkDetail',
          params: { id: String(linkId) },
        });
      } else if (this.databaseType === 'sqlserver') {
        this.$router.push({
          name: 'sqlserverLinkDetail',
          params: { id: String(linkId) },
        });
      } else if (this.databaseType === 'insql') {
        this.$router.push({
          name: 'insqlLinkDetail',
          params: { id: String(linkId) },
        });
      } else if (this.databaseType === 'mysql') {
        this.$router.push({
          name: 'mysqlLinkDetail',
          params: { id: String(linkId) },
        });
      }
    },
    createLink(data) {
      let linkObj = data;
      if (this.databaseType === 'sqlserver') {
        const detail = data.detail;
        const {primaryDatabaseId, viceLoginName, vicePassword, vicePathType, vicePath} = detail;
        let assignPath = '';
        if (vicePathType === 'custom') {
          assignPath = vicePath;
        }
        linkObj.detail = {
          primaryDatabaseId,
          viceLoginName,
          vicePassword,
          assignPath
        }
      }
      this.btnLoading = true;
      createLinks(this.databaseType, linkObj)
        .then(res => {
          const { data } = res.data;
          this.linkCreateModalVisible = false;
          // const alreadyLinkedIndex = this.links.findIndex(linked => linked.id === data.id);
          // if(alreadyLinkedIndex !== -1) { // 当前创建的实例连接的上级设备连接已存在
          //   const databaseLinks = this.links.find(linked => linked.id === data.id).databaseLinks;
          //   data.databaseLinks = data.databaseLinks.concat(databaseLinks);
          //   this.links.splice(
          //     alreadyLinkedIndex,
          //     1,
          //     data
          //   );
          // } else { // 新创建的设备连接与实例连接
          //   this.links.push(data);
          // }
          this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    // 非主节点VIP集合
    sonNodeVip(hostLink) {
      if(hostLink.primaryNodes)
        return hostLink.primaryNodes.map(node => node.vip)
      return []
    },
    setTimer() {
      this.clearTimer();
      this.timer = setInterval(() => {
        Promise.all([
          fetchDBList(this.databaseType),
          fetchLinks(this.databaseType),
        ]).then(resArr => {
          const { data } = resArr[0].data;
          const { data: links } = resArr[1].data;
          this.items = data;
          this.links = links;
        });
      }, 20000);
    },
    clearTimer() {
      clearInterval(this.timer);
    },
    sortByCreateTime(data){
      return data.slice().sort( (a, b) => {
        const val1 = a.primaryDatabase.createTime;
        const val2 = b.primaryDatabase.createTime;
        // 默认是时间排序
        if(dayjs(val1) < dayjs(val2)){
            return 1;
        }else if(dayjs(val1) > dayjs(val2)){
            return  -1;
        }else{
            return 0;
        }
      });
    },
    sortByStartTime(data){
      return data.slice().sort( (a, b) => {
        const val1 = a.startTime;
        const val2 = b.startTime;
        // 默认是时间排序
        if(dayjs(val1) < dayjs(val2)){
            return 1;
        }else if(dayjs(val1) > dayjs(val2)){
            return  -1;
        }else{
            return 0;
        }
      });
    },
    queryVerifyResult(obj) {
      this.selectLinkId = obj.id;
      this.verifyResultModalVisible = true;
    },
  }
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
@import '@/style/color.scss';
@import '@/assets/theme/variable.scss';

.envHeader {
  text-align: center;
  h2 {
    margin: 5px 0;
  }
}
.envIcon {
  vertical-align: -0.3em;
}
.wordHover {
  display: inline-block;
  cursor: pointer;
  transition: all 0.5s ease;
}
.hostIcon {
  vertical-align: -0.3em;
  width: 2em;
}

.hostLinkContainer {
  margin: 10px 0;
  border-radius: 5px;
  @include host-link-content-color
}
.hostLinkInOs {
  @include themeify {
    border: 1px dotted themed('primary-color')
  }
  border-radius: 5px;
  & legend {
    @include primary-color;
  }
}
.hostLinkNotRac {
  border: 0;
}
.hostInfo {
  position: relative;
  text-align: center;
  margin: 1em 0;
}
.vipIcon {
  position: absolute;
  margin-top: 0.5em;
  left: 100px;
  width: 2em;
  height: 2em;
}
.serviceIcon {
  position: absolute;
  // margin-left: 30px;
  right: 80px;
  margin-top: -1em;
  width: 2em;
  height: 2em;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.ipIcon {
  width: 1.6em;
  display: inline-block;
  vertical-align: -0.3em;
  margin-top: 10px;
}
.restoreSingleSwitchDb {
  position: absolute;
  margin-top: -0.3em;
  right: 10px;
  width: 2em;
  height: 2em;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  } 
}
.dropdownLink {
  cursor: pointer;
  @include primary-color;
}
.hostIp {
  color: #909399;
  font-style: italic;
  font-size: 0.9em;
}
.hostSwitch {
  text-align: center;
  margin: 5px 0 0;
}
.removeHostLink,
.failOver {
  color: $delete-color!important;
  padding: 2px 0 3px;
  &:focus {
    color: $delete-color;
  }
  &:hover {
    color: lighten($delete-color, 10%);
    transform:scale(1.2);
  }
}
.primaryDatabaseInfo {
  @include themeify {
    border: 1px solid themed('primary-color')
  }
  border-radius: 5px;
  transition: box-shadow 0.5s;
  &:hover {
    // box-shadow: 0px 0px 2px 1px $primary-color;
    @include themeify {
      box-shadow: 0px 0px 2px 1px themed('primary-color');
    }
  }
}
.viceDatabaseInfo {
  @include themeify {
    border: 1px solid themed('vice-color');
  }
  border-radius: 5px;
  transition: box-shadow 0.5s;
  &:hover {
    @include themeify {
      box-shadow: 0px 0px 2px 1px themed('vice-color');
    }
  }
}

.primaryDatabaseInfo,
.viceDatabaseInfo {
  padding: 5px 0 5px 10px;
  margin: 8px 0;
  min-height: 100px;
}
.dbInfoCol {
  text-align: center;
  h5 {
    margin: 10px 0;
  }
  p {
    margin: 8px 0;
  }
}
.databaseSwitch {
  text-align: center;
  // vertical-align: middle;
  // display: flex;
  // margin: 20px 0;
}
.primaryRole {
  text-align: center;
  @include themeify {
    background-color: themed('primary-color')
  }
  color: #ffffff;
  font-size: 2.8em;
  line-height: 2.3em;
  height: 111px;
  margin: -5px -1px;
  border-radius: 0 3px 3px 0;
}
.viceRole {
  text-align: center;
  @include themeify {
    background-color: themed('vice-color')
  }
  color: #ffffff;
  font-size: 2.8em;
  line-height: 2.3em;
  height: 111px;
  margin: -5px -1px;
  border-radius: 0 3px 3px 0;
}
.hostSwitchIcon {
  width: 3em;
  height: 1.4em;
  // cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.switchIcon,
.transportationIcon {
  width: 3em;
  height: 3em;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.rightMask,
.leftMask {
  animation: move 2s infinite;
  position: absolute;
  height: 3em;
  width: 100px;
  right: -20px;
  @include host-link-content-color;
}
.leftMask {
  left: -20px;
}
@keyframes move {
  from {
    width: 100px;
  }
  to {
    width: 0;
  }
}
.dbLinkInfoItem {
  margin-bottom: 10px;
  label {
    display: inline-block;
    padding-right: 12px;
    text-align: right;
    color: #a0a0a0;
    width: 58px;
  }
}
.switchFormItem {
  margin-bottom: 5px !important;
  label {
    color: #a0a0a0;
  }
}

// 切换modal
.switchModalIcon {
  width: 9em;
  height: 9em;
  margin: 25% 25%;
}
.switchModalName {
  display: inline-block;
  width: 10em;
}
.switchModalDetail {
  display: inline-block;
  width: 5em;
}
.switchModalIp {
  display: inline-block;
  width: 7em;
}
</style>
