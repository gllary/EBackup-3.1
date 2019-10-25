<template>
        <div class="main fileMain">
            <div id="fileSystemDeletion" class="anchor">
                <div class="top">
                    <h3>文件系统增删改服务器</h3>
                </div>
                <div class="content">
                    <h4>添加</h4>
                    <p><li>在文件服务器列表页面，点击添加按钮</li></p>
                    <p><li>添加成功后，在列表中可以看到所添加的服务器</li></p>
                    <p>主机IP：为服务器物理IP</p>
                    <p>操作系统：Windows/Linux可选择</p>
                    <p>服务器登录名、登录密码据实填写</p>
    
                    <h4>修改</h4>
                    <p><li>点击记录后的修改按钮，可对别名、主机IP、操作系统、所属业务系统进行修改</li></p>
                    <p style="color: red;">注：主机名根据服务器自动识别</p>
    
                    <h4>删除</h4>
                    <p><li>点击记录后的删除按钮</li></p>
                    <p><li>弹出确认删除弹框，点击弹框内确定，即可成功删除</li></p>
                </div> 
            </div> 
            <div id="fileSystemBackup" class="anchor">
                <div class="top">
                    <h3>文件系统备份</h3>
                </div>
                <div class="content">
                    <p>是对服务器中的数据进行备份，作为恢复的数据来源</p>
                    <h4>操作步骤</h4>
                    <p><li>点击列表内的服务器名</li></p>
                    <p><li>进入服务器详情页，点击添加备份计划</li></p>
                    <p>备份计划名称：自定义填写</p>
                    <p>备份类型：三种类型，根据需求选择。文件备份可选择1-3个文件夹同时进行备份</p>
                    <p style="color: red">支持排除文件,（识别文件名+后缀名进行排除，如：test.xlsx、*.txt、*.png）、限速备份功能</p>
                    <p>备份策略：文件备份类型有同步/增量不删减，可选择；卷备份/系统备份只有同步策略</p>
                    <h4>时间策略</h4>
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
                    <p><li>备份成功后，进入备份记录查看，可展开查看详情</li></p>
                </div>
            </div>
            <div id="fileSystemRecover" class="anchor">
                <div class="top">
                    <h3>文件系统恢复</h3>
                </div>
                <div class="content">
                    <h4>实现及时恢复</h4>
                    <p><li>通过备份记录目录选择需要恢复的记录，点击查看详情</li></p>
                    <p><li>点击备份集后的恢复，弹出执行恢复操作弹框，进行填写</li></p>
                    <p>计划名：自定义填写</p>
                    <p>恢复主机：为添加的服务器，支持同机/异机恢复</p>
                    <p>恢复源路径：为备份成功文件，可从中选择要恢复的文件，支持1-3个文件夹同时进行恢复</p>
                    <p>存放路径：为服务器下路径，自定义选择</p>
                    <p>恢复排除文件：同备份排除文件规则</p>
                    <p>服务器登录名、密码据实填写</p>
                    <p><li>正确填写完成后，点击“确定”按钮，立即开始恢复</li></p>
                    <p><li>可在“操作计划_恢复计划”中查看执行计划状态，“恢复记录”中查看结果</li></p>
                </div>  
            </div>

            <div id="fileSystemTermination" class="anchor">
                <div class="top">
                    <h3>文件系统终止计划</h3>
                </div>
                <div class="content">
                    <h4>终止备份计划</h4>
                    <p><li>服务器下的备份恢复任务，正常进行中/异常卡死时，点击列表内的服务器名进入服务器详情页面</li></p>
                    <p><li>点击列表内的服务器名进入服务器详情页面</li></p>
                    <p><li>进行二次确认后，计划将被中断，中断后可进行删除计划操作</li></p>
                    <p style="color: red">注：循环备份计划，只能中断当次备份，下个循环时间点会再进行备份</p>
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
                options: '按分钟循环',
                optional: '选择备份时间间隔10分钟—60分钟',
            }, {
                options: '按小时循环',
                optional: '选择备份时间间隔1小时—24小时',
            },{
                options: '天',
                optional: '选择每天一个/多个时间点备份',
            },
            {
                options: '周',
                optional: '周一至周日选择一天/几天，一个/多个时间点备份',
            },{
                options: '月',
                optional: '选择具体一个日期/多个日期，一个/多个时间点备份',
            },{
                options: '立即',
                optional: '选择后点击确定立即开始备份',
            }],
            }
          },
          mounted(){
            this.fetchData();
          },
          watch:{
              '$route':'fetchData'
          },
          methods:{
              toBottom(){
                this.$emit('func','fileSystemTermination')
              },
              onScroll(currentScrollTop){
                //   console.log(currentScrollTop+'是从其他子页面跳转的');
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
                    this.$emit('func','fileSystemDeletion');
                }else if(navIndex == 1){
                    this.$emit('func','fileSystemBackup');
                }else if(navIndex == 2){
                    this.$emit('func','fileSystemRecover');
                }else if(navIndex == 3){
                    this.$emit('func','fileSystemTermination');
                }
              },
              fetchData(){
                  let str = '#'+this.$route.query.aId;
                  if(str == '#fileSystemManual'){
                    document.querySelector('#fileSystemDeletion').scrollIntoView({block:"start"});
                  }else if(str != null){
                    document.querySelector(str).scrollIntoView({block:"start"});
                  }
              },
          }
        }
    </script>
<style lang="scss" scoped>
    @import '@/style/manual.scss';
</style>
    