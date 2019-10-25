import types from '@/store/type';
import { _localStorage } from '@/utils/storage';

const state = {
  breadcrumb: [],
  clientWidth: 0,
  theme: 'default',
  configMsg: ''
};

/* eslint no-shadow: 0 */
const mutations = {
  [types.SET_BREADCRUMB](state, breadcrumb) {
    if (breadcrumb) {
      state.breadcrumb = breadcrumb;
    } else {
      state.breadcrumb = [];
    }
  },
  [types.SET_THEME](state, theme) {
    state.theme = theme;
    if (_localStorage.enable()) {
      _localStorage.set('theme', theme);
    }
  },
  setClientWidth(state, width) {
    state.clientWidth = width;
  },
  setConfig(state, conf) {
    state.configMsg = conf;
  }
};

export default { state, mutations };
