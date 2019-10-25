<template>
    <div class="main">
        <div id="addDataBase" class="anchor">
            <div class="top">
                <h3>添加数据库</h3>
            </div>
            <div class="content">
                <h4>前提条件</h4>
                <p> <li>首先在“系统管理_设备管理”里面，添加<span style="color: red;">数据库生产/易备服务器</span>，详见<el-button type="text" @click="toguide('equipmentManage','equipmentManage')" >**系统管理_设备管理**</el-button></li></p>
                <p><li>再点击“数据库”，选择数据库类型</li></p>
                <p><li>可点击添加/批量添加按钮<strong>（目前只有SQL Server和InSql具有批量添加功能）</strong></li></p>
                <p style="color:rgba(255, 0, 0, 0.882)">*部分为必填项</p>
                <h4>本页面操作步骤</h4>
                <strong><i class="el-icon-caret-right"></i>单个添加</strong>
                <p>点击【添加】按钮后，弹出显示框，进行填写</p>
                <p>名称：自定义填写，不能包含空格</p>
                <p>所属设备：先在“系统管理_设备管理”内添加数据库所属生产服务器，添加后可进行选择</p>
                <p>数据库名、端口号、数据库登录名、数据库密码据实填写。</p>
    
                <strong><i class="el-icon-caret-right"></i>批量添加（目前只有SQL Server和InSql具有批量添加功能</strong>
                <p>点击【批量添加】按钮后，弹出显示框，进行填写</p>
                <p>所属设备：选择一个设备</p>
                <p>端口号、数据库登录名、数据库密码据实填写</p>
                <p>信息填写完成后点击【扫描数据库】，显示该设备下所有数据库，可全选/单选进行快速添加</p>
            </div>
        </div>
        <div id="modifyDataBase" class="anchor">
            <div class="top">
                <h3>删改数据库</h3>
            </div>
            <div class="content">
                <h4>修改</h4>
                <p><li>点击数据库列表右侧的修改图标</li></p>
                <p><li>可修改名称、数据库名、端口号、数据库登录名、数据库密码和所属业务系统</li></p>
    
                <h4>删除</h4>
                <p><li>点击数据库列表右侧的删除图标</li></p>
                <p><li>弹出确认删除弹框，点击弹框内“确定”，即可完成删除</li></p>
            </div>
        </div>
        <div id="dataBaseBackup" class="anchor">
            <div class="top">
                <h3>数据库备份</h3>
            </div>
            <div class="content">
                <h4>操作步骤</h4>
                <p><li>点击列表内的数据库名称</li></p>
                <p><li>进入数据库详情页，点击“添加计划”，可选择“备份计划”或“恢复计划”，选择备份计划</li></p>
                <p>备份计划名称：自定义填写</p>
                <p>备份策略：所有数据库均提供“全备+增备”策略</p>
                <p style="color: red;">数据库Windows_11g版本还提供CDB持续备份策略可选，SQL Server/insql还提供“全备+日志备份”策略可选</p>
                <h4>时间策略</h4>
                <strong><i class="el-icon-caret-right"></i>选择全备+增备时</strong>
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
                <strong><i class="el-icon-caret-right"></i>选择全备+日志备份时</strong>
                <P>时间策略为按分钟循环，可选择10分钟—60分钟</P>
    
                <strong><i class="el-icon-caret-right"></i>选择CDB持续备份时</strong>
                <P>时间策略可选按天、周、月循环。备份粒度可选5-60分钟</P>
            </div>
        </div>
        <div id="dataBaseRecover" class="anchor">
            <div class="top">
                <h3>数据库恢复</h3>
            </div>
            <div class="content">
                <p>恢复方式分两种，实时恢复和计划恢复。两种恢复方式都属于异机恢复。 <strong>可本机恢复到表级。</strong></p>
                <h4>实时恢复</h4>
                <p><li>通过“备份集”目录进入，根据备份集时间，点击备份集右侧“恢复”</li></p>
                <p><li>弹出实时恢复执行框，填写正确，点击确定后立即开始恢复</li></p>
                <p style="color: red;">恢复设备：先在“系统管理_设备管理”内添加数据库所属易备服务器，添加后可进行选择</p>
                <p><li>在“操作计划_恢复计划”内可查看所有恢复计划信息</li></p>
                <h4>计划恢复</h4>
                <strong>恢复演练默认使用最新的备份集恢复</strong>
                <p>点击“添加计划”，选择恢复计划</p>
                <p>计划名称：自定义填写</p>
                <p>恢复设备：先在“系统管理_设备管理”内添加数据库所属易备服务器，添加后可进行选择</p>
                <p>数据库名、端口号默认为备份数据库名和端口号</p>
                <p>时间策略如下：</p>
                <div style="margin-top: 15px;">
                    <el-table
                    :data="tableData1"
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

                <h4>验证结果</h4>
                <strong>（此功能目前支持Oracle和SQL Server）</strong>
                <p><li>点击列表中数据库名称，进入详情页</li></p>
                <p><li>点击恢复记录，可以看到相关恢复记录</li></p>
                <p><li>点击已完成恢复记录右侧的验证结果按钮，弹出显示框</li></p>
                <p><li>显示框中可以展示所有恢复记录的验证结果</li></p>
            </div>  
        </div>
        <div id="takeOverDataBase" class="anchor">
            <div class="top">
                <h3>数据库一键接管</h3>
            </div>
            <div class="content">
                <p> 目前Oracle、SQL Server、MySql、InSql均有一键接管功能</p>
                <strong>SQL Server及InSql具体参见<el-button type="text" @click="toguide('dataDaseTakeOver','dataDaseTakeOver')" >**一键接管_数据库**</el-button></strong>
                <p><strong>由于Oracle数据库及Mysql数据库相关功能复杂，在此单独解释</strong></p>
                <h4>单实例切换</h4>
                <p style="color: red">要求：生产库正常，易备库正常，连接正常</p>
                <p>在主备库均正常，同步状态也正常的情况下，将生产环境当前数据库角色与易备环境数据库角色对调</p>
                <p><strong>步骤：</strong>点击【切换实例】，输入用户密码，对当前实例进行切换</p>
                
                <h4>多实例切换</h4>
                <p style="color: red">要求：生产库角色是主，状态正常；易备库角色是备，状态正常；连接正常</p>
                <p>在主备库均正常，同步状态也正常的情况下，将生产环境所有数据库角色与易备环境数据库角色对调</p>
                <p><strong>步骤：</strong>点击【切备】，输入用户密码，即可以对服务器所有实例进行切换</p>

                <h4>单实例回切</h4>
                <p>需要将业务重新转移到生产环境时，则进行回切。</p>
                <p><strong>步骤：</strong>点击【切换操作_切换实例】，输入用户密码</p>
                
                <h4>多实例回切</h4>
                <p style="color: red">要求：生产库角色是备，状态正常；易备库角色是主，状态正常；连接正常</p>
                <p>需要将业务重新转移到生产环境时，则进行回切。</p>
                <p><strong>步骤：</strong>点击【切主】，输入用户密码</p>

                <h4>IP切换（在生产环境和易备环境设备均正常的情况下做的操作）</h4>
                <p style="color: red">要求：生产设备、易备设备IP不同</p>
                <p><i class="el-icon-caret-right"></i>Windows系统，将生产环境设备的物理IP和易备环境设备的物理IP对调</p>
                <p><i class="el-icon-caret-right"></i>Linux系统，将生产环境设备上的服务IP（对外提供主服务的IP）down掉，然后添加到易备环境设备上</p>
                <p style="color:red">注：生产环境和易备环境原来还存在的IP不会发生变化</p>
                <p><strong>步骤：</strong>点击【切IP】，输入用户密码</p>
                <P style="color:red">注：IP切换属于设备层面，不涉及数据库sql的执行</P>

                <h4>IP回切</h4>
                <p>需要将业务重新转移到生产环境时，则进行回切。</p>
                <p><strong>步骤：</strong>点击切IP，输入用户名密码，服务IP从易备设备回切到生产设备上</p>

                <h4>单切实例</h4>
                <p style="color: red">要求：产库角色是主，状态异常；易备库角色是备，状态正常；连接状态异常；故障转移关闭状态</p>
                <p>生产环境故障，连接异常时，将业务转移到易备环境。</p>
                <p><strong>步骤：</strong>点击【单切实例】，输入用户密码</p>

                <h4>单切IP（在生产环境设备关机，易备环境设备正常的情况下的操作）</h4>
                <p><i class="el-icon-caret-right"></i>对于Windows系统来说，就是将生产环境的物理IP切换到易备环境设备上</p>
                <p><i class="el-icon-caret-right"></i>对于Linux系统来说，就是将生产环境设备上的服务IP替换到易备环境的设备上</p>
                <p><strong>步骤：</strong>点击【单切IP】，输入用户密码</p>

                <h4>单切恢复</h4>
                <p style="color: red">要求：生产库角色是备，状态异常；易备库角色是主，状态正常；连接状态异常；故障转移关闭状态</p>
                <p><i class="el-icon-caret-right"></i>当生产故障恢复后，需要将业务重新转移到生产环境时</p>
                <p><i class="el-icon-caret-right"></i>进行单切恢复，会将故障期间，备库的数据同步到主库。</p>
                <p><strong>步骤：</strong>点击【单切恢复】，输入用户密码</p>

                <h4>开启故障转移</h4>
                <p>开启故障转移后，当生产环境故障时，可自动将业务转移到易备环境上</p>

                <h4>回切初始化</h4>
                <p style="color: red">要求：易备库角色是主，状态正常；连接状态异常；故障转移关闭状态</p>
                <p>生产环境故障，单切恢复不可恢复时，可恢复重建生产实例</p>

                <h4>解除连接</h4>
                <p>输入用户操作密码，即可解除一键接管</p>
            </div>
        </div>
        <div id="dataBaseMonitor" class="anchor">
            <div class="top">
                <h3>数据库监控</h3>
            </div>
            <div class="content">
                <h4>数据库监控相关</h4>
                <p><li>若已在监控端添加该数据库，则可以跳转至监控该数据库详情界面</li></p>
                <p><li>若未在监控端添加此数据库，则无法跳转至监控界面，会有异常提示</li></p>
                <p><li>点击数据库列表右侧的监控图标，即可跳转至监控该数据库的详情页</li></p>
                <p style="color:rgba(255, 0, 0, 0.882)">注：目前Oracle、SQL Server数据库支持该功能</p>
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
        }],
        tableData1: [{
                options: '类型',
                optional: '恢复时间选择',
            },{
                options: '单次',
                optional: '单次',
            },{
                options: '周',
                optional: '周一至周日选择一天/几天，一个/多个时间点恢复',
            }, {
                options: '月',
                optional: '选择具体一个日期/多个日期，一个/多个时间点恢复',
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
                // console.log('hh');
                this.$router.push({name: toname,query: { aId: toId }})
        },
        fetchData(){
           // alert(index);
            let str = '#'+this.$route.query.aId;
            if(str == '#addDataBaseManual'){
                document.querySelector('#addDataBase').scrollIntoView({behavior:"smooth"});
            }else{
                document.querySelector(str).scrollIntoView({behavior:'smooth'});
            }
        },
        toBottom(){
                this.$emit('func','dataBaseMonitor')
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
                    this.$emit('func','addDataBase')
                }else if(navIndex == 1){
                    this.$emit('func','modifyDataBase')
                }else if(navIndex == 2){
                    this.$emit('func','dataBaseBackup')
                }else if(navIndex == 3){
                    this.$emit('func','dataBaseRecover')
                }else if(navIndex == 4){
                    this.$emit('func','takeOverDataBase')
                }else if(navIndex == 5){
                    this.$emit('func','dataBaseMonitor')
                }
              },
    }
    }
</script>
<style lang="scss" scoped>
        @import '@/style/manual.scss';
</style>