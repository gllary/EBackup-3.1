import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Layout from '@/components/Layout';
import Dashboard from '@/components/pages/home/Dashboard';
import Profile from '@/components/pages/Profile';
import NoFound from '@/components/pages/NoFound';
import ServerError from '@/components/pages/ServerError';
import LisenceNotAvail from '@/components/pages/LisenceNotAvail';
import MoreState from '@/components/pages/MoreState';

import homeRouter from './home';
import manualRouter from './manual';
import takeoverRouter from './takeover';
import fileHostRouter from './fileHost';
import databaseRouter from './database';
import vmRouter from './virtuals';
import systemRouter from './system';
import applicationServiceRouter from './applicationservice';
import deployRouter from './deploy';
import inspection from './inspection';
// import overviewRouter from './overview';

Vue.use(Router);
// 跳转到相同路由的地址
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export const basicRouters = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/lisenceNotAvail',
    name: 'lisenceNotAvail',
    component: LisenceNotAvail
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        name: 'dashboard',
        meta: {
          title: '主页',
          activeName: 'dashboard',
          icon: 'dashboard',
        },
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
      },
      {
        path: 'morestate',
        name: 'morestate',
        component: MoreState,
      },
    ],
  },
  ...homeRouter,
  ...manualRouter,
];

export default new Router({
  mode: 'history',
  base: '/ebackup',
  routes: basicRouters,
});

export const asyncRouters = [
  ...takeoverRouter,
  ...fileHostRouter,
  ...databaseRouter,
  ...vmRouter,
  ...applicationServiceRouter,
  ...inspection,
  ...systemRouter,
  ...deployRouter,
  // ...overviewRouter,
  {
    path: '/error',
    component: Layout,
    children: [
      {
        path: 'servererror',
        name: 'serverError',
        component: ServerError,
      },
      {
        path: '/*',
        component: NoFound,
        meta: {
          isMenu: false,
        },
      },
    ],
  },
];
