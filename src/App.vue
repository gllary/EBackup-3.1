<template>
  <div id="app" v-cloak>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
@import '@/assets/theme/variable.scss';
@import '@/assets/theme/style.scss';
body {
  margin: 0;
}
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // color: #2c3e50;
  @include text-color;
  height: 100vh;
}
[v-cloak] {
  display: none;
}
.icon {
  width: 1.3em;
  height: 1.3em;
  /* vertical-align: -0.45em; */
  /* margin-right: 5px; */
  fill: rgb(208, 208, 208);
  overflow: hidden;
}
/* 详情页面头部CSS */
.detail-header {
  /* background-color: #ffffff; */
  @include host-link-content-color;
  margin: -20px -20px 0 -20px;
  padding: 10px 10px 50px 10px;
}
.detail-icon {
  display: block;
  margin: 0.5em auto;
  width: 70%;
  height: 3.125em; /* 兼容浏览器的字体大小不同而引起的图标错位问题*/
  min-width: 30px;
}
.detail-header .content {
  margin-left: 20px;
}
.action {
  text-align: right;
}
.item-info .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  /* width: 40%; */
}
.min-width-dialog {
  min-width: 740px;
}
.monitorClass{
  width: 24px;
  height: 28px;
  margin-right: 10px;
  vertical-align: bottom;
  cursor: pointer;
}
.monitorClass:hover{
  opacity: 0.8
}
.custom-scrollbar::-webkit-scrollbar {/*滚动条整体样式*/
  width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
  /* height: 4px; */
}
.custom-scrollbar::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  // -webkit-box-shadow: inset 0 0 5px #676769;
  // background: #676769;
  @include scrollbarThumbColor;
}
.custom-scrollbar::-webkit-scrollbar-track {/*滚动条里面轨道*/
  // -webkit-box-shadow: 0 0 5px #1D3E5F;
  border-radius: 5px;
  // background: rgba(0,0,0,0.1);
  @include scrollbarTrackColor;
}
.custom-scrollbar{
  @include themeify {
    // background: themed('scrollbar-track-bg-color');
    /*三角箭头的颜色*/
    // scrollbar-arrow-color: transparent;
    /*滚动条滑块按钮的颜色*/
    scrollbar-face-color: themed('scrollbar-thumb-bg-color');
    /*滚动条整体颜色*/
    scrollbar-highlight-color: themed('scrollbar-track-bg-color');
    /*滚动条阴影*/
    scrollbar-shadow-color: themed('scrollbar-thumb-bg-color');
    /*滚动条轨道颜色*/
    // scrollbar-track-color: themed('scrollbar-track-bg-color');
  }
}
</style>
