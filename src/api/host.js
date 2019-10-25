import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/hosts',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/hosts/${id}`,
  });

const createOne = hostData =>
  baseApi.request({
    method: 'post',
    url: '/hosts',
    data: hostData,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/hosts/${id}`,
  });

const modifyOne = hostData =>
  baseApi.request({
    method: 'patch',
    url: `/hosts/${hostData.id}`,
    data: hostData,
  });

const deleteSome = ids =>
  baseApi.request({
    method: 'delete',
    url: '/hosts',
    data: ids,
  });

const createSwitches = (hostLinkId, formData) =>
  baseApi.request({
    method: 'post',
    url: `/host-links/${hostLinkId}/switches`,
    data: formData,
  });

const vipSwitches = hostLinkId =>
  baseApi.request({
    method: 'post',
    url: `/host-links/${hostLinkId}/switch-vip`
  });

const deleteLinks = linkId =>
  baseApi.request({
    method: 'delete',
    url: `/host-links/${linkId}`,
  });

const singleSwitchIp = (id, req) =>
  baseApi.request({
    method: 'patch',
    url: `/host-links/${id}/vice-switch`,
    data: req
  });

// 根据设备获取主机信息
const fetchDetailsById = id =>
  baseApi.request({
    method: 'get',
    url: `/hosts/details/${id}`
  });

// 添加主机
const addServer = server =>
  baseApi.request({
    method: 'post',
    url: '/virtuals/hosts/server',
    data: server
  });

const fetchServerList = () =>
  baseApi
    .request({
      method: 'get',
      url: '/virtuals/hosts/server/list'
    });

const deleteServer = id =>
  baseApi.request({
    method: 'delete',
    url: `/virtuals/hosts/server/${id}`
  });

export {
  fetchAll,
  fetchOne,
  createOne,
  deleteOne,
  deleteSome,
  modifyOne,
  createSwitches,
  vipSwitches,
  deleteLinks,
  singleSwitchIp,
  fetchDetailsById,
  addServer,
  fetchServerList,
  deleteServer
};
