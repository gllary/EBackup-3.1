<template>
<div @click="mousemoveCallBack" style="height: 100%">
  <el-container style="height: 100%; min-width: 1000px;" >
    <el-aside style="width: auto;"
              :style="{ backgroundColor: themeColor.asideColor }"
              class="custom-scrollbar">
      <div class="logo">
        <img :src="logo"
             alt="信服易备"
             height="35px">
      </div>
      <el-menu :background-color="themeColor.asideColor"
               text-color="#fff"
               active-text-color="#fff"
               :unique-opened="true"
               :default-active="defaultActive"
               :collapse="isMenuCollapsed">
        <el-menu-item index="/dashboard">
          <router-link to="/dashboard"
                       tag="div"
                       style="display: inline-block; width: 220px;">
            <IIcon name="dashboard" class="menu-icon"></IIcon>
            <span>主页</span>
          </router-link>
        </el-menu-item>
        <el-submenu v-for="menu in menus"
                    v-if="!menu.meta.isActive || (configMsg.inspectWeb && inspectActive)"
                    :key="menu.path"
                    :index="menu.path">
          <template slot="title">
            <IIcon :name="menu.meta.icon"
                   class="menu-icon"></IIcon>
            <span>{{ menu.meta.title }}</span>
          </template>
          <div v-for="(submenu, index) in menu.children.filter(child => child.meta && child.meta.title)"
               :key="index">
              <el-submenu v-if="submenu.children"
                          :index="submenu.meta.activeName ? submenu.meta.activeName : String(index)">
              <template slot="title">
                <span>{{ submenu.meta.title }}</span>
              </template>
              <el-menu-item v-for="(menu2,index) in submenu.children.filter(child => child.meta && child.meta.title)"
                            :key="index"
                            :index="menu2.meta.activeName ? menu2.meta.activeName : `${menu.path}/${menu2.path}`">
                <router-link :to="`${menu.path}/${menu2.path}`"
                              tag="li">{{ menu2.meta.title }}</router-link>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else
                          :index="submenu.meta.activeName ? submenu.meta.activeName : `${menu.path}/${submenu.path}`">
              <router-link :to="`${menu.path}/${submenu.path}`"
                          tag="li">{{ submenu.meta.title }}</router-link>
            </el-menu-item>
          </div>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container style="overflow: auto;">
      <el-header style="font-size: 12px"
                 class="header">
        <el-breadcrumb separator="/"
                       class="bread-crumb">
          <el-breadcrumb-item v-for="nav in breadcrumb"
                              :key="nav.path"
                              :to="{ path: nav.path}">{{ nav.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="float: right;">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              {{ userName }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="toguide">操作说明</el-dropdown-item>
              <el-dropdown-item command="backupPlan">备份计划</el-dropdown-item>
              <el-dropdown-item command="restorePlan">恢复计划</el-dropdown-item>
              <el-dropdown-item command="inspection" v-if="configMsg.inspectWeb">巡检  (已{{inspectActive ? '启用' : '禁用'}})</el-dropdown-item>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item @mouseover.native="leaveInTheme"
                                @mouseout.native="leaveOutTheme"
                                style="position: relative">
                <span>
                  主题
                  <i class="el-icon-caret-right"></i>
                </span>
                <div v-show="showThemeList"
                     class="themeList">
                  <div v-for="(item, index) in Object.keys(themeTypeMapping)"
                       :key="index"
                       :class="[item === theme ? 'selectedTheme' : '']"
                       @click="updateTheme(item)"
                       style="padding: 0 10px">
                       {{ themeTypeMapping[item] }}
                       <i class="el-icon-check"
                          v-show="item === theme"
                          style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%)"></i>
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- IE不支持main标签 -->
      <!-- <el-main>
        <router-view/>
      </el-main> -->
      <div class="el-main custom-scrollbar">
        <router-view/>
      </div>
    </el-container>
  </el-container>
</div>
  
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import IIcon from './IIcon.vue';
import layoutContraction from '@/assets/layoutContraction.png';
import layoutExpansion from '@/assets/layoutExpansion.png';
import { sockMixin } from '@/components/mixins/commonMixin';
import { fetchConfig, modifyInspectionActive } from '@/api/home';
import themeMixin from '@/components/mixins/themeMixins';
import inspectionMixin from '@/components/mixins/inspectionMixins';
import { sendServerConfig } from '@/api/inspection';
const themeTypeMapping = {
  default: '简约白(默认)',
  deepBlue: '宝石蓝',
  yellow: '流沙金'
};
export default {
  name: 'Layout',
  mixins: [sockMixin, themeMixin, inspectionMixin],
  data() {
    return {
      themeTypeMapping,
      showThemeList: false,
      clientWidth: 1920,
      curTime: new Date().getTime(),
      lastTime: new Date().getTime(),
      timeOut: 30 * 60 * 1000,
      intervalObj: null,
      url: '/socket-host',
      // activedMenuStr:''
    };
  },
  components: {
    IIcon,
  },
  mounted() {
    this.setTimer();
    this.clientWidth = document.documentElement.clientWidth;
    const that = this;
    window.onresize = function windowResize() {
      that.clientWidth = document.documentElement.clientWidth;
      that.setClientWidth(document.documentElement.clientWidth);
    };
  },
  created() {
    this.fetchConfig();
    this.fetchHost().catch(error => {
      this.$message.error(error);
    });
    if (this.inspectActive) {
      this.sendServerConfig();
    }
  },
  destroyed() {
    clearInterval(this.intervalObj);
  },
  computed: {
    isMenuCollapsed() {
      return this.clientWidth < 1300;
    },
    logo() {
      return this.isMenuCollapsed ? layoutContraction : layoutExpansion;
    },
    defaultActive(){
      return this.$route.meta.activeName ? this.$route.meta.activeName : this.$route.path;
    },
    inspectActive() {
      if (this.configMsg.inspectWeb) {
        return this.configMsg.inspectWeb.active;
      }
      return false;
    },
    ...mapState({
      userName: state => {
        if (state.base.userInfo.userName) {
          return state.base.userInfo.userName;
        }
        return state.base.userInfo.loginName;
      },
      userRole: state => {
        if(state.base.userInfo.roles){
          return state.base.userInfo.roles;
        }
      },
      menus: state =>
        state.base.routers.filter(router => router.meta && router.meta.title),
      // [],
      breadcrumb: state => state.nav.breadcrumb,
      theme: state => state.nav.theme,
      configMsg: state => state.nav.configMsg
    }),
  },
  methods: {
    ...mapActions(['logout', 'fetchHost', 'setHost']),
    ...mapMutations(['setClientWidth', 'setConfig']),
    fetchConfig() {
      fetchConfig()
        .then(res => {
          const { data: config } = res.data;
          this.setConfig(config);
        })
    },
    sendServerConfig() {
      const { ebackupServer } = this.configMsg;
      sendServerConfig(this.inspectUrl, { ip: ebackupServer.ip, port: ebackupServer.port })
        .then(res => {})
    },
    handleCommand(command) {
      if (command === 'logout') {
        this._logout();
      } else if (command === 'profile') {
        this.$router.push({ name: 'profile' });
      } else if (command === 'backupPlan') {
        // this.BackupPlans
        this.$router.push({ name: 'backupPlans' });
      } else if (command === 'inspection') {
        this.updateInspection();
      } else if (command === 'restorePlan') {
        this.$router.push({ name: 'restorePlans' });
      }else if (command === 'toguide') {
        let idStr = '';
        let nameStr = '';
         let roleArray = this.userRole;
        if(roleArray[0].name=='文件管理员'){
            nameStr ='fileSystemDeletion';
            idStr = 'fileSystemManual';
          }else if(roleArray[0].name=='Oracle管理员' || roleArray[0]=='SQL Server管理员' || roleArray[0]=='MySql管理员' || roleArray[0]=='DB2管理员' || roleArray[0]=='达梦管理员' || roleArray[0]=='Sybase管理员'|| roleArray[0]=='Cache管理员' || roleArray[0]=='InSql管理员'|| roleArray[0]=='Informix管理员'|| roleArray[0]=='PostgreSQL管理员'){
            nameStr ='addDataBase';
            idStr = 'addDataBaseManual';
          }else if(roleArray[0].name == '虚拟机管理员'){
            nameStr ='addManagement';
            idStr = 'addManagementManual';
          }else if(roleArray[0].name == '应用服务管理员'){
            nameStr ='addApplication';
            idStr = 'addApplicationManual';
          }else if(roleArray[0].name == '超级管理员'){
            nameStr ='dataDaseTakeOver';
            idStr = 'dataDaseTakeOver';
          }

        // console.log('***'+nameStr)
        this.$router.push({ name: nameStr, query: { aId:idStr}});
      }
    },
    updateTheme(theme) {
      this.$store.commit('SET_THEME', theme);
    },
    leaveInTheme() {
      this.showThemeList = true;
    },
    leaveOutTheme() {
      this.showThemeList = false;
    },
    updateInspection() {
      if (this.configMsg.inspectWeb.ip) {
        this.$confirm(`此操作即将${this.inspectActive ? '禁用' : '启用'}巡检功能，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          modifyInspectionActive({ active: this.inspectActive })
            .then(res => {
              const { data: inspectActive, message } = res.data;
              const { inspectWeb, ...others } = this.configMsg;
              const { ip, port, active } = inspectWeb;
              this.setConfig({
                inspectWeb: { ip, port, active: inspectActive.active },
                ...others
              });
              this.$message.success(message);
            })
            .then(() => {
              this.sendServerConfig();
            })
            .catch(error => {
              this.$message.error(error);
            })
        })
        .catch(() => {
          this.$message.info('已取消操作')
        })
      } else {
        this.$message.warning('未配置巡检功能！');
      }
    },
    _logout() {
      this.logout(this.$store.state.base.token).then(message => {
        this.$message.success({
          message,
        });
        this.$router.push('/login');
      });
    },
    setTimer() {
      this.intervalObj = setInterval(this.checkTime, 10000);
    },
    mousemoveCallBack() {
      this.lastTime = new Date().getTime();
    },
    checkTime() {
      this.curTime = new Date().getTime();
      if (this.curTime - this.lastTime > this.timeOut) {
        this._logout();
      }
    },
    connectCallback(client) { //connect连接成功的回调函数
      this.stompClient.subscribe('/host', msg => { // 订阅服务端提供的某个topic
        let {data} = JSON.parse(msg.body);// msg.body为服务端返回的报文
        data = Array.isArray(data) ? data : [];
        this.setHost(data);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/theme/variable.scss';
.logo {
  padding: 11px 10px;
  padding-top: 20px;
}
.logo img {
  margin: 0 auto;
  display: block;
}
.el-header {
  @include content-background-color;
  @include themeify {
    border-bottom: 1px solid themed('main-background-color');
  }
  line-height: 60px;
  position: relative;
}
.el-main {
  @include main-background-color;
  box-sizing: border-box;
  padding: 20px;
}
.el-aside {
  color: #333;
}
.el-menu {
  border: none;
}
.el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.bread-crumb {
  display: inline-block;
  line-height: 0.6;
}
.el-dropdown-link {
  @include primary-color;
  cursor: pointer;
}
.themeList {
  position: absolute;
  right: 100%;
  top: 0;
  border-radius: 5px;
  min-width: 115px;
  @include text-color;
  @include content-background-color;
  @include themeify {
    border: 1px solid themed('main-background-color');
  }
}
.selectedTheme {
  @include primary-color;
  @include themeify {
    background-color: rgba(themed('primary-color'), 0.1);
  }
  position: relative;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.router-link-active {
  color: #ffd04b;
  font-weight: 600;
}
.menu-icon {
  margin-right: 5px;
}
</style>
