import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/email-configs',
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: '/email-configs',
    data
  });

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/email-configs/${data.id}`,
    data,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/email-configs/${id}`,
  });

export {
  fetchAll,
  modifyOne,
  createOne,
  deleteOne
};
