import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/vm-manage-host/collect/list',
  });

const addCollect = data =>
  baseApi.request({
    method: 'post',
    url: '/vm-manage-host/collect',
    data,
  });

export {
  fetchAll,
  addCollect,
};
