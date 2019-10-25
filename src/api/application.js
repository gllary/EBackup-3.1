import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/application-hosts',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/application-hosts/${id}`,
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: '/application-hosts',
    data,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/application-hosts/${id}`,
  });

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/application-hosts/${data.id}`,
    data,
  });

const fetchLinks = () =>
  baseApi.request({
    method: 'get',
    url: '/application-links',
  });

const deleteLinks = linkId =>
  baseApi.request({
    method: 'delete',
    url: `/application-links/${linkId}`,
  });

const createLinks = data =>
  baseApi.request({
    method: 'post',
    url: '/application-links',
    data
  });

const fetchLinkByLinkId = linkId =>
  baseApi.request({
    method: 'get',
    url: `/application-links/${linkId}`,
  });

const fetchSwitches = linkId =>
  baseApi.request({
    method: 'get',
    url: `/application-links/${linkId}/switches`,
  });

export {
  fetchAll,
  fetchOne,
  createOne,
  deleteOne,
  modifyOne,
  fetchLinks,
  createLinks,
  deleteLinks,
  fetchLinkByLinkId,
  fetchSwitches
};
