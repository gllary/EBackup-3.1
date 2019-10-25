import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/ports',
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: 'ports',
    data
  });

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/ports/${data.id}`,
    data,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/ports/${id}`,
  });

export {
  fetchAll,
  modifyOne,
  createOne,
  deleteOne
};
