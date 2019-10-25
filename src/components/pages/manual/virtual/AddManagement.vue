<template>
        <div class="main">
            <div id="addManagement" class="anchor">
                <div class="top">
                    <h3>添加虚拟机管理设备</h3>
                </div>
                <div class="content">
                    <p>参见<el-button type="text" @click="toguide('equipmentManage','equipmentManage')" >**系统管理_设备管理**</el-button>选择使用类别为<span style="color: red;">虚拟机</span>，然后据实填写相关信息</p>
                </div> 
            </div>
            <div id="virtualMonitor" class="anchor">
                <div class="top">
                    <h3>虚拟机主机管理</h3>
                </div>
                <div class="content">
                    <h4>添加主机</h4>
                    <p><li>点击添加主机，弹出添加弹框</li></p>
                    <p>主机名：自定义填写</p>
                    <p>选择设备：先在“系统管理_设备管理”内添加管理虚拟机主机设备所属生产服务器，添加后可进行选择</p>
                    <p>主机IP：据实填写需要管理的虚拟机主机ip</p>
                    <p>登录账号、密码：据实填写</p>
                    <p>主机类型：据实选择</p>
                    <p><li>点击确定即可添加主机，成功添加主机后，可进行扫描，删除等操作</li></p>
                </div>  
            </div>
            <div id="virtualBackUp" class="anchor">
                <div class="top">
                    <h3>虚拟机备份</h3>
                </div>
                <div class="content">
                    <p>可制定多虚拟机同时备份计划和单虚拟机备份计划</p>
                    <h4>多虚拟备份计划</h4>
                    <p>添加虚拟机备份计划有<span style="color: red">从虚拟机主机管理界面进入</span>和<span style="color: red">从VMware列表/华为虚拟机列表/Hyper-V列表进入</span>两种入口。</p>
                    <strong><i class="el-icon-caret-right"></i>从虚拟主机管理页面进入</strong>
                    <p><li>展开主机信息详情，选择相应的虚拟机（多选/单选）。点击已选虚拟机进入已选列表</li></p>
                    <p><li>点击添加备份计划，弹出添加备份计划框</li></p>
                    <p style="color: red;">单个虚拟机备份时可直接点击虚拟机名称进入虚拟机详情页，添加备份计划</p>
                    <p><strong><i class="el-icon-caret-right"></i>从VMware列表/华为虚拟机列表/Hyper-V列表进入</strong></p>
                    <p><li>进入VMware列表，选择相关虚拟机（多选/单选），点击【查看已选虚拟机】查看已选列表</li></p>
                    <p><li>点击【添加备份计划】弹出添加备份计划框</li></p>
                    <p style="color: red;">单个虚拟机备份时可直接点击虚拟机名称进入虚拟机详情页，添加备份计划</p>
                    <strong>添加备份计划详情如下</strong>
                    <p>备份计划名称：自定义填写</p>
                    <p>备份策略：全备+增备</p>
                    <strong>时间策略</strong>
                    <div style="margin-top: 15px;">
                        <el-table
                        :data="tableData"
                        border
                        >
                        <el-table-column
                        prop="options"
                        label="选项"
                        width="180px"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="optional"
                        label="可选内容"
                        >
                        </el-table-column>
                        </el-table>
                    </div>
                    <p>执行时间：自定义计划开始时间</p>
        
                    <h4>单虚拟机备份计划</h4>
                    <p><li>在虚拟机主机管理/XX列表点击需要进行备份的虚拟机名称，进入虚拟机详情页</li></p>
                    <p><li>点击添加备份计划</li></p>
                    <p><li>点击备份计划可查看该虚拟机相关备份计划列表</li></p>
                    <p><li>备份成功后，有备份开始和结束时间，备份状态正常，可展开查看详情</li></p>
        
                    <h4>批量管理备份计划</h4>
                    <p><li>点击一键停止可停止所有备份计划</li></p>
                    <p><li>点击右侧小箭头可展开查看备份主机状态详情</li></p>
                    <p><li>点击右侧眼睛状查看图标可查看备份计划详细信息</li></p>
                    <p><li>点击删除按钮，可选择是否同时删除该备份计划下所有备份记录信息，点击确定进行删除</li></p>
                    <p style="color: red">注：若勾选“同时删除备份计划下的所有备份记录”则该备份计划会在列表中删除</p>
                    <p style="color: red">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp其所生成的备份集记录也会被删除</p>
                </div>
            </div>
            <div id="virtualRecover" class="anchor">
                <div class="top">
                    <h3>虚拟机恢复</h3>
                </div>
                <div class="content">
                    <p>恢复方式分两种，实时恢复和计划恢复</p>
                    <p style="color: red">注：VMware可以本机恢复，也可异机恢复；华为虚拟机均为同机恢复；Hyper-V均为异机恢复</p>
                    <h4>实时恢复</h4>
                    <p><li>进入虚拟机详情，点击下方备份目录集，选择需要使用的备份集，点击其右侧的恢复</li></p>
                    <p><li>填写弹出的实时恢复执行框，点击确定即可开始恢复</li></p>
                    <p>恢复主机：先在“虚拟机主机管理内”内添加主机，添加后可进行选择</p>
                    <p style="color: red">注：需选择与本虚拟机相同类型的主机ip;可以同主机恢复</p>
                    <p>新虚拟机名：自定义<span style="color: red">（注意：同名覆盖恢复）</span></p>
                    <p>在“操作计划_恢复计划”内可查看所有恢复计划信息</p>
    
                    <h4>计划恢复</h4>
                    <p><li>点击“添加计划”，选择恢复计划</li></p>
                    <p>计划名称：自定义填写</p>
                    <p>恢复设备：先在“虚拟机主机管理内”内添加主机，添加后可进行选择</p>
                    <p style="color: red">注：需选择与本虚拟机相同类型的主机ip;可以同主机恢复</p>
                    <p>新虚拟机名：自定义<span style="color: red">（注意：同名覆盖恢复）</span></p>
                    <p>恢复磁盘：根据需求进行选择</p>
                    <p>时间策略：单次执行 </p>
                    <p>恢复时间：自定义计划开始时间</p>
                    <p><li>点击确定，则恢复按照计划执行</li></p>
                </div> 
            </div>
            <div id="takeOverVirtual" class="anchor">
                <div class="top">
                    <h3>虚拟机一键接管</h3>
                </div>
                <div class="content">
                    <p>虚拟机一键接管，在主设备发生故障时，通过一键接管，将业务转移到备设备</p>
                    <p>目前支持VMware及Hyper-v虚拟机一键接管功能</p>
                    <h4>功能介绍</h4>
                    <p>参见<el-button type="text" @click="toguide('virtualTakeOver','virtualTakeOver')" >**一键接管_虚拟机**</el-button></p>
                </div> 
            </div>
            <div id="virtualStart">
                <div class="top">
                    <h3>虚拟机启动</h3>
                </div>
                <div class="content">
                    <p><li>在断电或其他情况下导致物理主机宕机，待物理主机恢复后</li></p>
                    <p><li>相关虚拟机可以在本系统中手动开启或通过自启动设置使其自启动</li></p>
                    <h4>手动开启</h4>
                    <p><li>进入XX虚拟机列表，点击右侧启动/关闭图标，弹出提示框</li></p>
                    <p><li>点击确定，即可启动/关闭相关虚拟机</li></p>
    
                    <h4>自启动（当物理机启动后，相关虚拟机在设定条件下自启动）</h4>
                    <p><li>进入XX虚拟机列表，点击右侧上方启动按钮，弹出显示框</li></p>
                    <p><li>在左侧勾选相关需要设置为自启动的虚拟机</li></p>
                    <p><li>点击蓝色指向右侧的圆形箭头图标，可见选中的虚拟机显示到右侧的列表中</li></p>
                    <p><li>设置相关细节，如自启动时间<span style="color: red">（在物理主机启动多久后虚拟机开始自启动）</span></li></p>
                    <p><li>点击确定按钮，完成自启动设置</li></p>
                </div> 
            </div>         
        </div>
    </template>
    <script>
      export default {
        data() {
            return {
                tableData: [{
            options: '类型',
            optional: '备份时间选择',
        },{
            options: '单次备份',
            optional: '单次',
        },{
            options: '小时',
            optional: '选择备份时间间隔1小时——24小时',
        }, {
            options: '天',
            optional: '选择每天一个/多个时间点备份',
        },{
            options: '周',
            optional: '周一至周日选择一天/几天，一个/多个时间点备份',
        },{
            options: '月',
            optional: '选择具体一个日期/多个日期，一个/多个时间点备份',
        }]
            }
          },
          mounted(){
            this.fetchData();
          },
        watch:{
            '$route':'fetchData',
        },
          methods:{
            toguide(toname,toId){
                this.$router.push({name: toname,query: { aId: toId }})
            },
            fetchData(){
           // alert(index);
            let str = '#'+this.$route.query.aId;
            if(str == '#addManagementManual'){
                document.querySelector('#addManagement').scrollIntoView({behavior:"smooth"});
            }else {
                document.querySelector(str).scrollIntoView({behavior:'smooth'});
            }
            },
            toBottom(){
                this.$emit('func','virtualStart')
              },
              onScroll(currentScrollTop){
                const navContents = document.querySelectorAll('.anchor');
                // console.log(navContents)
                const offsetTopArr = [];
                const offsetHeightArr = [];
                navContents.forEach(item => {
                    offsetTopArr.push(item.offsetTop);
                    offsetHeightArr.push(item.offsetHeight);
                })
                // console.log(offsetHeightArr)
                let navIndex = 0;
                for(let n = 0; n < offsetTopArr.length; n++){
                    // 此处是为了减去第一个块的offsetTop偏移量
                    // 若当前页面的scrollTop大于第n个页面对应的scrollTop时，内容应该在第n个锚点块内了
                    if((currentScrollTop > offsetTopArr[n]-offsetTopArr[0]) && (currentScrollTop < offsetTopArr[n]-62+offsetHeightArr[n])){
                        navIndex = n;
                    }
                }
                if(navIndex == 0){
                    this.$emit('func','addManagement')
                }else if(navIndex == 1){
                    this.$emit('func','virtualMonitor')
                }else if(navIndex == 2){
                    this.$emit('func','virtualBackUp')
                }else if(navIndex == 3){
                    this.$emit('func','virtualRecover')
                }else if(navIndex == 4){
                    this.$emit('func','takeOverVirtual')
                }else if(navIndex == 5){
                    this.$emit('func','virtualStart')
                }
              },
          }
        }
    </script>
<style lang="scss" scoped>
    @import '@/style/manual.scss';
</style>
    