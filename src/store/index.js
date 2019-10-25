import Vue from 'vue';
import Vuex from 'vuex';
import base from './modules/base';
import nav from './modules/nav';
import host from './modules/host';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  strict: debug,
  modules: {
    base,
    nav,
    host,
  },
});
