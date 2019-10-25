<template>
  <section>
    <el-form inline
             size="medium">
      <el-form-item style="float: right"
                    v-show="!enterFromMenu">
        <el-button type="info"
                   @click="$router.push({name: 'applicationList'})">应用服务器列表</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="success"
                  @click="toguide">操作说明</el-button>
    </el-form-item>
      <el-form-item style="float: right;"
                    v-show="!enterFromMenu">
        <el-button type="primary"
                   @click="displayLinkCreateModal">添加</el-button>
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
        <div :class="$style.hostLinkContainer"
             v-if="hostLink.primaryHost">
          <fieldset :class="$style.hostLinkInOs">
            <legend>
              <span>{{ hostLink.primaryHost.osName }}</span>
            </legend>
            <el-row type="flex"
                    justify="space-around">
              <el-col :span="10">
                <div :class="$style.hostInfo">
                  <div>
                    <i-icon name="host-production"
                            :class="$style.hostIcon"></i-icon>
                    <span>{{ hostLink.primaryHost.name }}</span>
                  </div>
                  <el-row>
                    <el-col :span="8" :offset="8">
                      <i-icon name="ip"
                              :class="$style.ipIcon"></i-icon>
                      <span :class="$style.hostIp">{{ hostLink.primaryHost.hostIp }}</span>
                    </el-col>
                    <el-col :span="8"
                            v-show="hostLink.serviceIpMark === 1 && hostLink.primaryHost.osName === 'Linux'">
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
              </el-col>
              <el-col :span="4">
                <div :class="$style.hostSwitch">
                  <div>
                    <el-popover placement="right"
                                trigger="hover"
                                width="300"
                                :open-delay="200">
                      <h4 style="margin: 5px 0; padding: 3px 0;">最近操作</h4>
                      <p v-if="(!hostLink.latestSwitch || [1, 4].includes(hostLink.latestSwitch.type))&&(!hasSimpleSwitch(hostLink.simpleSwitch))">暂无操作</p>
                      <el-form v-else-if="(!hostLink.latestSwitch || [1, 4].includes(hostLink.latestSwitch.type)) ||
                                          hasSimpleSwitch(hostLink.simpleSwitch)&&(hostLink.simpleSwitch.switchTime>hostLink.latestSwitch.switchTime)"
                                size="mini"
                                label-width="70px">
                        <el-form-item :class="$style.switchFormItem"
                                      :label="osType(hostLink.viceHost) === 'Windows'?'易备IP':'服务IP'">
                          {{ hostLink.simpleSwitch.originIp }}<i class="el-icon-d-arrow-right"></i>{{ hostLink.simpleSwitch.targetIp }}
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      label="状态">
                          <el-tag :type="switchStateStyle(hostLink.simpleSwitch.state)"
                                  size="mini">
                            {{ hostLink.simpleSwitch.state | switchStateFilter }}
                          </el-tag>
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      label="切换信息">
                          {{ hostLink.simpleSwitch.message }}
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      label="完成时间">
                          {{ hostLink.simpleSwitch.switchTime }}
                        </el-form-item>
                      </el-form>
                      <el-form v-else-if="hostLink.latestSwitch.type === 2"
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
                  <div v-if="hostLink.latestSwitch && hostLink.latestSwitch.state === 1 && hostLink.latestSwitch.type === 2"
                      style="margin-top: 12px;">
                    <i class="el-icon-loading"></i>
                    <span style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;"
                          class="switch-text">切换IP中...</span>
                  </div>
                  <div v-else-if="hostLink.latestSwitch && hostLink.latestSwitch.state === 1 && hostLink.latestSwitch.type === 3"
                      style="margin-top: 12px;">
                    <i class="el-icon-loading"></i>
                    <span style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;"
                          class="switch-text">解除连接中...</span>
                  </div>
                  <div v-else-if="simpleSwitchGoing(hostLink)"
                       style="margin-top: 12px;">
                    <i class="el-icon-loading"></i>
                    <span style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;"
                          class="switch-text">单切IP中...</span>
                  </div>
                  <template v-else>
                    <div style="margin: -3px 0 -6px;">
                      <el-button type="text"
                                @click="switchHostIp(hostLink)">切IP</el-button>
                      <el-button type="text"
                                @click="simpleSwitchIp(hostLink)">单切IP</el-button>
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
                  </div>
                  <div>
                    <el-row>
                      <el-col :span="8" :offset="8">
                        <i-icon name="ip"
                                :class="$style.ipIcon"></i-icon>
                        <span :class="$style.hostIp">{{ hostLink.viceHost.hostIp }}</span>
                      </el-col>
                      <el-col :span="8"
                              v-show="hostLink.serviceIpMark === 2 && hostLink.viceHost.osName === 'Linux'">
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
            <el-row v-for="appLink in sortByCreateTime(hostLink.appLinks)"
                    :key="appLink.id"
                    style="position: relative">
              <el-col :span="10">
                <div :class="appLink.primaryApp.role === 1 ? $style.primaryAppInfo : $style.viceAppInfo">
                  <el-row type="flex"
                          align="middle">
                    <el-col :span="8">
                      <h4 :class="appLink.primaryApp.role === 1 ? 'primaryLink' : 'viceLink'">
                        {{appLink.primaryApp.name}}
                      </h4>
                    </el-col>
                    <el-col :span="13"
                            :class="$style.dbInfoCol">
                      <h5>创建时间</h5>
                      <p>{{ appLink.primaryApp.createTime }}</p>
                    </el-col>
                    <el-col :span="3">
                      <div :class="appLink.primaryApp.role === 1 ? $style.primaryRole : $style.viceRole">
                        <span style="font-size: 3vw;">{{ appLink.primaryApp.role | databaseRoleFilter}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="4">
                <div :class="$style.databaseSwitch">
                  <el-popover placement="right"
                              trigger="hover"
                              width="300"
                              :open-delay="200">
                    <el-form size="mini"
                            label-width="70px">
                      <el-form-item :class="$style.switchFormItem"
                                    label="连接状态">
                        <el-tag :type="databaseLinkStateStyle(appLink.state)"
                                size="mini">{{ appLink.state | linkStateFilter }}</el-tag>
                      </el-form-item>
                      <el-form-item :class="$style.switchFormItem"
                                    label="信息">
                        <span>{{ appLink.errorMsg }}</span>
                      </el-form-item>
                    </el-form>
                    <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                         v-if="appLink.state === 1">
                      <div :class="$style.mask"></div>
                      <i-icon name="transportationRight"
                              :class="$style.transportationIcon"></i-icon>
                    </div>
                    <i-icon :name="`switch-${appLink.state}`"
                            slot="reference"
                            :class="$style.switchIcon"
                            v-else></i-icon>
                  </el-popover>
                  <div>
                    <el-button type="text"
                                 @click="$router.push({name: 'applicationLinkDetail', params: { id: String(appLink.id) }})">查看详情</el-button>
                  </div>
                </div>
              </el-col>
              <el-col :span="10">
                <div :class="appLink.viceApp.role === 1 ? $style.primaryAppInfo : $style.viceAppInfo">
                  <el-row type="flex"
                          align="middle">
                    <el-col :span="8">
                      <h4 :class="appLink.viceApp.role === 1 ? 'primaryLink' : 'viceLink'">
                          {{appLink.viceApp.name}}
                      </h4>
                    </el-col>
                    <el-col :span="13"
                            :class="$style.dbInfoCol">
                      <h5>创建时间</h5>
                      <p>{{ appLink.viceApp.createTime }}</p>
                    </el-col>
                    <el-col :span="3">
                      <div :class="appLink.viceApp.role === 1 ? $style.primaryRole : $style.viceRole">
                        <span style="font-size: 3vw;">{{ appLink.viceApp.role | databaseRoleFilter}}</span>
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
    <app-link-create-modal :production-hosts="availableProductionHosts"
                           :links="links"
                           :ebackup-hosts="availableEbackupHosts"
                           :visible.sync="linkCreateModalVisible"
                           :btn-loading="btnLoading"
                           @confirm="createLink"></app-link-create-modal>
    <switch-modal :visible.sync="switchModalVisible"
                  :host-link-ready-to-switch="hostLinkReadyToSwitch"
                  :ready-to-single-switch="readyToSingleSwitch"
                  :ready-to-remove-host-link="readyToRemoveHostLink"
                  :btn-loading="btnLoading"
                  @cancel="cancelSwitch"
                  @confirm="confirmSwitch"></switch-modal>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import SwitchModal from '@/components/pages/application/SwitchModal';
import AppLinkCreateModal from '@/components/pages/application/AppLinkCreateModal';
import takeoverMixin from '@/components/mixins/takeoverMixins';
import themeMixin from '@/components/mixins/themeMixins';
import { fetchLinks, fetchAll, createLinks, deleteLinks } from '@/api/application';
import {
  createSwitches,
  singleSwitchIp
} from '@/api/host';
import dayjs from 'dayjs';
export default {
  name: 'TakeOver',
  components: {
    IIcon,
    SwitchModal,
    AppLinkCreateModal
  },
  mixins: [takeoverMixin, themeMixin],
  data() {
    return {
      links: [],
      items: [],
      switchModalVisible: false,
      linkCreateModalVisible: false,
      hostLinkIdReadyToSwitch: -1,
      readyToSingleSwitch: {},
      readyToRemoveHostLink: {},
      btnLoading: false
    }
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: function() {
      this.items = [];
      this.links = [];
      this.fetchData();
    },
  },
  computed: {
    // 即将切换的设备连接
    hostLinkReadyToSwitch() {
      return this.links.find(
        hostLink => hostLink.id === this.hostLinkIdReadyToSwitch
      );
    },
    enterFromMenu() {
      return this.$route.path.split('/')[2] === 'application' ? false : true;
    },
    appLinks() {
      return this.links.reduce((accumulator, hostLink) => {
        const links = hostLink.appLinks;
        const productionHost = hostLink.primaryHost;
        const ebackupHost = hostLink.viceHost;
        links.forEach(link => {
          link.primaryApp.host = productionHost;
          link.viceApp.host = ebackupHost;
        });
        return [...accumulator, ...links];
      }, []);
    },
    hostsDatabaseMap() {
      const res = {};
      this.specialHosts.forEach(host => {
        const databases = this.items.filter(
          db => db.host.id === host.id && !this.appLinks.map(appLink => appLink.primaryApp.id).includes(db.id)
        );
        res[host.id] = {
          databases,
        };
      });
      return res;
    },
    specialHosts() {
      return this.$store.getters.applicationHosts;
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
  },
  methods: {
    toguide(){
      this.$router.push({ name: 'dataDaseTakeOver', query: { aId:'applicationTakeOver' }})
    },
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.items = data;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchLinks()
        .then(res => {
          const { data: links } = res.data;
          this.links = links;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    sortByCreateTime(data){
      return data.slice().sort( (a, b) => {
        const val1 = a.primaryApp.createTime;
        const val2 = b.primaryApp.createTime;
        // 排序数据库连接
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
        // 排序设备连接
        if(dayjs(val1) < dayjs(val2)){
            return 1;
        }else if(dayjs(val1) > dayjs(val2)){
            return  -1;
        }else{
            return 0;
        }
      });
    },
    // 单切进行中
    simpleSwitchGoing(hostLink) {
      return this.hasSimpleSwitch(hostLink.simpleSwitch) && hostLink.simpleSwitch.state === 1
    },
    // 双切IP
    switchHostIp(hostLink) {
      this.hostLinkIdReadyToSwitch = hostLink.id;
      this.switchModalVisible = true;
    },
    // 单切IP
    simpleSwitchIp(hostLink) {
      this.readyToSingleSwitch = hostLink;
      this.switchModalVisible = true;
    },
    // 解除连接
    removeHostLink(hostLink) {
      this.switchModalVisible = true;
      this.readyToRemoveHostLink = hostLink;
    },
    cancelSwitch() {
      this.hostLinkIdReadyToSwitch = -1;
      this.readyToSingleSwitch = {};
      this.readyToRemoveHostLink = {};
      this.switchModalVisible = false;
      this.btnLoading = false;
    },
    displayLinkCreateModal() {
      this.linkCreateModalVisible = true;
    },
    confirmSwitch() {
      if (!!~this.hostLinkIdReadyToSwitch) { // 切IP
        this.btnLoading = true;
        // 切服务IP、临时IP
        createSwitches(this.hostLinkIdReadyToSwitch)
          .then(res => {
            const { data } = res.data;
            this.links.find(
              link => link.id === this.hostLinkIdReadyToSwitch
            ).latestSwitch = data;
            this.switchModalVisible = false;
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {
            this.btnLoading = false;
          });
      } else if(Object.keys(this.readyToSingleSwitch).length > 0) { // IP单切
        this.btnLoading = true;
        const req = {
          originViceIp: this.singleSwitchOriginIp(this.readyToSingleSwitch),
          targetViceIp: this.singleSwitchTargetIp(this.readyToSingleSwitch)
        };
        const id = this.readyToSingleSwitch.id;
        singleSwitchIp(id, req)
          .then(res => {
            const { data } = res.data
            this.fetchData();
            this.$message({message: data.message, type: this.messageType(data.state)})
            this.switchModalVisible = false;
          })
          .catch(error => {
            this.$message.error(error)
          })
          .then(() => {
            this.btnLoading = false;
          })
      } else if(Object.keys(this.readyToRemoveHostLink).length > 0) { // 解除连接
        this.btnLoading = true;
        deleteLinks(this.readyToRemoveHostLink.id)
          .then(res => {
            const { data: cancelOperation } = res.data;
            this.links.find(
              link => link.id === this.readyToRemoveHostLink.id
            ).latestSwitch = cancelOperation;
            this.switchModalVisible = false;
            this.$message.info('正在尝试解除连接，请等待');
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {
            this.btnLoading = false;
          });
      }
    },
    createLink(formData) {
      this.btnLoading = true;
      createLinks(formData)
        .then(res => {
          const { message } = res.data;
          this.fetchData();
          this.linkCreateModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    }
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
@import '@/style/color.scss';
@import '@/assets/theme/variable.scss';
$primary-color: #409eff;
$vice-color: #6d6d6d;
.envHeader {
  text-align: center;
  h2 {
    margin: 5px 0;
  }
}
.envIcon {
  vertical-align: -0.3em;
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
.hostInfo {
  position: relative;
  text-align: center;
  margin: 1em 0;
}
.hostIcon {
  vertical-align: -0.3em;
  width: 2em;
}
.ipIcon {
  width: 1.6em;
  display: inline-block;
  vertical-align: -0.3em;
  margin-top: 10px;
}
.hostIp {
  color: #909399;
  font-style: italic;
  font-size: 0.9em;
}
.wordHover {
  display: inline-block;
  cursor: pointer;
  transition: all 0.5s ease;
}
.hostSwitch {
  text-align: center;
  margin: 5px 0 0;
}
.switchFormItem {
  margin-bottom: 5px !important;
  label {
    color: #a0a0a0;
  }
}
.removeHostLink {
  color: $delete-color!important;
  padding: 2px 0 3px;
  &:focus {
    color: $delete-color!important;
  }
  &:hover {
    color: lighten($delete-color, 10%);
    transform:scale(1.2);
  }
}
.primaryAppInfo {
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
.viceAppInfo {
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
.primaryAppInfo,
.viceAppInfo {
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
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.databaseSwitch {
  text-align: center;
  margin: 20px 0;
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
.mask {
  animation: move 2s infinite;
  position: absolute;
  height: 3em;
  width: 100px;
  right: -20px;
  @include host-link-content-color
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
</style>