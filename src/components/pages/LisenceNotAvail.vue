<template>
  <div class="body">
    <el-row style="width: 100%; padding-top: 100px">
      <el-col :span="13">
        <div class="leftImg"></div>
      </el-col>
      <el-col :span="11">
        <div style="margin-top: 90px;">
          <h2 style="margin-bottom: 40px">您的页面请求被拒绝访问。</h2>
          <p style="font-size: 16px; color: rgba(0,0,0,.45)">非常抱歉，由于证书无效或过期，您没有权限访问，请联系管理员升级。</p>
          <p style="font-size: 16px; color: rgba(0,0,0,.45)">感谢您的理解和支持。</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'LisenceNotAvail'
}
</script>

<style scoped>
.body {
  background-color: #F0F2F5;
  width: 100%;
  min-height: 100vh;
}
.leftImg {
  background-image: url("../../assets/lisenceNotAvail.png");
  background-repeat: no-repeat;
  background-size: contain;
  float: right;
  width: 100%;
  max-width: 430px;
  height: 360px;
}
</style>

