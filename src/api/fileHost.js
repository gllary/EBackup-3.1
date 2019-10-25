// import baseApi from './fileBase';
import baseApi from './fileBase';
// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));
const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/file-hosts',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/file-hosts/${id}`,
  });

const fetchOriginPath = id =>
  baseApi.request({
    method: 'get',
    url: `/file-host-backup-results/${id}/file-host-origin-path`,
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: '/file-hosts',
    data,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/file-hosts/${id}`,
  });

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/file-hosts/${data.id}`,
    data,
  });

const fetchBackupPlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/file-hosts/${id}/file-host-backup-plans`,
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
    url: `/file-hosts/${id}/results`,
  });

const createBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'post',
      url: `/file-hosts/${id}/file-host-backup-plans`,
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
    url: `/file-host-backup-plans/${id}`,
  });

const updateBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'patch',
      url: `/file-host-backup-plans/${id}`,
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
    url: `/file-host-backup-plans/${id}`,
  });

const createSingleRestorePlan = ({ id, data }) =>
  baseApi.request({
    method: 'post',
    url: `/file-host-backup-results/${id}/file-host-restore-plans`,
    data,
  });

const fetchRestorePlans = id =>
  baseApi.request({
    method: 'get',
    url: `/file-hosts/${id}/file-host-restore-plans`,
  });

const fetchRestoreRecords = id =>
  baseApi.request({
    method: 'get',
    url: `/file-hosts/${id}/restore-records`,
  });

const deleteResultByPlanId = id =>
  baseApi.request({
    method: 'delete',
    url: `/file-host-backup-plan/${id}/file-host-backup-results`,
  });

const deleteResultById = id =>
  baseApi.request({
    method: 'delete',
    url: `/file-host-backup-results/${id}`,
  });

export {
  fetchAll,
  fetchOne,
  createOne,
  deleteOne,
  modifyOne,
  fetchBackupPlans,
  fetchBackupResults,
  fetchOriginPath,
  createBackupPlan,
  deleteBackupPlan,
  updateBackupPlan,
  fetchBackupOperation,
  createSingleRestorePlan,
  fetchRestorePlans,
  fetchRestoreRecords,
  deleteResultByPlanId,
  deleteResultById
};
