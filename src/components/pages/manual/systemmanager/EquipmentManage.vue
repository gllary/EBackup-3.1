<template>
        <div class="main">
            <div id="equipmentManage" class="anchor">
                <div class="top">
                    <h3>设备管理</h3>
                </div>
                <div class="content">
                    <p><li>设备管理可对备份、接管的数据库所在服务器、虚拟机管理服务器、应用服务器进行管理</li></p>
                    <p><li>可对设备进行添加、修改、删除操作，可跳转至监控页面</li></p>
                    <p><li>若已在监控端添加该数据库，则可以跳转至监控界面</li></p>
                    <p><li>若未在监控端添加此数据库，则无法跳转至监控界面，会有异常提示</li></p>
                    <p><li>监控配置及相关功能操作，参见监控系统V1.0-用户手册</li></p>
                    <p style="color: red">注：将服务器加入设备管理，是进行数据库备份、接管、虚拟机备份的前提</p>
                    <h4>步骤如下</h4>
                    <p><li>点击右上角添加按钮可用于添加设备</li></p>
                    <p>设备名：填写易于识别的名称，如“生产HIS服务器”</p>
                    <p>设备IP：为服务器物理IP</p>
                    <p>设备类型：生产服务器，则选择生产环境；信服易备内的服务器，则选择易备环境</p>
                    <p>存储方式：NFS存储、CLOUD存储</p>
                    <p>用途类型、操作系统、windows系统版本据实选择</p>
                    <p>临时IP：没有则为空。</p>
                    <p style="color: red">注：一键接管切换IP时，Windows系统需要通过临时IP中转才能交换IP，linux系统直接切换该IP</p>
                    <p>系统登录名：windows为administrator，linux为root</p>
                    <p><li>添加完成后页面展示已添加的设备，左上角可切换列表视图和卡片视图</li></p>
                </div>  
            </div>
            <div id="configurationManage" class="anchor">
                <div class="top">
                    <h3>配置管理</h3>
                </div>
                <div class="content">
                    <p>配置管理包含<strong>邮箱管理</strong>、<strong>邮箱设置</strong>、<strong>存储地址</strong>、<strong>云存储</strong>、<strong>存储策略</strong>、<strong>端口管理</strong><strong></strong></p>
                    <div id="emilmanage">
                        <h4>邮箱管理</h4>
                        <p>本模块用于添加邮箱，当备份失败或一键接管故障时，向用户发送邮件</p>
                        <p>可对邮箱进行添加、修改、删除操作</p>    
                    </div>
    
                    <div id="emilset">
                        <h4>邮箱设置</h4>
                        <p>本模块用于配置接收某一时段完整报告的邮箱信息</p>
                        <p style="color: red;">（包括正常情况和异常情况的所有结果统计信息）且只能配置一条信息记录</p>
                        <strong><i class="el-icon-caret-right"></i>添加</strong>
                        <p><li>点击列表右侧的添加按钮</li></p>
                        <p><li>按需修改相关信息，*号为必填项</li></p>
                        <p>邮箱服务器：填写邮箱服务器地址</p>
                        <p>协议：填写相关协议如SMTP</p>
                        <p>端口：端口号如25</p>
                        <p>发件人：填写发件人邮箱与使用的邮箱服务器类型一致</p>
                        <p>密码：填写发件人邮箱的密码（POP3/STMP/IMP服务授权码）</p>
                        <p>收件人：收件人邮箱，可添加多个收件人</p>
                        <p>抄送：抄送人邮箱，可添加多个抄送人</p>
                        <strong>时间策略</strong>
                        <div style="margin-top: 15px;margin-bottom: 15px">
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
                        <strong><i class="el-icon-caret-right"></i>修改、删除</strong>
                        <p><li>点击列表右侧修改按钮，进入修改邮箱配置页进行修改</li></p>
                        <p><li>点击列表右侧删除按钮，二次确认后即可删除该邮箱</li></p>
                    </div>
    
                    <div id="StoreAddress">
                        <h4>存储地址</h4>
                        <p>对存储地址进行管理，可进行添加、修改、删除、启用/禁用操作</p>
                        <p style="color: red">注：开始备份后，请尽量避免修改存储路径，以免影响恢复</p>    
                    </div>
    
                    <div id="CloudStorage">
                        <h4>云存储</h4>
                        <p>设置云存储地址，可进行添加、修改、删除操作</p>
                        <p style="color: red">注：开始备份后，请尽量避免修改存储路径，以免影响恢复</p>    
                    </div>
    
                    <div>
                        <h4>存储策略</h4>
                        <p>用于对保留的备份集进行管理，可自定义全备备份保留个数，可进行添加、修改、删除操作</p>    
                    </div>
                    
                    <div id="port">
                        <h4>端口管理</h4>
                        <p>默认使用类型端口号，可进行修改</p>
                    </div>                      
                </div>  
            </div>
            <div id="roleManage" class="anchor">
                <div class="top">
                    <h3>权限管理</h3>
                </div>
                <div class="content">
                    <p>对用户添加、删除，修改用户权限、修改用户状态等</p>
                    <h4>相关操作</h4>
                    <p><li>进入方式：系统管理→权限管理→用户管理</li></p>
                    <p><li>添加用户：点击添加用户，输入账户、密码，如果权限为空，则默认只能查看主页内容</li></p>
                    <p><li>邮箱：添加正确邮箱，可勾选接收使用，不勾选为不启用，需在邮箱管理里进行配置</li></p>
                    <p><li>修改用户：点击“编辑”，可以修改姓名和权限</li></p>
                    <p><li>删除用户：点击“删除”，可进行删除</li></p>
                    <p><li>置密码：点击“编辑”，点击“重置密码”，重置密码默认为Xfback@201806！</li></p>
                    <p><li>用户禁用：点击“编辑”，选择“禁用”</li></p>
                    <p style="color: red">*号为必填项。权限默认为空，即拥有最低权限，只能查看主页。所选择的角色可查看主页及该角色板块，用户角色可多选</p>
                </div>  
            </div>
        </div>
    </template>
    <script>
      export default {
        data() {
            return {
                tableData: [ {
                    options: '每天',
                    optional: '可选择一个发送发送时间，发送从前一天该时间点到今天该时间点，这段时间内的执行结果统计报告',
                },{
                    options: '每周',
                    optional: '可选择一个星期和一个发送时间，发送从前一个星期当日当时到本星期此日此时，这段时间内的执行结果统计报告',
                },{
                    options: '每月',
                    optional: '可选择一个日期和一个发送时间，发送从上个月当日当时到本月此日此时，这段时间内的执行结果统计报告',
                }]
            }
          },
        watch:{
            '$route':'fetchData',
        },
        updated(){
            //创建时执行跳转锚点位置
            this.$nextTick(() => {this.getlocal()})
        },
          mounted(){
            this.fetchData();
          },
          methods:{
             //从本地找到id
              getlocal(){
                  let select = localStorage.getItem('id');
                  let elm = document.getElementById(select);
                  if(select){
                      elm.scrollIntoView(true);
                  }
              },
              toBottom(){
                this.$emit('func','roleManage')
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
                    this.$emit('func','equipmentManage')
                }else if(navIndex == 1){
                    this.$emit('func','configurationManage')
                }else if(navIndex == 2){
                    this.$emit('func','roleManage')
                }
              },
              fetchData(){
                  let str = '#'+this.$route.query.aId;
                  if(str == '#equipmentManageManual'){
                    document.querySelector('#equipmentManage').scrollIntoView({behavior:"smooth"});
                  }else if(str != null){
                    document.querySelector(str).scrollIntoView({behavior:"smooth"});
                  }
              },
          },
          //离开页面进行对localStorage中id的销毁，避免其他入口进来的锚点有问题
          destroyed(){
              localStorage.setItem('id','')
          }
        }
    </script>
<style lang="scss" scoped>
    @import '@/style/manual.scss';
</style>