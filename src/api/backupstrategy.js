import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/backupstrategys',
  });

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/backupstrategys/${data.strategyId}`,
    data,
  });

export {
  fetchAll,
  modifyOne,
};
