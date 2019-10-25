<template>
        <div class="main">
            <div id="inspectionTask" class="anchor">
                <div class="top">
                    <h3>巡检任务</h3>
                </div>
                <div class="content">
                    <h4>创建巡检任务</h4>
                    <p><li>点击右上角创建巡检任务按钮，即可进入巡检任务添加界面</li></p>
                    <p><li>如实填写相关栏目</li></p>
                    <p>任务名称：填写易于理解的任务名称</p>
                    <p>任务描述：可对任务进行简要描述</p>
                    <p>巡检周期：可选择立即开始/一月一次/一季度一次</p>
                    <p>巡检日期及巡检时间点：按要求选择即可</p>
                    <p>巡检数据库：选择需要巡检的数据库<span style="color: red">（前提是该数据库已经在数据库列表添加了）</span></p>
                    <p style="color: red">*号为必填项</p>
                    <p><li>点击立即创建，即可成功创建巡检任务</li></p>
                    <p><li>点击已创建任务名称，可进入任务详情进行查看</li></p>
                    <p><li>巡检完成后生成巡检报告，可进行下载、删除操作</li></p>

                    <h4>修改、删除巡检任务</h4>
                    <strong><i class="el-icon-caret-right"></i>巡检计划周期为月循环/季度循环时，该条任务可进行修改、删除操作</strong>
                    <p><li>点击列表右侧修改按钮，可进入详情页面进行修改</li></p>
                    <p><li>击列表右侧删除按钮，二次确认后删除该条任务</li></p>
                    <strong><i class="el-icon-caret-right"></i>立即巡检任务只能进行删除操作</strong>
                </div>  
            </div>
            <div id="model" class="anchor">
                <div class="top">
                    <h3>模板</h3>
                </div>
                <div class="content">
                    <h4>创建模板</h4>
                    <p><li>点击右上角创建模板按钮，进入创建页面</li></p>
                    <p><li>按需填写及选择相关栏目，点击立即创建即可成功创建</li></p>
    
                    <h4>查看模板详情</h4>
                    <p><li>点击列表右侧小箭头，即可展开显示模板详情</li></p>
                    <p><li>再次点击，即可收起</li></p>
    
                    <h4>查看模板详情</h4>
                    <p><li>点击列表右侧状态开关即可控制模板为禁用或启用，且每种类型只存在一个模板为激活状态</li></p>
                    
                    <h4>修改</h4>
                    <p><li>点击列表右侧修改图标，进入修改界面</li></p>
                    <p><li>按需修改相应栏目</li></p>
                    <p><li>点击保存，即可成功修改模板内容</li></p>
    
                    <h4>删除</h4>
                    <p>只有在模板状态为禁用时，才显示删除图标</p>
                    <p><li>若模板已经禁用，直接点击右侧删除图标，否则先禁用模板，再点击删除图标，弹出确认框</li></p>
                    <p><li>按需修改相应栏目</li></p>
                    <p><li>点击弹框中的确认按钮，即可成功删除模板</li></p>
                </div>  
            </div>
            <div id="parameter" class="anchor">
                <div class="top">
                    <h3>参数配置</h3>
                </div>
                <div class="content">
                    <p>进入参数配置页面，即可查看智能巡检的相关配置</p>
                    <h4>修改</h4>
                    <p><li>点击修改按钮，进入修改状态</li></p>
                    <p><li>按需修改相关栏目</li></p>
                    <p><li>点击保存，即可修改成功</li></p>
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
          },
        watch:{
            '$route':'fetchData',
        },
        methods:{
            toBottom(){
                this.$emit('func','parameter')
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
                    this.$emit('func','inspectionTask')
                }else if(navIndex == 1){
                    this.$emit('func','model')
                }else if(navIndex == 2){
                    this.$emit('func','parameter')
                }
              },
              fetchData(){
                  let str = '#'+this.$route.query.aId;
                  if(str == '#inspectionTaskManual'){
                    document.querySelector('#inspectionTask').scrollIntoView({block:"start"});
                  }else  if(str != null){
                    document.querySelector(str).scrollIntoView({block:"start"});
                  }
              },
        }
        }
    </script>
<style lang="scss" scoped>
    @import '@/style/manual.scss';
</style>
    