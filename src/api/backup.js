import baseApi from './base';
import fileBaseApi from './fileBase';
// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));

const fetchBackupPlans = (type, id) =>
  (type === 'file-host' ? fileBaseApi : baseApi)
    .request({
      method: 'get',
      url: `/${type}s/${id}/${type}-backup-plans`,
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

const fetchBackupResults = (type, id) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'get',
    url: `/${type}s/${id}/results`,
  });

// API https://nei.netease.com/interface/detail/?pid=28187&id=88119
const createMySqlBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/mysqls/${id}/mysql-backup-plans`,
    data: plan,
  });
const createBackupPlan = (type, { id, plan }) =>
  (type === 'file-host' ? fileBaseApi : baseApi)
    .request({
      method: 'post',
      url: `/${type}s/${id}/${type}-backup-plans`,
      data: plan,
    })
    .then(res => {
      if (res.data.data.config) {
        const { timePoints } = res.data.data.config;
        if (timePoints) {
          res.data.data.config.timePoints = timePoints2Obj(timePoints);
        }
      }
      return res;
    });

const deleteBackupPlan = (type, id) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'delete',
    url: `/${type}-backup-plans/${id}`,
  });

const updateMySqlBackupPlan = (type, { id, plan }) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'patch',
    url: `/${type}-backup-plans/${id}`,
    data: plan,
  });

const updateBackupPlan = (type, { id, plan }) =>
  (type === 'file-host' ? fileBaseApi : baseApi)
    .request({
      method: 'patch',
      url: `/${type}-backup-plans/${id}`,
      data: plan,
    })
    .then(res => {
      if (res.data.data.config) {
        const { timePoints } = res.data.data.config;
        if (timePoints) {
          res.data.data.config.timePoints = timePoints2Obj(timePoints);
        }
      }
      return res;
    });

const fetchBackupOperation = (type, id) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'get',
    url: `/${type}-backup-plans/${id}`,
  }).then(res => {
    if (res.data.data.config) {
      const { timePoints } = res.data.data.config;
      if (timePoints) {
        res.data.data.config.timePoints = timePoints2Obj(timePoints);
      }
    }
    return res;
  });

const createSingleRestorePlan = (type, { id, data }) =>
  (type === 'file-host' ? fileBaseApi : baseApi)
    .request({
      method: 'post',
      url: `/${type}-backup-results/${id}/${type}-restore-plans`,
      data,
    })
    .then(res => {
      if (res.data.data.config) {
        const { timePoints } = res.data.data.config;
        if (timePoints) {
          res.data.data.config.timePoints = timePoints2Obj(timePoints);
        }
      }
      return res;
    });
const fetchRestorePlans = (type, id) =>
  (type === 'file-host' ? fileBaseApi : baseApi)
    .request({
      method: 'get',
      url: `/${type}s/${id}/${type}-restore-plans`,
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

const fetchRestoreRecords = (type, id) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'get',
    url: `/${type}s/${id}/restore-records`,
  });

const createRestorePlan = (type, { id, plan }) =>
  (type === 'file-host' ? fileBaseApi : baseApi)
    .request({
      method: 'post',
      url: `/${type}s/${id}/${type}-restore-plans`,
      data: plan,
    })
    .then(res => {
      if (res.data.data.config) {
        const { timePoints } = res.data.data.config;
        if (timePoints) {
          res.data.data.config.timePoints = timePoints2Obj(timePoints);
        }
      }
      return res;
    });

const deleteRestorePlan = (type, planId) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'delete',
    url: `/${type}-restore-plans/${planId}`,
  });

const updateRestorePlan = (type, data) =>
  (type === 'file-host' ? fileBaseApi : baseApi)
    .request({
      method: 'patch',
      url: `/${type}-restore-plans/${data.id}`,
      data: data.plan,
    })
    .then(res => {
      if (res.data.data.config) {
        const { timePoints } = res.data.data.config;
        if (timePoints) {
          res.data.data.config.timePoints = timePoints2Obj(timePoints);
        }
      }
      return res;
    });

const fetchRestoreOperation = (type, id) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'get',
    url: `/${type}-restore-plans/${id}`,
  }).then(res => {
    if (res.data.data.config) {
      const { timePoints } = res.data.data.config;
      if (timePoints) {
        res.data.data.config.timePoints = timePoints2Obj(timePoints);
      }
    }
    return res;
  });

// 删除单个数据库/虚拟机下的单个备份集
const deleteBackupResult = (type, id) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'delete',
    url: `/${type}-backup-results/${id}`
  });

export {
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
  fetchRestoreOperation,
  deleteBackupResult
};
