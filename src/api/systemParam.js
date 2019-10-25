import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/systemparams',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/systemparams/${id}`,
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: '/systemparams',
    data,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/systemparams/${id}`,
  });

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/systemparams/${data.id}`,
    data,
  });

export {
  fetchAll,
  fetchOne,
  createOne,
  deleteOne,
  modifyOne,
};
