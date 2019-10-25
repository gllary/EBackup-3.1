import baseApi from './base';

const fetchProduction = () =>
  baseApi.request({
    method: 'get',
    url: '/takeover/productions',
  });

const fetchEbackup = () =>
  baseApi.request({
    method: 'get',
    url: '/takeover/ebackup',
  });

const createItem = newData =>
  baseApi.request({
    method: 'post',
    url: '/takeover/newdata',
    data: newData,
  });

export {
  fetchProduction,
  fetchEbackup,
  createItem
};
