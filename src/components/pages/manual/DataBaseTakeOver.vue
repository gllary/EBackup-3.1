<template>
        <div class="main">
            <div id="dataDaseTakeOver" class="anchor">
                <div class="top">
                    <h3>数据库一键接管</h3>
                </div>
                <div class="content">
                    <div>
                        <p>两台机器上的同名数据库实现实时同步，数据库的角色为一主一备</p>
                        <p>当主库出现故障时，可以将备库角色切换为主库，用原备库临时顶替原主库</p>
                        <h4>添加接管环境步骤如下</h4>
                        <p><li>在**系统管理_设备管理**内，添加需要进行灾备接管的生产服务器和备用服务器</li></p>
                        <p>参见步骤 <el-button type="text" @click="toguide('equipmentManage','equipmentManage')" >**系统管理_设备管理**</el-button></p>
                        <p><li>添加需要接管的生产数据库/实例</li></p>
                        <p>参见步骤 <el-button type="text" @click="toguide('addDataBase','addDataBase')" >**数据库数据保护_添加数据库**</el-button></p>
                        <p><li>在列表页，点击右上角一键接管按钮，进入一键接管配置页面，可查看所有一键接管设备信息</li></p>
                    </div>
    
                    <div>
                        <h4>初始化步骤如下</h4>
                        <p><li>在一键接管页面，点击添加</li></p>
                        <p><li>主设备为生产设备，备设备为易备设备</li></p>
                        <p><li>端口号为数据库默认端口号</li></p>
                        <p style="color: red">注：如果一台服务器上有多个库需要接管，输入用户名密码后，点击保持锁定</p>
                        <p style="color: red">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp如果多个库使用不同的用户名密码，则分开填写</p>
                        <p style="color: red">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp【oracle需配置临时监听；对于windows2008及以上版本中sqlserver数据库支持自定义选择备库存放路径】</p>
                        <p><li>配置好之后，点击确定</li></p>
                        <p>箭头为<span style="color: orange">橙色</span>：正在进行初始化</p>
                        <p>箭头为<span style="color: greenyellow">绿色</span>：正在进行初始化</p>
                        <p>其他情况为数据同步失败，点击查看详情可跳转至连接详情页，查看详细操作</p>
                    </div>
                    
                    <div id="changedb">
                        <p style="color: red">注：切换分为实例切换和IP切换。生产发生故障时，先进行实例切换，切换成功后再进行IP切换。</p>
                        <h4>单数据库切换</h4>
                        <p>生产环境故障时，将业务转移到易备环境</p>
                        <p><strong>步骤：</strong>点击【切换数据库】，输入用户密码，对当前实例进行切换</p>
                    </div>
                    <div id="qiebei">
                        <h4>多数据库切换</h4>
                        <p>生产环境故障时，将业务转移到易备环境</p>
                        <p><strong>步骤：</strong>点击【切备】，输入用户密码，即可以对服务器所有实例进行切换</p>
                    </div>
                    <div>
                        <h4>单数据库回切</h4>
                        <p>当生产故障恢复后，需要将业务重新转移到生产环境时，则进行回切</p>
                        <p>回切首先会将故障期间，备库的数据同步到主库</p>
                        <p><strong>步骤：</strong>点击【切换数据库】，输入用户密码</p>
                    </div>
                    <div id="qiezhu">
                        <h4>多数据库回切</h4>
                        <p>当生产故障恢复后，需要将业务重新转移到生产环境时，则进行回切</p>
                        <p>回切首先会将故障期间，备库的数据同步到主库</p>
                        <p><strong>步骤：</strong>点击【切主】，输入用户密码</p>
                    </div>
    
                    <div id="changeip">
                        <h4>IP切换</h4>
                        <p style="color: red">（在生产环境和易备环境设备均正常的情况下做的操作）</p>
                        <p><li>Windows系统：将生产环境设备的物理IP和易备环境设备的物理IP对调</li></p>
                        <p><li>Linux系统：将生产环境设备上的服务IP（对外提供主服务的IP）给down掉，然后添加到易备环境设备上</li></p>
                        <p style="color: red">注：此情况下生产环境和易备环境原来还存在的IP不会发生变化</p>
                        <p><strong>步骤：</strong>点击【切IP】，输入用户密码</p>
                        <p style="color:red">注：IP切换属于设备层面，不涉及数据库sql的执行</p>
        
                        <h4>IP回切</h4>
                        <p><li>Windows系统：将生产环境设备的物理IP和易备环境设备的物理IP对调</li></p>
                        <p><li>Linux系统：服务IP从易备设备回切到生产设备上</li></p>
                        <p><strong>步骤：</strong>点击【切IP】，输入用户密码</p>
                    </div>
                    <div>
                        <h4>解除连接</h4>
                        <p><li>输入用户操作密码，即可解除一键接管</li></p>
                    </div>
                    <div> 
                        <h4>批量切换</h4>
                        <p><li>初始化成功后，点击批量切换按钮，可批量添加操作计划，检验各个数据库的连接是否正常</li></p>
                        <p><li>成功添加计划后，立即跳转至灾备演练切换详情页，在该页面可查看操作详情</li></p>
                        <p><li>在一键接管页面可看到设备状态随之改变</li></p>
                    </div>
                    <div id="verification">
                        <h4 >验证结果（该功能目前支持Oracle及SQL Server数据库）</h4>
                        <p><li>点击列表右上角更多操作按钮，选择验证结果</li></p>
                        <p><li>弹出显示框，可查看该记录下的所有验证结果</li></p>
                    </div> 
                </div>  
            </div>
            <div id="virtualTakeOver" class="anchor">
                <div class="top">
                    <h3>虚拟机一键接管</h3>
                </div>
                <div class="content">
                    <p>虚拟机可以查看所有配置了一键接管的虚拟机，并进行切换操作</p>
                    <div>
                        <h4>接管初始化操作</h4>
                        <p>添加虚拟机一键接管有<span style="color: red">从虚拟机主机管理界面进入</span>和<span style="color: red">从VMware列表/华为虚拟机列表/Hyper-V列表进入</span>两种入口。</p>
                        <strong><i class="el-icon-caret-right"></i>从虚拟主机管理界面进入</strong>
                        <p><li>展开主机信息详情，选择要进行接管的虚拟机（多选/单选）</li></p>
                        <p><li>点击已选虚拟机进入已选列表</li></p>
                        <p><li>点击接管初始化，弹出同步初始化配置框</li></p>
                        <p style="color: red">*表示必填</p>
                        <p>同步主机：选择接管的同步虚拟机存放主机位置</p>
                        <p>同步磁盘：选择接管的同步虚拟机存储的磁盘位置</p>
                        <p>虚拟机IP：此IP为记录信息，不影响接管同步出来的虚拟机IP<span style="color: red">（同步虚拟机IP与源虚拟机IP一致）</span></p>
                        <p>同步策略：五种策略可选择</p>
                        
                        <strong><i class="el-icon-caret-right"></i>从VMware列表进入</strong>
                        <p>进入VMware列表，选择要进行接管的虚拟机（多选/单选），点击【查看已选虚拟机】查看已选列表</p>
                        <p><li>点击接管初始化，弹出同步初始化配置框</li></p>
                        <p style="color: red">*表示必填</p>
                        <p>同步主机：选择接管的同步虚拟机存放主机位置</p>
                        <p>同步磁盘：选择接管的同步虚拟机存储的磁盘位置</p>
                        <p>虚拟机IP：此IP为记录信息，不影响接管同步出来的虚拟机IP<span style="color: red">（同步虚拟机IP与源虚拟机IP一致）</span></p>
                        <p>同步策略：五种策略可选择</p>
                        <p><li>配置好之后，点击确定</li></p>
                        <p>跳转至VMware一键接管页面，源虚拟机会进行一次全备，并复制出一台同步虚拟机</p>
                    </div>
                    <div id="operation">
                        <h4>功能操作</h4>
                        <p><li>故障转移：当源虚拟机故障时，启用同步虚拟机，将业务转移到同步虚拟机</li></p>
                        <p><strong>步骤：</strong>点击【故障转移】，确认源虚拟机已关闭，选择已成功备份时间点，点击确认后启用同步虚拟机</p>
                        <p><li>故障恢复：当源虚拟机恢复后，将业务恢复到源虚拟机，并关闭同步虚拟机</li></p>
                        <p><strong>步骤：</strong>点击【故障恢复】，选择已成功备份时间点，点击确认后，将业务成功恢复到源虚拟机</p>
                        <p><li>修改策略：在接管过程中，可修改接管同步策略</li></p>
                        <p><strong>步骤：</strong>点击【修改策略】，选择要修改的策略，点击确定</p>
                    </div>
                </div> 
            </div>
            <div id="applicationTakeOver" class="anchor">
                <div class="top">
                    <h3>应用服务器一键接管</h3>
                    </div>
                <div class="content">
                    <h4>初始化步骤</h4>
                    <p><li>点击“一键接管”按钮，进入到 首页_应用服务器_一键接管 配置页面</li></p>
                    <p><li>点击添加，弹出接管初始化配置页面</li></p>
                    <p>选择主设备：为生产设备</p>
                    <p>选择备设备：为易备设备</p>
                    <p>应用服务器：为添加服务器</p>
                    <p>用户密码：当前使用用户的密码</p>
    
                    <p><li>配置好后，点击确定</li></p>
                    <p>箭头为<span style="color: orange">橙色</span>：正在初始化或同步异常</p>
                    <p>箭头为<span style="color: greenyellow">绿色</span>：同步正常，可接管</p>
                    <p>其他情况为数据同步失败</p>
                    <p>查看详情可跳转至连接详情页，查看连接详细信息，以及操作记录</p>
    
                    <h4>切换步骤</h4>
                    <p>切换分为【切IP】和【单切IP】功能</p>
                    <p><li>Windows系统：将生产环境设备的物理IP和易备环境设备的物理IP对调</li></p>
                    <p><li>Linux系统：将生产环境设备上的服务IP（对外提供主服务的IP）给down掉，然后添加到易备环境设备上</li></p>
                    <p style="color: red">注：此情况下生产环境和易备环境原来还存在的IP不会发生变化</p>
                    <strong><i class="el-icon-caret-right"></i>切IP</strong>
                    <p>切IP是在生产设备和易备设备均正常情况下，进行切换服务IP，将业务转移到易备环境上</p>
                    <p><li>点击【切IP】后，需要输入当前使用用户的密码来执行操作</li></p>
                    <p><li>点击“查看详情”可跳转至连接详情页查看操作详情</li></p>
    
                    <strong><i class="el-icon-caret-right"></i>单切IP</strong>
                    <p>当生产发生故障时，进行单切IP，将业务转移到易备环境上</p>
                    <p style="color: red">注：成功切换后，服务IP切换至易备设备上，连接状态显示异常</p>
                    <p style="color: red">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp生产设备恢复正常后，可再次进行切IP操作，恢复正常业务</p>
                </div>  
            </div>
            <div id="disasterDrills" class="anchor">
                <div class="top">
                    <h3>灾备演练</h3>
                </div>
                <div class="content">
                    <p>为方便切换实例和切IP的批量操作，同时也是为了检验各个数据库的连接是否正常，特做灾备演练的功能</p>
                    <h4>步骤</h4>
                    <p><li>点击右上角添加按钮添加灾备演练计划</li></p>
                    <p><li>输出计划名称及用户密码，点击确定，成功添加计划并立即执行</li></p>
                    <p><li>成功添加的灾备演练计划会出现在列表中，点击计划名称可跳转至详情页 ，查看详细操作</li></p>
                </div>  
            </div>
        </div>
    </template>
    <script>
      export default {
        data() {
            return {}
          },
          mounted(){
            this.fetchData();
            this.getlocal();
            this.destroyed()
          },
          watch:{
              '$route':'fetchData'
          },
          methods:{
            getlocal(){
                  let select = localStorage.getItem('id');
                  let elm = document.getElementById(select);
                //   console.log(select)
                  if(select){
                      elm.scrollIntoView(true);
                  }
              },
            toguide(toname,toId){
                // console.log('hh');
                this.$router.push({name: toname,query: { aId: toId }})
            },
            toBottom(){
                this.$emit('func','disasterDrills')
              },
              onScroll(currentScrollTop){
                //   console.log('child'+ currentScrollTop)
                const navContents = document.querySelectorAll('.anchor');
                // console.log(navContents)
                const offsetTopArr = [];
                const offsetHeightArr = [];
                navContents.forEach(item => {
                    offsetTopArr.push(item.offsetTop);
                    offsetHeightArr.push(item.offsetHeight);
                })
                // console.log('offsetTopArr'+offsetTopArr)
                let navIndex = 0;
                for(let n = 0; n < offsetTopArr.length; n++){
                    if((currentScrollTop > offsetTopArr[n]-offsetTopArr[0]) && (currentScrollTop < offsetTopArr[n]-offsetTopArr[0]+offsetHeightArr[n])){
                        navIndex = n;
                    }
                }
                // console.log(navIndex)
                if(navIndex == 0){
                    this.$emit('func','dataDaseTakeOver')
                }else if(navIndex == 1){
                    this.$emit('func','virtualTakeOver');
                }else if(navIndex == 2){
                    this.$emit('func','applicationTakeOver')
                }else if(navIndex == 3){
                    this.$emit('func','disasterDrills')
                }
              },
              fetchData(){
                //   alert(this.$route.query.aId);
                  let str = '#'+this.$route.query.aId;
                  if(str == '#dataDaseManual'){
                    document.querySelector('#dataDaseTakeOver').scrollIntoView({block:"start"});
                  }else{
                    document.querySelector(str).scrollIntoView({block:"start"});
                  }
              },
              destroyed(){
              localStorage.setItem('id','')
          }
          }
        }
    </script>
<style lang="scss" scoped>
        @import '@/style/manual.scss';
</style>
    