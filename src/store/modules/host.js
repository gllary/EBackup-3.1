import types from '../type';
import { fetchAll } from '../../api/host';

const state = {
  hosts: [],
};
/* eslint no-shadow: 0 */
const getters = {
  selectedHost: state => id => state.hosts.find(host => host.id === id) || {},
  oracleHosts: state => state.hosts.filter(host => host.databaseType === 1),
  sqlserverHosts: state =>
    state.hosts.filter(host => host.databaseType === 2),
  mysqlHosts: state => state.hosts.filter(host => host.databaseType === 5),
  db2Hosts: state => state.hosts.filter(host => host.databaseType === 6),
  dmHosts: state => state.hosts.filter(host => host.databaseType === 7),
  sybaseHosts: state => state.hosts.filter(host => host.databaseType === 9),
  cacheHosts: state => state.hosts.filter(host => host.databaseType === 10),
  insqlHosts: state => state.hosts.filter(host => host.databaseType === 11),
  informixHosts: state => state.hosts.filter(host => host.databaseType === 12),
  postgresqlHosts: state => state.hosts.filter(host => host.databaseType === 13),
  applicationHosts: state => state.hosts.filter(host => host.databaseType === 8)
};
const mutations = {
  [types.GET_HOST](state, host) {
    state.hosts = host;
  }
};
const actions = {
  fetchHost({ commit }) {
    return fetchAll()
      .then(res => {
        const { data: host } = res.data;
        commit(types.GET_HOST, host);
      })
      .catch(error => Promise.reject(error));
  },
  setHost({ commit }, host) {
    commit(types.GET_HOST, host);
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
