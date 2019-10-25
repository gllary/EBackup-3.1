import baseApi from './base';
// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/mysqls',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/mysqls/${id}`,
  });

const createOne = mysqlData =>
  baseApi.request({
    method: 'post',
    url: '/mysqls',
    data: mysqlData,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/mysqls/${id}`,
  });

const modifyOne = mysqlData =>
  baseApi.request({
    method: 'patch',
    url: `/mysqls/${mysqlData.id}`,
    data: mysqlData,
  });

const deleteSome = ids =>
  baseApi.request({
    method: 'delete',
    url: '/mysqls',
    data: ids,
  });

const fetchBackupPlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/mysqls/${id}/mysql-backup-plans`,
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
    url: `/mysqls/${id}/results`,
  });

// API https://nei.netease.com/interface/detail/?pid=28187&id=88119
const createMySqlBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/mysqls/${id}/mysql-backup-plans`,
    data: plan,
  });
const createBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'post',
      url: `/mysqls/${id}/mysql-backup-plans`,
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
    url: `/mysql-backup-plans/${id}`,
  });

const updateMySqlBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/mysql-backup-plans/${id}`,
    data: plan,
  });

const updateBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'patch',
      url: `/mysql-backup-plans/${id}`,
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
    url: `/mysql-backup-plans/${id}`,
  });

const createSingleRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/mysql-backup-results/${id}/mysql-restore-plans`,
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
      url: `/mysqls/${id}/mysql-restore-plans`,
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
    url: `/mysqls/${id}/restore-records`,
  });

const createRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/mysqls/${id}/mysql-restore-plans`,
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
    url: `/mysql-restore-plans/${planId}`,
  });

const updateRestorePlan = data =>
  baseApi
    .request({
      method: 'patch',
      url: `/mysql-restore-plans/${data.id}`,
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
    url: `/mysql-restore-plans/${id}`,
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
  createMySqlBackupPlan,
  createBackupPlan,
  deleteBackupPlan,
  updateMySqlBackupPlan,
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
