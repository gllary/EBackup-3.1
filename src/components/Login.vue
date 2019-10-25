<template>
  <div class="root"
       :style="{ backgroundImage: `url(${loginBg})` }">
    <div v-if="theme === 'default'">
      <section class="default-login-content">
        <div class="login-box">
          <el-form class="default-login-form" label-position="left">
            <div class="login-head"> <img src="../assets/logo1.png" class="login-img"></div>
            <el-form-item label="用户名" props="loginName" class="login-name">
              <el-input type="text" required v-model="loginName" auto-complete="off" @keyup.enter.native="doPassword" autofocus>
              </el-input>
            </el-form-item>
            <el-form-item label="密码" class="login-pass">
              <el-input type="password" required v-model="password" auto-complete="off" ref="isAutofocus" @keyup.enter.native="doLogin">
              </el-input>
            </el-form-item>
            <el-form-item label="记住我">
              <el-switch v-model="rememberMe" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-button" @click="doLogin" :loading="isLoading">登&emsp;&emsp;录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <div class="default-home-copyright">
        <p>Copyright @2018 whstone Corporation All Rights Reserved</p>
        <p>Powered By easy standby<br/></p>
        <p>Version 3.1<br/></p>
        <p>武汉四通信服易备数据中心应用连续性管理系统<br/></p>
      </div>
    </div>
    <div v-else-if="theme === 'deepBlue'" style="height: 100%">
      <section class="deepBlue-login-content">
        <div class="deepBlue-login-box">
          <el-form class="deepBlue-login-form">
            <div class="login-head" style="text-align: center; padding-bottom: 10px">
              <img src="../assets/logo2.png" style="height: 40px;">
            </div>
            <el-form-item props="loginName">
              <el-input type="text"
                        placeholder="请输入用户名"
                        prefix-icon="el-icon-user"
                        required
                        v-model="loginName"
                        auto-complete="off"
                        @keyup.enter.native="doPassword"
                        autofocus>
              </el-input>
            </el-form-item>
            <el-form-item class="login-pass">
              <el-input type="password"
                        placeholder="请输入密码"
                        prefix-icon="el-icon-lock"
                        required
                        v-model="password"
                        auto-complete="off"
                        ref="isAutofocus"
                        @keyup.enter.native="doLogin">
              </el-input>
            </el-form-item>
            <el-form-item label="记住我">
              <el-switch v-model="rememberMe" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="doLogin"
                         :loading="isLoading"
                         class="deepBlue-login-btn">登&emsp;&emsp;录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <div class="deepBlue-home-copyright">
        <p>Copyright @2018 whstone Corporation All Rights Reserved</p>
        <p>Powered By easy standby<br/></p>
        <p>Version 3.1<br/></p>
        <p>武汉四通信服易备数据中心应用连续性管理系统<br/></p>
      </div>
    </div>
    <div v-else style="height: 100%">
      <section class="yellow-login-content">
        <div class="yellow-login-box">
          <el-form class="yellow-login-form">
            <div class="login-head" style="text-align: center; padding-bottom: 10px">
              <img src="../assets/logo1.png" style="height: 40px;">
            </div>
            <el-form-item props="loginName">
              <el-input type="text"
                        placeholder="请输入用户名"
                        prefix-icon="el-icon-user"
                        required
                        v-model="loginName"
                        auto-complete="off"
                        @keyup.enter.native="doPassword"
                        autofocus>
              </el-input>
            </el-form-item>
            <el-form-item class="login-pass">
              <el-input type="password"
                        placeholder="请输入密码"
                        prefix-icon="el-icon-lock"
                        required
                        v-model="password"
                        auto-complete="off"
                        ref="isAutofocus"
                        @keyup.enter.native="doLogin">
              </el-input>
            </el-form-item>
            <el-form-item label="记住我">
              <el-switch v-model="rememberMe" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="doLogin"
                         :loading="isLoading"
                         class="deepBlue-login-btn">登&emsp;&emsp;录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <div class="yellow-home-copyright">
        <p>Copyright @2018 whstone Corporation All Rights Reserved</p>
        <p>Powered By easy standby<br/></p>
        <p>Version 3.1<br/></p>
        <p>武汉四通信服易备数据中心应用连续性管理系统<br/></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import loginBg1 from '@/assets/loginPage1.jpg';
import loginBg2 from '@/assets/loginPage2.jpg';
import loginBg3 from '@/assets/loginPage3.jpg';
import logo1 from '@/assets/logo1.png';
import logo2 from '@/assets/logo2.png';

export default {
  props: [],
  data() {
    return {
      loginName: '',
      password: '',
      rememberMe: 0,
      isLoading: false,
      logo1,
      logo2
    };
  },
  computed: {
    ...mapState({
      token: state => state.base.token,
      userId: state => {
        if (state.base.userInfo) {
          return state.base.userInfo.id;
        }
        return '';
      },
      theme: state => state.nav.theme
    }),
    loginBg() {
      if (this.theme === 'default') {
        return loginBg1;
      } else if (this.theme === 'deepBlue') {
        return loginBg2;
      } else if (this.theme === 'yellow') {
        return loginBg3;
      }
    },
  },
  methods: {
    ...mapActions(['loginForAll']),
    login2() {
      this.isLoading = true;
      this.loginForAll(this.$data)
        .then(accessedRouters => {
          this.isLoading = false;
          // 登录成功后，必须马上添加允许登录的路由
          this.$router.addRoutes(accessedRouters);
          this.$message.success('登录成功');
          this.$router.replace('/');
          // this.$router.push('/dashboard');
        })
        .catch(error => {
          this.isLoading = false;
          this.$message.error(error);
        });
    },
    doPassword() {
      if(!this.loginName){
        this.$message.error('用户名不能为空');
      }else{
        this.$refs.isAutofocus.focus();
      }
    },
    doLogin() {
      if(!this.password){
        this.$message.error('密码不能为空');
      }else if(!this.loginName){
        this.$message.error('用户名不能为空');
      }else{
        this.login2();
      }
    }
  },
};
</script>
<style  lang="scss" scoped>
@import '@/assets/theme/variable.scss';
.root {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 700px;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center 0;
  position: relative;
}

@font-face {
  font-family: 'Niconne';
  font-style: normal;
  font-weight: 400;
  src: url('../assets/Niconne-Regular.ttf');
}
h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset;
 }

.default-login-content {
  display: flex;
  padding-top: 13%;
}

.default-login-content .logo {
  margin-bottom: 40px;
  font-family: "Niconne";
  color: #fff;
}

.default-login-content .logo h1 {
  font-size: 52px;
  font-weight: 400;
}

.default-login-content .login-box {
  position: relative;
  width: 390px;
  height: 430px;
  font-weight: 700;
  background-color: #fff;
  margin: 0 auto;
  -webkit-box-shadow: 0px 29px 147.5px 102.5px rgba(0, 0, 0, 0.05), 0px 29px 95px 0px rgba(0, 0, 0, 0.16);
          box-shadow: 0px 29px 147.5px 102.5px rgba(0, 0, 0, 0.05), 0px 29px 95px 0px rgba(0, 0, 0, 0.16);
  -webkit-perspective: 800px;
          perspective: 800px;
  -webkit-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
}

.default-login-content .login-box .login-head {
  margin-top: 0;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.default-login-content .login-box .login-img {
  height: 50px;
  padding-right: 20px;
  line-height: .75em;
  vertical-align: -40%;
}

.default-login-content .login-box .login-button {
  width: 310px;
}

.default-login-content .login-box .default-login-form {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  padding-top: 25px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
}

.deepBlue-login-content {
  background-image: url('../assets/login2-content.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center center;
  width: 700px;
  height: 80%;
  margin: 0 auto;
  position: relative;
}

.deepBlue-login-box {
  width: 240px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-55%, -52%);
}

.deepBlue-login-btn {
  width: 240px;
}

.yellow-login-content {
  height: 80%;
  position: relative;
}

.yellow-login-box {
  width: 240px;
  height: 300px;
  padding: 30px 40px 10px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 70%;
  transform: translate(-50%, -30%);
}

.el-form-item {
    margin-bottom: 10px;
}

.el-button {
    font-weight: 700;
}
.default-home-copyright,
.deepBlue-home-copyright {
  // margin-top: -100px;
  margin-top: 70px;
  width: 100%;
  @include gray-text-color;
}
.default-home-copyright p,
.deepBlue-home-copyright p,
.yellow-home-copyright p {
  text-align: center;
  display: block;
  font-size: 12px;
  margin: 0;
  padding: 2px;
}
.deepBlue-home-copyright {
  margin-top: 30px;
}
.yellow-home-copyright {
  margin-top: 50px;
}
@media screen and (max-width: 1600px) {
  .deepBlue-login-content {
    width: 600px;
  }
  .deepBlue-login-btn {
    width: 240px;
  }
  .default-login-content .login-box {
    width: 340px;
    height: 400px;
    margin-top: -50px;
  }
  .default-login-content .login-box .login-button {
    width: 260px;
    height: 35px;
  }
  .default-login-content .login-box .login-head {
    margin-top: -10px;
  }
  .default-login-content {
    padding-bottom: 2px;
  }
}
</style>
<style>
@media screen and (max-width: 1460px) {
  .login-name .el-form-item__label,
  .login-pass .el-form-item__label {
    line-height: 30px;
  }
  .login-name .el-form-item__content,
  .login-pass .el-form-item__content {
    line-height: 24px;
  }
  .login-name .el-input__inner,
  .login-name .el-input__inner {
    height: 35px;
  }
}
</style>