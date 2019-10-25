import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/switch-plans',
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: '/switch-plans',
    data,
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/switch-plans/${id}`,
  });

const fetchNum = () =>
  baseApi.request({
    method: 'get',
    url: '/plan-details',
  });
export {
  fetchAll,
  createOne,
  fetchOne,
  fetchNum
};
