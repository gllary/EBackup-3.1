// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueWorker from 'vue-worker';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import echarts from 'echarts';
import * as d3 from 'd3';
import 'babel-polyfill';
import '@/assets/theme/default/index.css';
import '@/assets/theme/deepBlue/index.css';
import '@/assets/theme/yellow/index.css';
import '@/assets/theme/variable.scss';
import toggleClass from '@/utils/index';
import ElementUI, { Message } from 'ebackup-element';
import 'ebackup-element/lib/theme-chalk/index.css';
import 'ebackup-element/lib/theme-chalk/display.css';
import types from './store/type';
import './utils/icon-svg';
import App from './App';
import store from './store/index';
import router from './router';
import { userToken, _localStorage } from './utils/storage';
import IIcon from './components/IIcon';
import global from './utils/global';

Vue.use(ElementUI);
Vue.use(global);
Vue.use(VueWorker);
Vue.component('IIcon', IIcon);
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$d3 = d3;

dayjs.locale('zh-cn');

router.beforeEach((to, from, next) => {
  if (store.state.base.token) {
    if (to.path === '/login') {
      next('/');
    } else {
      next();
    }
  } else if (userToken.get()) {
    const token = userToken.get();
    store
      .dispatch('loginByToken', { token })
      .then(accessedRouters => {
        store.commit(types.SET_TOKEN, { token });
        router.addRoutes(accessedRouters);
        next({ ...to, replace: true });
      })
      .catch(error => {
        Message.error(error);
        store.commit(types.CLEAR_TOKEN);
        userToken.remove();
        next('/login');
      });
  } else if (to.path === '/login') {
    next();
  } else {
    next('/login');
  }
});

router.afterEach(to => {
  store.commit(types.SET_BREADCRUMB, to.meta.breadcrumb);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted() {
    if (_localStorage.enable()) {
      const theme = _localStorage.get('theme');
      // eslint-disable-next-line
      theme && store.commit('SET_THEME', theme);
    }
    toggleClass(document.body, `custom-${this.theme}`);
    document.body.setAttribute('data-theme', this.theme);
  },
  computed: {
    theme() {
      return store.state.nav.theme;
    }
  },
  watch: {
    theme: {
      handler() {
        toggleClass(document.body, `custom-${this.theme}`);
        document.body.setAttribute('data-theme', this.theme);
      }
    }
  },
});
