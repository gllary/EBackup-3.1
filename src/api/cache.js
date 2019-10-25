import baseApi from './base';
// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/caches',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/caches/${id}`,
  });

const createOne = cacheData =>
  baseApi.request({
    method: 'post',
    url: '/caches',
    data: cacheData,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/caches/${id}`,
  });

const modifyOne = cacheData =>
  baseApi.request({
    method: 'patch',
    url: `/caches/${cacheData.id}`,
    data: cacheData,
  });

const deleteSome = ids =>
  baseApi.request({
    method: 'delete',
    url: '/caches',
    data: ids,
  });

const fetchBackupPlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/caches/${id}/cache-backup-plans`,
    })
    .then(res => {
      const { data: plans } = res.data;
      plans.forEach(p => {
        if (p.config.timePoints) {
          p.config.timePoints = timePoints2Obj(p.config.timePoints);
        }
      });
      return res;
    });

const fetchBackupResults = id =>
  baseApi.request({
    method: 'get',
    url: `/caches/${id}/results`,
  });

// API https://nei.netease.com/interface/detail/?pid=28187&id=88119
const createCacheBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/caches/${id}/cache-backup-plans`,
    data: plan,
  });
const createBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'post',
      url: `/caches/${id}/cache-backup-plans`,
      data: plan,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });

const deleteBackupPlan = id =>
  baseApi.request({
    method: 'delete',
    url: `/cache-backup-plans/${id}`,
  });

const updateCacheBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/cache-backup-plans/${id}`,
    data: plan,
  });

const updateBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'patch',
      url: `/cache-backup-plans/${id}`,
      data: plan,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });

const fetchBackupOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/cache-backup-plans/${id}`,
  });

const createSingleRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/cache-backup-results/${id}/cache-restore-plans`,
      data,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });
const fetchRestorePlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/caches/${id}/cache-restore-plans`,
    })
    .then(res => {
      const { data: plans } = res.data;
      plans.forEach(p => {
        if (p.config.timePoints) {
          p.config.timePoints = timePoints2Obj(p.config.timePoints);
        }
      });
      return res;
    });

const fetchRestoreRecords = id =>
  baseApi.request({
    method: 'get',
    url: `/caches/${id}/restore-records`,
  });

const createRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/caches/${id}/cache-restore-plans`,
      data,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });

const deleteRestorePlan = planId =>
  baseApi.request({
    method: 'delete',
    url: `/cache-restore-plans/${planId}`,
  });

const updateRestorePlan = data =>
  baseApi
    .request({
      method: 'patch',
      url: `/cache-restore-plans/${data.id}`,
      data,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });

const fetchRestoreOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/cache-restore-plans/${id}`,
  });

export {
  fetchAll,
  fetchOne,
  createOne,
  deleteOne,
  deleteSome,
  modifyOne,
  fetchBackupPlans,
  fetchBackupResults,
  createCacheBackupPlan,
  createBackupPlan,
  deleteBackupPlan,
  updateCacheBackupPlan,
  updateBackupPlan,
  fetchBackupOperation,
  createSingleRestorePlan,
  fetchRestorePlans,
  fetchRestoreRecords,
  createRestorePlan,
  deleteRestorePlan,
  updateRestorePlan,
  fetchRestoreOperation
};
