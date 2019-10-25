import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/backup-keep-strategy',
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: '/backup-keep-strategy',
    data
  });

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/backup-keep-strategy/${data.id}`,
    data,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/backup-keep-strategy/${id}`
  });

export {
  fetchAll,
  modifyOne,
  createOne,
  deleteOne
};
