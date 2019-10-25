import baseApi from './base';
// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));
const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/insqls',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/insqls/${id}`,
  });

const createOne = inSqlData =>
  baseApi.request({
    method: 'post',
    url: '/insqls',
    data: inSqlData,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/insqls/${id}`,
  });

const modifyOne = inSqlData =>
  baseApi.request({
    method: 'patch',
    url: `/insqls/${inSqlData.id}`,
    data: inSqlData,
  });

const deleteSome = ids =>
  baseApi.request({
    method: 'delete',
    url: '/insqls',
    data: ids,
  });

const fetchBackupPlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/insqls/${id}/insql-backup-plans`,
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
    url: `/insqls/${id}/results`,
  });

const createInSqlBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/insqls/${id}/insql-backup-plans`,
    data: plan,
  });

const createBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'post',
      url: `/insqls/${id}/insql-backup-plans`,
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
    url: `/insql-backup-plans/${id}`,
  });

const updateInSqlBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/insql-backup-plans/${id}`,
    data: plan,
  });
const updateBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'patch',
      url: `/insql-backup-plans/${id}`,
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
    url: `/insql-backup-plans/${id}`,
  });

const createSingleRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/insql-backup-results/${id}/insql-restore-plans`,
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
      url: `/insqls/${id}/insql-restore-plans`,
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
    url: `/insqls/${id}/restore-records`,
  });

const createRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/insqls/${id}/insql-restore-plans`,
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
    url: `/insql-restore-plans/${planId}`,
  });

const updateRestorePlan = data =>
  baseApi
    .request({
      method: 'patch',
      url: `/insql-restore-plans/${data.id}`,
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
    url: `/insql-restore-plans/${id}`,
  });
const fetchLinks = () =>
  baseApi.request({
    method: 'get',
    url: '/insql-links',
  });

const createLinks = data =>
  baseApi.request({
    method: 'post',
    url: '/insql-links',
    data,
  });

const createSwitches = data =>
  baseApi.request({
    method: 'post',
    url: '/insql-switches',
    data,
  });

const fetchSwitches = linkId =>
  baseApi.request({
    method: 'get',
    url: `/insql-links/${linkId}/switches`,
  });

const fetchLink = insqlId =>
  baseApi.request({
    method: 'get',
    url: `/insqls/${insqlId}/insql-links`,
  });

const fetchLinkByLinkId = linkId =>
  baseApi.request({
    method: 'get',
    url: `/insql-links/${linkId}`,
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

export {
  fetchAll,
  fetchOne,
  createOne,
  deleteOne,
  deleteSome,
  modifyOne,
  fetchBackupPlans,
  fetchBackupResults,
  createInSqlBackupPlan,
  createBackupPlan,
  deleteBackupPlan,
  updateInSqlBackupPlan,
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
  scanDatabase
};
