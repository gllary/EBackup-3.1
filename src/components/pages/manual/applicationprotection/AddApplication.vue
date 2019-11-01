<template>
    <div class="main">
        <div id="addApplication" class="anchor">
            <div class="top">
                <h3>添加应用服务器</h3>
            </div>
            <div class="content">
                <h4>步骤如下</h4>
                <p><li>点击“应用服务器”，进入应用服务器列表页，点击“添加”按钮</li></p>
                <p><li>据实填写弹出框内容</li></p>
                <p>名称：自定义填写，<span style="color: red">不能包含空格</span></p>
                <p>所属设备：先在“系统管理_设备管理”内添加数据库所属生产服务器，添加后可进行选择</p>
            </div>  
        </div>
        <div id="applicationDeletion" class="anchor">
            <div class="top">
                <h3>删改应用服务器</h3>
            </div>
            <div class="content">
                <h4>修改</h4>
                <p><li>点击列表右侧修改图标</li></p>
                <p><li>对应用服务器的名称进行修改</li></p>
                <h4>删除</h4>
                <p><li>点击列表右侧删除图标</li></p>
                <p><li>弹出确认删除弹框，点击确定，即可完成删除操作</li></p>
            </div>
        </div>
        <div id="takeOverApplication" class="anchor">
            <div class="top">
                <h3>应用服务器一键接管</h3>
            </div>
            <div class="content">
                <p>应用服务器一键接管，在主设备发生故障时，通过一键接管，将业务转移到备设备</p>
                <h4>功能介绍</h4>
                <p>具体参见<el-button type="text" @click="toguide('dataDaseTakeOver','applicationTakeOver')" >**一键接管_应用服务器**</el-button></p>
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
            toguide(toname,toId){
                // console.log('hh');
                // this.$router.push({name: toname,query: { aId: toId }})
            },
            toBottom(){
                this.$emit('func','takeOverApplication')
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
                    this.$emit('func','addApplication')
                }else if(navIndex == 1){
                    this.$emit('func','applicationDeletion')
                }else if(navIndex == 2){
                    this.$emit('func','takeOverApplication')
                }
              },
              fetchData(){
                  let str = '#'+this.$route.query.aId;
                  if(str == '#addApplicationManual'){
                    document.querySelector('#addApplication').scrollIntoView({block:"start"});
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
