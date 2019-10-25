import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/emailmanagers',
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: '/emailmanagers',
    data,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/emailmanagers/${id}`,
  });

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/emailmanagers/${data.emailId}`,
    data,
  });
export {
  fetchAll,
  createOne,
  deleteOne,
  modifyOne,
};
