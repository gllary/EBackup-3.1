<template>
<el-container style="height: 100%; border: 1px solid #eee">
    <el-header style=" font-size: 12px;"> 
      <h3 style="line-height:40px;height:40px;color:white"><router-link :to="{ name: 'dashboard'}" style="color: white;font-size: 18px;"><i class="el-icon-s-home"></i>主页</router-link> |  信服易备操作手册</h3>
    </el-header>

  <el-container style="height: calc(100% - 120px)" class="middle">
      <el-aside width="220px" >
          <el-menu 
            id="Guide_menu"
            :unique-opened="true"
            :default-active="defaultActive"
            @open="toOpen">
            <el-submenu index="/dataDaseTakeOver?aId=dataDaseManual" v-if="activedMenuA">
              <template slot="title"><i class="el-icon-sort"></i>一键接管</template>
              <el-menu-item-group>
                <el-menu-item index="/dataDaseManual"  style="height: 1px;" class="manualtab"></el-menu-item>
                <router-link :to="{ name: 'dataDaseTakeOver', query: { aId:'dataDaseTakeOver' }}"><el-menu-item index="/dataDaseTakeOver"  > <i class="el-icon-key"></i>数据库</el-menu-item></router-link>
                <router-link :to="{ name: 'dataDaseTakeOver', query: { aId:'virtualTakeOver' }}"><el-menu-item index="/virtualTakeOver"><i class="el-icon-key"></i>虚拟机</el-menu-item></router-link>
                <router-link :to="{ name: 'dataDaseTakeOver', query: { aId:'applicationTakeOver' }}"><el-menu-item index="/applicationTakeOver"><i class="el-icon-key"></i>应用服务器</el-menu-item></router-link>
                <router-link :to="{ name: 'dataDaseTakeOver', query: { aId:'disasterDrills' }}"><el-menu-item index="/disasterDrills"><i class="el-icon-key"></i>灾备演练</el-menu-item></router-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="/fileSystemDeletion?aId=fileSystemManual" v-if="activedMenuB">
              <template slot="title"><i class="el-icon-document"></i>文件系统数据保护</template>
              <el-menu-item-group>
                  <el-menu-item index="/fileSystemManual"  style="height: 1px;" class="manualtab"></el-menu-item>
                  <router-link :to="{ name: 'fileSystemDeletion', query: { aId:'fileSystemDeletion' }}"> <el-menu-item index="/fileSystemDeletion" ><i class="el-icon-key"></i>增删改服务器</el-menu-item></router-link>
                  <router-link :to="{ name: 'fileSystemDeletion', query: { aId:'fileSystemBackup' }}"><el-menu-item index="/fileSystemBackup" ><i class="el-icon-key"></i>备份</el-menu-item></router-link>
                  <router-link :to="{ name: 'fileSystemDeletion', query: { aId:'fileSystemRecover' }}"><el-menu-item index="/fileSystemRecover"><i class="el-icon-key"></i>恢复</el-menu-item></router-link>
                  <router-link :to="{ name: 'fileSystemDeletion', query: { aId:'fileSystemTermination' }}"><el-menu-item index="/fileSystemTermination"><i class="el-icon-key"></i>终止计划</el-menu-item></router-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="/addDataBase?aId=addDataBaseManual" v-if="activedMenuC"> 
              <template slot="title"><i class="el-icon-coin"></i>数据库数据保护</template>
              <el-menu-item-group>
                  <el-menu-item index="/addDataBaseManual"  style="height: 1px;" class="manualtab"></el-menu-item>
                  <router-link :to="{ name: 'addDataBase', query: { aId:'addDataBase' }}"><el-menu-item index="/addDataBase"><i class="el-icon-key"></i>添加数据库</el-menu-item></router-link>
                  <router-link :to="{ name: 'addDataBase', query: { aId:'modifyDataBase' }}"><el-menu-item index="/modifyDataBase"><i class="el-icon-key"></i>删改数据库</el-menu-item></router-link>
                  <router-link :to="{ name: 'addDataBase', query: { aId:'dataBaseBackup' }}"><el-menu-item index="/dataBaseBackup"><i class="el-icon-key"></i>备份</el-menu-item></router-link>
                  <router-link :to="{ name: 'addDataBase', query: { aId:'dataBaseRecover' }}"><el-menu-item index="/dataBaseRecover"><i class="el-icon-key"></i>恢复</el-menu-item></router-link>
                  <router-link :to="{ name: 'addDataBase', query: { aId:'takeOverDataBase' }}"><el-menu-item index="/takeOverDataBase"><i class="el-icon-key"></i>一键接管</el-menu-item></router-link>
                  <router-link :to="{ name: 'addDataBase', query: { aId:'dataBaseMonitor' }}"><el-menu-item index="/dataBaseMonitor"><i class="el-icon-key"></i>监控</el-menu-item></router-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="/addManagement?aId=addManagementManual" v-if="activedMenuD">
              <template slot="title"><i class="el-icon-collection"></i>虚拟机数据保护</template>
              <el-menu-item-group>
                  <el-menu-item index="/addManagementManual"  style="height: 1px;" class="manualtab"></el-menu-item>
                  <router-link :to="{ name: 'addManagement', query: { aId:'addManagement' }}"><el-menu-item index="/addManagement"><i class="el-icon-key"></i>添加虚拟机管理设备</el-menu-item></router-link>
                  <router-link :to="{ name: 'addManagement', query: { aId:'virtualMonitor' }}"><el-menu-item index="/virtualMonitor"><i class="el-icon-key"></i>虚拟机主机管理</el-menu-item></router-link>
                  <router-link :to="{ name: 'addManagement', query: { aId:'virtualBackUp' }}"><el-menu-item index="/virtualBackUp"><i class="el-icon-key"></i>备份</el-menu-item></router-link>
                  <router-link :to="{ name: 'addManagement', query: { aId:'virtualRecover' }}"><el-menu-item index="/virtualRecover"><i class="el-icon-key"></i>恢复</el-menu-item></router-link>
                  <router-link :to="{ name: 'addManagement', query: { aId:'takeOverVirtual' }}"><el-menu-item index="/takeOverVirtual"><i class="el-icon-key"></i>一键接管</el-menu-item></router-link>
                  <router-link :to="{ name: 'addManagement', query: { aId:'virtualStart' }}"><el-menu-item index="/virtualStart"><i class="el-icon-key"></i>虚拟机启动</el-menu-item></router-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="addApplication?aId=addApplicationManual" v-if="activedMenuE">
              <template slot="title"><i class="el-icon-suitcase"></i>应用服务器保护</template>
              <el-menu-item-group>
                  <el-menu-item index="/addApplicationManual"  style="height: 1px;" class="manualtab"></el-menu-item>
                  <router-link :to="{ name: 'addApplication', query: { aId:'addApplication' }}"><el-menu-item index="/addApplication"><i class="el-icon-key"></i>添加应用服务器</el-menu-item></router-link>
                  <router-link :to="{ name: 'addApplication', query: { aId:'applicationDeletion' }}"><el-menu-item index="/applicationDeletion"><i class="el-icon-key"></i>删改应用服务器</el-menu-item></router-link>
                  <router-link :to="{ name: 'addApplication', query: { aId:'takeOverApplication' }}"><el-menu-item index="/takeOverApplication"><i class="el-icon-key"></i>一键接管</el-menu-item></router-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="/inspectionTask?aId=inspectionTaskManual" v-if="activedMenuF">
              <template slot="title"><i class="el-icon-odometer"></i>智能巡检</template>
              <el-menu-item-group>
                  <el-menu-item index="/inspectionTaskManual"  style="height: 1px;" class="manualtab"></el-menu-item>
                  <router-link :to="{ name: 'inspectionTask', query: { aId:'inspectionTask' }}"><el-menu-item index="/inspectionTask"><i class="el-icon-key"></i>巡检任务</el-menu-item></router-link>
                  <router-link :to="{ name: 'inspectionTask', query: { aId:'model' }}"><el-menu-item index="/model"><i class="el-icon-key"></i>模板</el-menu-item></router-link>
                  <router-link :to="{ name: 'inspectionTask', query: { aId:'parameter' }}"><el-menu-item index="/parameter"><i class="el-icon-key"></i>参数配置</el-menu-item></router-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="/equipmentManage?aId=equipmentManageManual" v-if="activedMenuG">
              <template slot="title"><i class="el-icon-setting"></i>系统管理</template>
              <el-menu-item-group>
                <el-menu-item index="/equipmentManageManual"  style="height: 1px;" class="manualtab"></el-menu-item>
                <router-link :to="{ name: 'equipmentManage', query: { aId:'equipmentManage' }}"><el-menu-item index="/equipmentManage"><i class="el-icon-key"></i>设备管理</el-menu-item></router-link>
                <router-link :to="{ name: 'equipmentManage', query: { aId:'configurationManage' }}"><el-menu-item index="/configurationManage"><i class="el-icon-key"></i>配置管理</el-menu-item></router-link>
                <router-link :to="{ name: 'equipmentManage', query: { aId:'roleManage' }}"><el-menu-item index="/roleManage"><i class="el-icon-key"></i>权限管理</el-menu-item></router-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="/deploymentManage?aId=deploymentManageManual" v-if="activedMenuH">
              <template slot="title"><i class="el-icon-help"></i>自动化部署</template>
              <el-menu-item-group>
                  <el-menu-item index="/deploymentManageManual"  style="height: 1px;" class="manualtab"></el-menu-item>
                <router-link :to="{ name: 'deploymentManage', query: { aId:'deploymentManage' }}"><el-menu-item index="/deploymentManage"><i class="el-icon-key"></i>部署管理</el-menu-item></router-link>
                <router-link :to="{ name: 'deploymentManage', query: { aId:'repository' }}"><el-menu-item index="/repository"><i class="el-icon-key"></i>版本库</el-menu-item></router-link>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
  <el-main class="main-content"
           @scroll.native="getScroll">
     <div class="main">
        <router-view ref='child' @func="isActived"></router-view>
      </div>
  </el-main>
  </el-container>
  <el-footer style="font-size: 12px;border:5px;">
    <div style="float:right;margin-top:24px;color:white">
      <span >© 2019 武汉四通信息服务有限公司 或其子公司,保留所有权利。</span>
    </div>
  </el-footer>
</el-container>

</template>
<script>
  import { mapState, mapActions, mapMutations } from 'vuex';
   export default {
    data() {
      return {
        defaultAc :'/'+this.$route.query.aId,
        activedMenuA:false,
        activedMenuB:false,
        activedMenuC:false,
        activedMenuD:false,
        activedMenuE:false,
        activedMenuF:false,
        activedMenuG:false,
        activedMenuH:false,

      }
    },
    mounted(){
            this.fetchData();
          },
    // 监控页面路由name，发现不同路由则将页面定位至顶部，并将当前路由name存放在本地储存中
    watch:{
        '$route':'fetchData'
    },
    computed:{
      defaultActive(){
        return this.defaultAc;
    },
    ...mapState({
      userRole: state => {
        if(state.base.userInfo.roles){
          return state.base.userInfo.roles;
        }
      },
    }),
    },
    methods:{
      getScroll() {
        const ele = document.querySelector('.main-content');
        let isbottom = ele.scrollTop+ele.clientHeight-ele.scrollHeight
        if(isbottom >= 0){
          this.$refs.child.toBottom()
          // console.log('到底了')
        }else{
          this.$refs.child.onScroll(ele.scrollTop)
        }
      },
      fetchData(){
          let index = this.$route.name;
          let select = localStorage.getItem('pathid');
          if(select!=null){
            if(select !=index){
              document.querySelector('.main').scrollIntoView({block:"start"});
            }
          }
          localStorage.setItem('pathid',index);
          this.defaultAc = '/'+this.$route.query.aId;
          // 判断权限
          let activedMenuStr = '';
          let roleArray = this.userRole;
          for( let i=0;i<roleArray.length;i++){
            // console.log(this.userRole)
            if(roleArray[i].name=='文件管理员'){
              activedMenuStr=activedMenuStr+'/'+'B'
            }else if(roleArray[i].name=='Oracle管理员' || roleArray[i]=='SQL Server管理员' || roleArray[i]=='MySql管理员' || roleArray[i]=='DB2管理员' || roleArray[i]=='达梦管理员' || roleArray[i]=='Sybase管理员'|| roleArray[i]=='Cache管理员' || roleArray[i]=='InSql管理员'|| roleArray[i]=='Informix管理员'|| roleArray[i]=='PostgreSQL管理员'){
              activedMenuStr=activedMenuStr+'/'+'C'+'A'
            }else if(roleArray[i].name == '虚拟机管理员'){
              activedMenuStr=activedMenuStr+'/'+'D'+'A'
            }else if(roleArray[i].name == '应用服务管理员'){
              activedMenuStr=activedMenuStr+'/'+'E'+'A'
            }else if(roleArray[i].name == '超级管理员'){
              activedMenuStr='/A/B/C/D/E/F/G/H'
            }
          }
          if(activedMenuStr !=null){
            let userStr = activedMenuStr;
            if(userStr.indexOf("A")!=-1){
              this.activedMenuA = true
            }
            if(userStr.indexOf("B")!=-1){
              this.activedMenuB = true
            }
            if(userStr.indexOf("C")!=-1){
              this.activedMenuC = true
            }
            if(userStr.indexOf("D")!=-1){
              this.activedMenuD = true
            }
            if(userStr.indexOf("E")!=-1){
              this.activedMenuE = true
            }
            if(userStr.indexOf("F")!=-1){
              this.activedMenuF = true
            }
            if(userStr.indexOf("G")!=-1){
              this.activedMenuG = true
            }
            if(userStr.indexOf("H")!=-1){
              this.activedMenuH = true
            }
          }
          // alert(this.defaultAc)
      },
      toOpen(index){
        // alert(index);
        this.$router.push(index)
      },
      isActived(str){
        this.defaultAc = '/'+str;
      },
    }
  }
</script>
<style lang="scss" scoped>
@import '@/assets/theme/variable.scss';
  .el-header {
    background-color: #333;
    color: white;
    line-height: 60px;
  }
  .el-aside {
    /* @include main-background-color; */
    @include content-background-color;
    color: #333;
    height: 100%;
  }
  .el-menu{
    height: 100%;
  }
  .middle{
    @include main-background-color;
  }
  /* .main-content {
    @include content-background-color;
  } */
  .main {
    @include content-background-color;
    min-height:100%;
    width:80%;
    margin-left:10%;
    padding-bottom: 5px;
  }
  .el-footer{
    background-color: #333;
  } 
  a {
    text-decoration: none;
  }
  .router-link-active {
    text-decoration: none;
  }
  .manualtab{
    /* background-color: #409EFF; */
    width: 10px;
    margin-top: 0;
    padding-top: 0;
  }
</style>
