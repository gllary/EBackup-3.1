import baseApi from './base';
// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));
const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/sqlservers',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/sqlservers/${id}`,
  });

const createOne = sqlServerData =>
  baseApi.request({
    method: 'post',
    url: '/sqlservers',
    data: sqlServerData,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/sqlservers/${id}`,
  });

const modifyOne = sqlServerData =>
  baseApi.request({
    method: 'patch',
    url: `/sqlservers/${sqlServerData.id}`,
    data: sqlServerData,
  });

const deleteSome = ids =>
  baseApi.request({
    method: 'delete',
    url: '/sqlservers',
    data: ids,
  });

const fetchBackupPlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/sqlservers/${id}/sqlserver-backup-plans`,
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
    url: `/sqlservers/${id}/results`,
  });

const createSqlServerBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/sqlservers/${id}/sqlserver-backup-plans`,
    data: plan,
  });

const createBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'post',
      url: `/sqlservers/${id}/sqlserver-backup-plans`,
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
    url: `/sqlserver-backup-plans/${id}`,
  });

const updateSqlServerBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/sqlserver-backup-plans/${id}`,
    data: plan,
  });
const updateBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'patch',
      url: `/sqlserver-backup-plans/${id}`,
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
    url: `/sqlserver-backup-plans/${id}`,
  });

const createSingleRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/sqlserver-backup-results/${id}/sqlserver-restore-plans`,
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
      url: `/sqlservers/${id}/sqlserver-restore-plans`,
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
    url: `/sqlservers/${id}/restore-records`,
  });

const createRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/sqlservers/${id}/sqlserver-restore-plans`,
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
    url: `/sqlserver-restore-plans/${planId}`,
  });

const updateRestorePlan = data =>
  baseApi
    .request({
      method: 'patch',
      url: `/sqlserver-restore-plans/${data.id}`,
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
    url: `/sqlserver-restore-plans/${id}`,
  });

const fetchLinks = () =>
  baseApi.request({
    method: 'get',
    url: '/sqlserver-links',
  });

const createLinks = data =>
  baseApi.request({
    method: 'post',
    url: '/sqlserver-links',
    data,
  });

const createSwitches = data =>
  baseApi.request({
    method: 'post',
    url: '/sqlserver-switches',
    data,
  });

const fetchSwitches = linkId =>
  baseApi.request({
    method: 'get',
    url: `/sqlserver-links/${linkId}/switches`,
  });

const fetchLink = sqlserverId =>
  baseApi.request({
    method: 'get',
    url: `/sqlservers/${sqlserverId}/sqlserver-links`,
  });

const fetchLinkByLinkId = linkId =>
  baseApi.request({
    method: 'get',
    url: `/sqlserver-links/${linkId}`,
  });

// 批量添加数据库
const batchCreate = dbs =>
  baseApi.request({
    method: 'post',
    url: '/database/create/batch',
    data: dbs
  });

// 根据设备扫描数据库
const scanDatabase = host =>
  baseApi.request({
    method: 'put',
    url: '/database/scan',
    data: host
  });

// 回切初始化
const cutBackSwitch = linkIds =>
  baseApi.request({
    method: 'post',
    url: '/sqlserver-switches/reinit-switch-instances',
    data: { linkIds }
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
  createSqlServerBackupPlan,
  createBackupPlan,
  deleteBackupPlan,
  updateSqlServerBackupPlan,
  updateBackupPlan,
  fetchBackupOperation,
  createSingleRestorePlan,
  fetchRestorePlans,
  fetchRestoreRecords,
  createRestorePlan,
  deleteRestorePlan,
  updateRestorePlan,
  fetchRestoreOperation,
  fetchLinks,
  createSwitches,
  createLinks,
  fetchSwitches,
  fetchLink,
  fetchLinkByLinkId,
  batchCreate,
  scanDatabase,
  cutBackSwitch
};
