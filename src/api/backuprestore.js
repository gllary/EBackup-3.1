import baseApi from './base';

const fetchProduction = () =>
  baseApi.request({
    method: 'get',
    url: '/backuprestore/productions',
  });

const fetchEbackup = () =>
  baseApi.request({
    method: 'get',
    url: '/backuprestore/ebackup',
  });

const createProduction = productionData =>
  baseApi.request({
    method: 'post',
    url: '/backuprestore/productions',
    data: productionData,
  });

export {
  fetchProduction,
  fetchEbackup,
  createProduction,
};
