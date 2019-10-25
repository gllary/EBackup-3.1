<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item v-show="enterFromMenu">
        <el-radio-group v-model="type" size="small">
          <el-radio label="vmware" border>VMware</el-radio>
          <el-radio label="hyperV" border>Hyper-V</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="float: right;">
          <el-button type="success"
                    @click="toguide">操作说明</el-button>
      </el-form-item>
      <el-form-item v-show="!enterFromMenu"
                    style="float: right;">
        <el-button type="info"
                   @click="$router.push({name: `${type}CollectManager`})">虚拟机主机</el-button>
      </el-form-item>
      <el-form-item v-show="!enterFromMenu"
                    style="float: right;">
        <el-button type="info"
                   @click="$router.push({name: `${type}List`})">虚拟机列表</el-button>
      </el-form-item>
    </el-form>
    <section style="clear: both">
      <el-row>
        <el-col :span="10">
          <div :class="$style.envHeader">
            <h2 :class="$style.headerTitle">
              <i-icon name="virtual-source"
                      :class="$style.envIcon"></i-icon>
              <span>源虚拟机</span>
            </h2>
          </div>
        </el-col>
        <el-col :span="10"
                :offset="4">
          <div :class="$style.envHeader">
            <h2 :class="$style.headerTitle">
              <i-icon name="virtual-target"
                      :class="$style.envIcon"></i-icon>
              <span>同步虚拟机</span>
            </h2>
          </div>
        </el-col>
      </el-row>
      <div :class="$style.linkContainer">
        <div v-for="link in links"
            :key="link.id"
            style="position: relative">
          <el-row style="display: flex">
            <el-col :span="10">
              <div :class="$style.sourceVirtualInfo">
                <el-row type="flex"
                        align="middle">
                  <el-col :span="8"
                          :class="$style.virtualInfoCol">
                    <h4>
                      <el-tooltip content="提供服务中"
                                  placement="top"
                                  effect="light">
                        <i-icon name="service"
                                :class="$style.linkService"
                                v-if="[0, 1].includes(link.state)"></i-icon>
                      </el-tooltip>
                      <router-link :to="`/virtual/${type}/${link.sourceVirtual.id}`"
                                   class="primaryLink">
                        {{ link.sourceVirtual.vmName }}
                      </router-link>
                    </h4>
                  </el-col>
                  <el-col :span="8"
                          :class="$style.virtualInfoCol">
                    <h4>IP地址</h4>
                    <p>{{ link.sourceVirtual.ip | ipFilter }}</p>
                  </el-col>
                  <el-col :span="8"
                          :class="$style.virtualInfoCol">
                    <h4>所属物理主机</h4>
                    <p>{{ link.sourceVirtual.vmHostName }}</p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="4" style="align-items: center; align-self: center">
              <div :class="$style.virtualSync">
                <el-popover placement="right"
                            trigger="hover"
                            width="300"
                            :open-delay="200">
                  <el-form size="mini"
                           label-width="100px">
                    <el-form-item :class="$style.syncFormItem"
                                  label="连接状态">
                      <el-tag :type="link.state | linkStateStyleFilter"
                              size="mini">{{ link.state | linkStateFilter }}</el-tag>
                    </el-form-item>
                    <el-form-item :class="$style.syncFormItem"
                                  label="信息"
                                  v-if="link.linkMessage">
                      <span>{{ link.linkMessage }}</span>
                    </el-form-item>
                  </el-form>
                  <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">同步策略</h4>
                  <el-form size="mini"
                           label-width="100px">
                    <el-form-item label="同步策略"
                                  :class="$style.syncFormItem">
                      <span>{{ link.strategyConfig.syncTimeStrategy | syncStrategyFilter }}</span>
                    </el-form-item>
                    <el-form-item label="同步周期"
                                  :class="$style.syncFormItem"
                                  v-if="[1, 2].includes(link.strategyConfig.syncTimeStrategy)">
                      <span>{{ link.strategyConfig.syncTimeInterval  }}{{ link.strategyConfig.syncTimeStrategy === 1 ? '分钟' : '小时' }}</span>
                    </el-form-item>
                    <el-form-item label="星期"
                                  :class="$style.syncFormItem"
                                  v-if="link.strategyConfig.syncTimeStrategy === 4">
                      <el-tag :class="$style.infoTag"
                              v-for="week in link.strategyConfig.weekDays"
                              :key="week"
                              size="mini">{{ weekMapping[week] }}</el-tag>
                    </el-form-item>
                    <el-form-item label="时间"
                                  :class="$style.syncFormItem"
                                  v-if="[3, 4].includes(link.strategyConfig.syncTimeStrategy)">
                      <el-tag class="infoTag"
                              size="mini">{{ link.strategyConfig.syncRunTime }}</el-tag>
                    </el-form-item>
                    <el-form-item label="下次同步时间"
                                  :class="$style.syncFormItem"
                                  v-if="link.strategyConfig.nextSyncTime">
                      <span>{{ link.strategyConfig.nextSyncTime }}</span>
                    </el-form-item>
                  </el-form>
                  <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">上次同步状态</h4>
                  <p v-if="!link.syncTime">暂未同步</p>
                  <el-form size="mini"
                           label-width="100px"
                           v-else>
                    <el-form-item :class="$style.syncFormItem"
                                  label="同步状态">
                      <el-tag :type="link.syncState | syncStateStyleFilter"
                              size="mini">{{ link.syncState | syncStateFilter }}</el-tag>
                    </el-form-item>
                    <el-form-item :class="$style.syncFormItem"
                                  label="时间">
                      <span>{{ link.syncTime }}</span>
                    </el-form-item>
                  </el-form>
                  <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">最近一次操作</h4>
                  <p v-if="!Object.keys(link.latestOperationInfo).length">暂无操作</p>
                  <el-form size="mini"
                           label-width="100px"
                           v-else>
                    <el-form-item :class="$style.syncFormItem"
                                  label="操作内容">
                      <span>{{ link.latestOperationInfo.content }}</span>
                    </el-form-item>
                    <el-form-item :class="$style.syncFormItem"
                                  label="操作类型">
                      <span>{{ link.latestOperationInfo.type | syncOperationFilter }}</span>
                    </el-form-item>
                    <el-form-item :class="$style.syncFormItem"
                                  label="状态">
                      <el-tag :type="link.latestOperationInfo.state | operationStateStyleFilter"
                              size="mini">
                        {{ link.latestOperationInfo.state | operationStateFilter }}
                      </el-tag>
                    </el-form-item>
                    <el-form-item :class="$style.syncFormItem"
                                  label="时间">
                      <span>{{ link.latestOperationInfo.time }}</span>
                    </el-form-item>
                  </el-form>
                  <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                       v-if="link.state === 0 || (link.state === 1 && link.currentSyncStatus === 1)">
                    <div :class="$style.rightMask"></div>
                    <i-icon :name="linkIcon(link)"
                            :class="$style.linkIcon"></i-icon>
                  </div>
                  <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                       v-else-if="link.state === 3">
                      <div :class="$style.leftMask"></div>
                      <i-icon :name="linkIcon(link)"
                              :class="$style.linkIcon"></i-icon>
                  </div>
                  <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                       v-else>
                    <i-icon :name="linkIcon(link)"
                            :class="$style.linkIcon"></i-icon>
                  </div>
                </el-popover>
                <div v-if="link.latestOperationInfo && link.latestOperationInfo.state === 1"
                     style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;">
                  <i class="el-icon-loading"></i>
                  <span class="switch-text">{{ link.latestOperationInfo.type | syncOperationFilter }}中...</span>
                </div>
                <div v-else-if="link.state === 0">
                  <i class="el-icon-loading"></i>
                  <span class="switch-text">初始化中...</span>
                </div>
                <div v-else>
                  <div>
                    <el-button type="text"
                               :class="$style.deleteLink"
                               @click="deleteLink(link)">解除连接</el-button>
                  </div>
                  <div>
                    <el-dropdown>
                        <el-tooltip placement="top" effect="dark">
                            <div slot="content">
                                一键接管功能操作</br>
                                <el-button type="text" @click="goto('operation')" style="float: right; "><li class="el-icon-question"></li></el-button>
                            </div>
                            <span :class="$style.dropdownLink">
                                同步操作<i class="el-icon-arrow-down el-icon--right" style="font-size: 12px; margin-left: 0"></i>
                              </span>
                        </el-tooltip>
                      
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="failOverLink(link)">故障转移</el-dropdown-item>
                        <el-dropdown-item @click.native="failBackLink(link)">故障恢复</el-dropdown-item>
                        <el-dropdown-item @click.native="updateStrategy(link)">修改策略</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="text" @click="jumpToLinkDetail(link)">查看详情</el-button>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="10">
              <div :class="$style.targetVirtualInfo">
                <el-row type="flex"
                        align="middle"
                        v-if="link.targetVirtual.vmName">
                  <el-col :span="8"
                          :class="$style.virtualInfoCol">
                    <h4>
                      <el-tooltip content="提供服务中"
                                  placement="top"
                                  effect="light">
                        <i-icon name="service"
                                :class="$style.linkService"
                                v-if="[2, 3].includes(link.state)"></i-icon>
                      </el-tooltip>
                      {{ link.targetVirtual.vmName }}
                    </h4>
                  </el-col>
                  <el-col :span="8"
                          :class="$style.virtualInfoCol">
                    <h4>IP地址</h4>
                    <p>{{ link.targetVirtual.ip | ipFilter }}</p>
                  </el-col>
                  <el-col :span="8"
                          :class="$style.virtualInfoCol">
                    <h4>所属物理主机</h4>
                    <p>{{ link.targetVirtual.vmHostName }}</p>
                  </el-col>
                </el-row>
                <h4 v-else :class="$style.virtualInfo">暂无信息</h4>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </section>
    <delete-link-modal :visible.sync="deleteLinkModalVisible"
                       :btn-loading="btnLoading"
                       :ready-to-delete-link="readyToDeleteLink"
                       @confirm="deleteLinkConfirm"></delete-link-modal>
    <fail-over-modal :visible.sync="failOverModalVisible"
                     :btn-loading="btnLoading"
                     :ready-to-fail-over-link="readyToFailOverLink"
                     @confirm="failOverConfirm"></fail-over-modal>
    <fail-back-modal :visible.sync="failBackModalVisible"
                     :btn-loading="btnLoading"
                     :ready-to-fail-back-link="readyToFailBackLink"
                     @confirm="failBackConfirm"></fail-back-modal>
    <update-link-strategy-modal :visible.sync="updateLinkStrategyModalVisible"
                                :btn-loading="btnLoading"
                                :source-data="readyToUpdateStrategy"
                                @confirm="updateLinkStrategyConfirm"></update-link-strategy-modal>
  </section>
</template>

<script>
import IIcon from '@/components/IIcon';
import DeleteLinkModal from '@/components/pages/virtual/takeover/DeleteLinkModal';
import FailOverModal from '@/components/pages/virtual/takeover/FailOverModal';
import FailBackModal from '@/components/pages/virtual/takeover/FailBackModal';
import UpdateLinkStrategyModal from '@/components/pages/virtual/takeover/UpdateLinkStrategyModal';
import { sockMixin } from '@/components/mixins/commonMixin';
import {
  fetchLinks,
  deleteLink,
  failOverLink,
  failBackLink,
  modifyLinkStrategy
} from '@/api/virtuals';
import {
  virtualMapping,
  syncLinkMapping,
  syncStragegyMapping,
  weekMapping,
  syncStateMapping,
  syncOperationMapping,
  syncOperationStateMapping
} from '@/utils/constant';

export default {
  name: 'TakeOver',
  mixins: [sockMixin],
  components: {
    IIcon,
    DeleteLinkModal,
    FailOverModal,
    FailBackModal,
    UpdateLinkStrategyModal
  },
  data() {
    return {
      items: [],
      btnLoading: false,
      deleteLinkModalVisible: false,
      failOverModalVisible: false,
      failBackModalVisible: false,
      updateLinkStrategyModalVisible: false,
      readyToDeleteLink: {},
      readyToFailOverLink: {},
      readyToFailBackLink: {},
      readyToUpdateStrategy: {},
      weekMapping
    }
  },
  created() {
    this.fetchData();
  },
  filters: {
    ipFilter(value) {
      return value ? value : '暂无';
    },
    linkStateFilter(type) {
      return syncLinkMapping[type];
    },
    syncStrategyFilter(type) {
      return syncStragegyMapping[type];
    },
    syncOperationFilter(type) {
      return syncOperationMapping[type];
    },
    operationStateStyleFilter(state) {
      if (state === 0) {
        return 'success';
      } else if (state === 1) {
        return 'warning';
      } else if (state === 2) {
        return 'danger';
      }
      return '';
    },
    operationStateFilter(state) {
      return syncOperationStateMapping[state];
    },
    linkStateStyleFilter(type) {
      switch(type) {
        case 0:
        case 1:
          return 'warning';
        case 2:
        case 3:
        case 4:
          return 'danger';
        default:
          return 'primary';
      }
    },
    syncStateStyleFilter(state) {
      if(state === 0) {
        return 'success';
      } else if (state === 1) {
        return 'danger';
      } else if (state === 2) {
        return 'warning';
      }
      return 'primary';
    },
    syncStateFilter(state) {
      return syncStateMapping[state];
    },
  },
  computed: {
    enterFromMenu() {
      return this.$route.path.split('/')[1] === 'virtual' ? false : true;
    },
    type: {
      get() {
        const path = this.$route.path;
        return this.$route.path.split('/')[2];
      },
      set(value) {
        this.$router.push({ name: `${value}TakeOverView` });
      },
    },
    vmType() {
      return Number(Object.keys(virtualMapping).find(type => virtualMapping[type] === this.type));
    },
    links() {
      return this.items.filter(item => item.sourceVirtual.type === this.vmType);
    }
  },
  methods: {
    toguide(){
      this.$router.push({ name: 'dataDaseTakeOver', query: { aId:'virtualTakeOver' }})
    },
    goto(id){
      let select = id;
      localStorage.setItem('id',select);
      this.$router.push({ name: 'dataDaseTakeOver', query: { aId:'virtualTakeOver' }})
    },
    fetchData() {
      fetchLinks()
        .then(res => {
          const { data } = res.data;
          this.items = data;
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    connectCallback(client) {
      this.stompClient.subscribe('/virtual-links/add-virtual-link', msg => { // 订阅服务端提供的某个topic
        let { data: link } = JSON.parse(msg.body);
        this.items.push(link);
      });
      this.stompClient.subscribe('/virtual-links/update-virtual-link', msg => { // 订阅服务端提供的某个topic
        let { data: link } = JSON.parse(msg.body);
        const index = this.items.findIndex(item => item.id === link.id);
        this.items.splice(index, 1, link);
      });
      this.stompClient.subscribe('/virtual-links/delete-virtual-link', msg => { // 订阅服务端提供的某个topic
        let { data: id } = JSON.parse(msg.body);
        const index = this.items.findIndex(item => item.id === id);
        this.items.splice(index, 1);
      });
    },
    linkIcon(link) {
      if (link.state === 0 || (link.state === 1 && link.currentSyncStatus === 1)) {
        return 'transportationRight';
      } else if (link.state === 1 && link.currentSyncStatus === 0) {
        return 'switch-2';
      } else if (link.state === 2 && link.latestOperationInfo.type === 0 && link.latestOperationInfo.state === 1) {
        return 'link-exchange';
      } else if (link.state === 2) {
        return 'link-stop';
      } else if (link.state === 3) {
        return 'transportationLeft-warning';
      } else if (link.state === 4) {
        return 'switch-3';
      }
      return '';
    },
    deleteLink(link) {
      this.deleteLinkModalVisible = true;
      this.readyToDeleteLink = link;
    },
    failOverLink(link) {
      this.failOverModalVisible = true;
      this.readyToFailOverLink = link;
    },
    failBackLink(link) {
      this.failBackModalVisible = true;
      this.readyToFailBackLink = link;
    },
    jumpToLinkDetail(link) {
      this.$router.push({
        name:  `${this.type}LinkDetail`,
        params: { id: link.id },
      });
    },
    updateStrategy(link) {
      const { nextSyncTime, ...configs } = link.strategyConfig;
      this.updateLinkStrategyModalVisible = true;
      this.readyToUpdateStrategy = { ...configs, id: link.id };
    },
    deleteLinkConfirm(link) {
      this.btnLoading = true;
      deleteLink(link.id)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.deleteLinkModalVisible = false;
          // this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    failOverConfirm(data) {
      const { link, timePoint } = data;
      this.btnLoading = true;
      failOverLink(link.id, timePoint)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.failOverModalVisible = false;
          // this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    failBackConfirm(data) {
      const { link, timePoint } = data;
      this.btnLoading = true;
      failBackLink(link.id, timePoint)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.failBackModalVisible = false;
          // this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    updateLinkStrategyConfirm(data) {
      this.btnLoading = true;
      const { id, ...configs} = data;
      modifyLinkStrategy(id, configs)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.updateLinkStrategyModalVisible = false;
          // this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    }
  }
}
</script>

<style lang="scss" module>
@import '@/style/common.scss';
@import '@/assets/theme/variable.scss';
.envHeader {
  text-align: center;
}
.headerTitle {
  margin: 5px 0;
}
.envIcon {
  vertical-align: -0.3em;
}
.linkContainer {
  margin: 10px 0;
  border-radius: 5px;
  @include host-link-content-color
}
.sourceVirtualInfo {
  @include themeify {
    border: 1px solid themed('primary-color');
  }
}
.targetVirtualInfo {
  @include themeify {
    border: 1px solid themed('vice-color');
  }
  position: relative;
}
.sourceVirtualInfo:hover {
  @include themeify {
    box-shadow: 0px 0px 2px 1px themed('primary-color');
  }
}
.targetVirtualInfo:hover {
  @include themeify {
    box-shadow: 0px 0px 2px 1px themed('vice-color');
  }
}
.sourceVirtualInfo,
.targetVirtualInfo {
  border-radius: 5px;
  transition: box-shadow 0.5s;
  padding: 5px 0 5px 10px;
  margin: 8px 0;
  min-height: 100px;
}
.virtualInfoCol {
  text-align: center;
}
.virtualInfo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-150%);
}
.virtualSync {
  text-align: center;
}
.syncFormItem {
  margin-bottom: 5px !important;
}
.syncFormItem label {
  color: #a0a0a0;
}
.infoTag {
  margin: 0 2px;
}
.linkIcon {
  width: 3em;
  height: 3em;
  transition: all 0.5s ease;
}
.linkIcon:hover {
  transform: scale(1.2);
}
.deleteLink {
  color: rgb(223, 77, 77)!important;
  padding: 2px 0 3px;
}
.deleteLink:hover {
  color: lighten(rgb(223, 77, 77), 10%);
  transform:scale(1.2);
}
.dropdownLink {
  cursor: pointer;
  @include primary-color;
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
.linkService {
  vertical-align: -0.3em;
  transition: all 0.5s ease;
}
.linkService:hover {
  transform: scale(1.2);
  cursor: pointer;
}
@keyframes move {
  from {
    width: 100px;
  }
  to {
    width: 0;
  }
}
</style>
