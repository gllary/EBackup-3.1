<template>
    <div class="main">
        <div id="deploymentManage" class="anchor">
            <div class="top">
                <h3>部署管理</h3>
            </div>
            <div class="content">
                <h4>部署</h4>
                <p><li>点击右侧部署按钮，进行部署设置，支持批量部署</li></p>
                <p><li>填写弹出的显示框</li></p>
                <p>代理IP：代理IP</p>
                <p>部署版本：选择版本库</p>
                <p>部署包：选择版本库内部署包</p>
                <p>操作系统：选择对于操作系统</p>
                <p>部署方式：手动/自动<span style="color: red;">（Windows下仅支持手动部署，成功部署后可进行管理）</span></p>
                <p>安装路径：自定义填写</p>
                <p>系统用户名：系统的用户名</p>
                <p>密码：系统对应的密码</p>
                <p><li>点击确定进行部署</li></p>
                
                <h4>管理</h4>
                <p>支持刷新、启动、暂停、修改、删除操作</p>
    
                <strong><i class="el-icon-caret-right"></i>刷新</strong>
                <p>点击列表右侧刷新图标，即可更新部署状态</p>
    
                <strong><i class="el-icon-caret-right"></i>启动</strong>
                <p><li>点击列表右侧启动图标，弹出提示框</li></p>
                <p><li>选择确定，即可启动该部署包</li></p>
    
                <strong><i class="el-icon-caret-right"></i>暂停</strong>
                <p><li>点击列表右侧暂停图标，弹出提示框</li></p>
                <p><li>选择确定，即可停止该部署包</li></p>
    
                <strong><i class="el-icon-caret-right"></i>修改</strong>
                <p><li>点击列表右侧修改图标，弹出修改框</li></p>
                <p><li>对相关部署信息按需修改，然后点击确定，即可修改部署信息</li></p>
    
                <strong><i class="el-icon-caret-right"></i>删除</strong>
                <p><li>点击列表右侧删除图标，弹出提示框</li></p>
                <p><li>点击确定，即可卸载该部署包</li></p> 
            </div>  
        </div>
        <div id="repository" class="anchor">
            <div class="top">
                <h3>版本库</h3>
            </div>
            <div class="content">
                <h4>添加版本库</h4>
                <p><li>点击页面右上角添加按钮，弹出显示框</li></p>
                <p><li>填写显示框相关内容</li></p>
                <p>版本号：自定义填写，不能包含空格</p>
                <p>版本路径：默认c:\packages\</p>
                <p>版本信息：版本的详细信息，自定义填写</p>
                <p><li>填好无误后点击确定，即可成功添加版本库</li></p>
                
                <h4> 扫描版本库</h4>
                <p>点击右侧扫描按钮，即可扫描默认版本存放路径下的版本信息及代理包</p>

                <h4>删除版本</h4>
                <p><li>点击版本标签栏右侧删除按钮，弹出提示框</li></p>
                <p><li>在提示框中输入用户密码后点击确定即可删除</li></p>
                <p style="color:red">注：该操作同步删除存储路径下所有文件</p>

                <h4>上传</h4>
                <p><li>点击列表右侧上传按钮，弹出显示框</li></p>
                <p><li>填写显示框相关内容</li></p>
                <p>操作系统：选择Windows/Linux/AIX中一项</p>
                <p>设备类型：选择设备类型</p>
                <p>代理包名：代理包名与上传的代理包名称一致，自动填写</p>
                <p>代理包信息：自定义填写</p>
                <p><li>点击确定，即可上传代理包</li></p>
                <p style="color:red">注：代理包命名规范要求如下</p>
                <img src="../../../../../static/name.png">
                <h4>修改</h4>
                <p><li>点击列右侧修改按钮，弹出修改框</li></p>
                <p><li>对相关信息按需修改</li></p>
                <p><li>点击确定，即可成功修改</li></p>

                <h4>删除代理包</h4>
                <p><li>点击代理包记录后的删除按钮，弹出提示框</li></p>
                <p><li>输入用户密码后即可删除该条代理包信息，同时删除存储路径下对应信息</li></p>

                <h4>下载代理包</h4>
                <p><li>点击代理包记录后的下载按钮，即可下载该部署代理包</li></p>
            </div>  
        </div>
    </div>
</template>
    <script>
      export default {
        data() {
            return {}
          },
            watch:{
                '$route':'fetchData',
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
                this.$emit('func','repository')
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
                    this.$emit('func','deploymentManage')
                }else if(navIndex == 1){
                    this.$emit('func','repository')
                }
              },
              fetchData(){
                  let str = '#'+this.$route.query.aId;
                //   console.log(str)
                if(str == '#deploymentManageManual'){
                    document.querySelector('#deploymentManage').scrollIntoView({behavior:"smooth"});
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
    