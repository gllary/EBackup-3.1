import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/cloud-configs'
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: '/cloud-configs',
    data
  });

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/cloud-configs/${data.id}`,
    data
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/cloud-configs/${id}`
  });

export {
  fetchAll,
  createOne,
  modifyOne,
  deleteOne
};
