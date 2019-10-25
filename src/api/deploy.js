import baseApi from './base';

const fetchPackageRecords = () =>
  baseApi.request({
    method: 'get',
    url: '/package-records'
  });

const createMultiPackagesRecords = deploys =>
  baseApi.request({
    method: 'post',
    url: '/package-records',
    data: deploys,
  });

const modifyPackageRecord = deploy =>
  baseApi.request({
    method: 'patch',
    url: `/package-records/${deploy.id}`,
    data: deploy
  });

const deletePackageRecord = id =>
  baseApi.request({
    method: 'delete',
    url: `/package-records/${id}`
  });

const stopPackageRecord = id =>
  baseApi.request({
    method: 'patch',
    url: `/package-records/${id}/stop`
  });

const startPackageRecord = id =>
  baseApi.request({
    method: 'patch',
    url: `/package-records/${id}/start`
  });

const fetchVersionTypes = () =>
  baseApi.request({
    method: 'get',
    url: '/version-types'
  });

const createVersion = data =>
  baseApi.request({
    method: 'post',
    url: '/version-types',
    data
  });

const updateVersion = version =>
  baseApi.request({
    method: 'patch',
    url: `/version-types/${version.id}`,
    data: version
  });

const deleteVersion = id =>
  baseApi.request({
    method: 'delete',
    url: `/version-types/${id}`
  });

const scanVersion = () =>
  baseApi.request({
    method: 'get',
    url: '/version-types/scan'
  });

const deletePackage = id =>
  baseApi.request({
    method: 'delete',
    url: `/package-types/${id}`
  });

const refreshDeploys = ids =>
  baseApi.request({
    method: 'post',
    url: '/package-records/refresh',
    data: ids
  });

const uploadPackages = (id, packages) =>
  baseApi.request({
    method: 'post',
    url: `/version-types/${id}/package-types`,
    data: packages,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export {
  fetchPackageRecords,
  createMultiPackagesRecords,
  modifyPackageRecord,
  deletePackageRecord,
  stopPackageRecord,
  startPackageRecord,
  fetchVersionTypes,
  createVersion,
  updateVersion,
  deleteVersion,
  deletePackage,
  scanVersion,
  refreshDeploys,
  uploadPackages
};
