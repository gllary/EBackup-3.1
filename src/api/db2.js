import baseApi from './base';
// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/db2s',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/db2s/${id}`,
  });

const createOne = db2Data =>
  baseApi.request({
    method: 'post',
    url: '/db2s',
    data: db2Data,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/db2s/${id}`,
  });

const modifyOne = db2Data =>
  baseApi.request({
    method: 'patch',
    url: `/db2s/${db2Data.id}`,
    data: db2Data,
  });

const deleteSome = ids =>
  baseApi.request({
    method: 'delete',
    url: '/db2s',
    data: ids,
  });

const fetchBackupPlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/db2s/${id}/db2-backup-plans`,
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
    url: `/db2s/${id}/results`,
  });

// API https://nei.netease.com/interface/detail/?pid=28187&id=88119
const createDB2BackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/db2s/${id}/db2-backup-plans`,
    data: plan,
  });
const createBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'post',
      url: `/db2s/${id}/db2-backup-plans`,
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
    url: `/db2-backup-plans/${id}`,
  });

const updateDB2BackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/db2-backup-plans/${id}`,
    data: plan,
  });

const updateBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'patch',
      url: `/db2-backup-plans/${id}`,
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
    url: `/db2-backup-plans/${id}`,
  });

const createSingleRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/db2-backup-results/${id}/db2-restore-plans`,
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
      url: `/db2s/${id}/db2-restore-plans`,
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
    url: `/db2s/${id}/restore-records`,
  });

const createRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/db2s/${id}/db2-restore-plans`,
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
    url: `/db2-restore-plans/${planId}`,
  });

const updateRestorePlan = data =>
  baseApi
    .request({
      method: 'patch',
      url: `/db2-restore-plans/${data.id}`,
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
    url: `/db2-restore-plans/${id}`,
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
  createDB2BackupPlan,
  createBackupPlan,
  deleteBackupPlan,
  updateDB2BackupPlan,
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
