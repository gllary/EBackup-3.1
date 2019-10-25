import baseApi from './base';
// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/postgresqls',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/postgresqls/${id}`,
  });

const createOne = postgresqlData =>
  baseApi.request({
    method: 'post',
    url: '/postgresqls',
    data: postgresqlData,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/postgresqls/${id}`,
  });

const modifyOne = postgresqlData =>
  baseApi.request({
    method: 'patch',
    url: `/postgresqls/${postgresqlData.id}`,
    data: postgresqlData,
  });

const fetchBackupPlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/postgresqls/${id}/postgresql-backup-plans`,
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
    url: `/postgresqls/${id}/results`,
  });

const createPostgreSQLBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/postgresqls/${id}/postgresql-backup-plans`,
    data: plan,
  });

const createBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'post',
      url: `/postgresqls/${id}/postgresql-backup-plans`,
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
    url: `/postgresql-backup-plans/${id}`,
  });

const updatePostgreSQLBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/postgresql-backup-plans/${id}`,
    data: plan,
  });

const updateBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'patch',
      url: `/postgresql-backup-plans/${id}`,
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
    url: `/postgresql-backup-plans/${id}`,
  });

const createSingleRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/postgresql-backup-results/${id}/postgresql-restore-plans`,
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
      url: `/postgresqls/${id}/postgresql-restore-plans`,
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
    url: `/postgresqls/${id}/restore-records`,
  });

const createRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/postgresqls/${id}/postgresql-restore-plans`,
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
    url: `/postgresql-restore-plans/${planId}`,
  });

const updateRestorePlan = data =>
  baseApi
    .request({
      method: 'patch',
      url: `/postgresql-restore-plans/${data.id}`,
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
    url: `/postgresql-restore-plans/${id}`,
  });

export {
  fetchAll,
  fetchOne,
  createOne,
  deleteOne,
  modifyOne,
  fetchBackupPlans,
  fetchBackupResults,
  createPostgreSQLBackupPlan,
  createBackupPlan,
  deleteBackupPlan,
  updatePostgreSQLBackupPlan,
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
