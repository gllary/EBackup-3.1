import baseApi from './base';

const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/virtuals',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/virtuals/${id}`,
  });

const modifyOne = virtualData =>
  baseApi.request({
    method: 'patch',
    url: `/virtuals/${virtualData.id}`,
    data: virtualData,
  });
// 获取单个虚拟机下的所有备份配置（计划）
const fetchBackupPlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/virtuals/${id}/virtual-backup-plans`,
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
// 获取单个虚拟机下的所有备份集
const fetchBackupResults = id =>
  baseApi.request({
    method: 'get',
    url: `/virtuals/${id}/results`,
  });

// 创建单个虚拟机下的一个备份配置（计划）
const createVirtualBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'post',
      url: `/virtuals/${id}/virtual-backup-plans`,
      data: plan,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });
// 创建多个虚拟机下的一个备份配置（计划）
const createMultipleVirtualBackupPlan = plan =>
  baseApi
    .request({
      method: 'post',
      url: '/virtuals/virtual-backup-plans/multiple',
      data: plan,
    });
  // .then(res => {
  //   const { timePoints } = res.data.data.config;
  //   res.data.data.config.timePoints = timePoints2Obj(timePoints);
  //   return res;
  // });
// 删除单个虚拟机下的一个备份计划
const deleteVirtualBackupPlan = (id, delBackupResults) =>
  baseApi.request({
    method: 'delete',
    url: `/virtual-backup-plans/${id}`,
    data: { delBackupResults }
  });
// 修改单个虚拟机下的一个备份计划
const updateVirtualBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'patch',
      url: `/virtual-backup-plans/${id}`,
      data: plan,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });
// 查询虚拟机下的一个备份计划
const fetchBackupOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/virtual-backup-plans/${id}`,
  });

const createSingleRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/virtual-backup-results/${id}/virtual-restore-plans`,
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
      url: `/virtuals/${id}/virtual-restore-plans`,
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
    url: `/virtuals/${id}/restore-records`,
  });

const createRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/virtuals/${id}/virtual-restore-plans`,
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
    url: `/virtual-restore-plans/${planId}`,
  });

const updateRestorePlan = data =>
  baseApi
    .request({
      method: 'patch',
      url: `/virtual-restore-plans/${data.id}`,
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
    url: `/virtual-restore-plans/${id}`,
  });
const rescan = ids =>
  baseApi.request({
    method: 'post',
    url: '/virtuals/rescan',
    data: ids
  });

// 获取备份计划列表
const fetchVirtualBackupPlanList = () =>
  baseApi.request({
    method: 'get',
    url: '/virtual-backup-plans/list'
  }).then(res => {
    const { data: plans } = res.data;
    plans.forEach(p => {
      if (p.config.timePoints) {
        p.config.timePoints = timePoints2Obj(p.config.timePoints);
      }
    });
    return res;
  });

const deletePlan = (id, delBackupResults) =>
  baseApi.request({
    method: 'delete',
    url: `/virtual-backup-plans/list/${id}`,
    data: { delBackupResults }
  });

// 根据备份计划获取虚拟机备份进度
const getVirtualsBackupResult = id =>
  baseApi.request({
    method: 'get',
    url: `/virtual-backup-plans/virtuals/details/${id}`
  });

const getVirtualByServerId = id =>
  baseApi.request({
    method: 'get',
    url: `/virtuals/hosts/server/vmList/${id}`
  });

const stopAllBackupPlan = id =>
  baseApi.request({
    method: 'put',
    url: `/virtual-backup-plans/stop-all/${id}`
  });

// 删除单个虚拟机主机下的单个虚拟机（虚拟机主机管理）
const deleteVirtualInServerHost = id =>
  baseApi.request({
    method: 'delete',
    url: `/virtuals/hosts/server/vmList/${id}`
  });

// 删除单个虚拟机备份下的单个备份集
const deleteVirtualBackupResult = id =>
  baseApi.request({
    method: 'delete',
    url: `/virtual-backup-results/${id}`
  });

/**
 * 修改大备份计划中虚拟机的数量，只支持添加
 * @param {*} planId 大备份计划id
 * @param {*} idList 虚拟机id列表
 */
const updateBackupPlanForVirtual = (planId, idList) =>
  baseApi.request({
    method: 'patch',
    url: `/virtuals/virtual-backup-plans/multiple/${planId}`,
    data: idList
  });

// 虚拟机添加恢复计划：根据已选的主机id获取可选恢复磁盘名列表
const fetchDisksByHostId = hostId =>
  baseApi.request({
    method: 'get',
    url: `/virtuals/hosts/${hostId}/disks`
  });

// 虚拟机接管创建多个连接
const createLinks = data =>
  baseApi.request({
    method: 'post',
    url: '/virtual-links',
    data
  });

const fetchLinks = () =>
  baseApi.request({
    method: 'get',
    url: '/virtual-links',
  });

const deleteLink = id =>
  baseApi.request({
    method: 'delete',
    url: `/virtual-links/${id}/fail-over`
  });

const failOverLink = (id, timePoint) =>
  baseApi.request({
    method: 'patch',
    url: `/virtual-links/${id}/fail-over`,
    data: { timePoint }
  });


const failBackLink = (id, timePoint) =>
  baseApi.request({
    method: 'patch',
    url: `/virtual-links/${id}/fail-back`,
    data: { timePoint }
  });

const modifyLinkStrategy = (id, data) =>
  baseApi.request({
    method: 'patch',
    url: `/virtual-links/${id}/sync-strategy`,
    data
  });

const fetchOperationRecords = id =>
  baseApi.request({
    method: 'get',
    url: `/virtual-links/${id}/operations`
  });

const fetchTimePoints = id =>
  baseApi.request({
    method: 'get',
    url: `/virtual-links/${id}/timePoints`
  });

// 启动单个虚拟机
const ModifyOneStartup = id =>
  baseApi.request({
    method: 'patch',
    url: `/virtuals/${id}/modify-startup-state`,
  });

// 验证物理主机用户名、密码
const validatePassword = (id, data) =>
  baseApi.request({
    method: 'post',
    url: `/virtuals/hosts/server/list/${id}/validate-password`,
    data
  });

// 批量虚拟机开机自启
const multiBootPower = (id, data) =>
  baseApi.request({
    method: 'post',
    url: `/virtuals/hosts/server/list/${id}/boot-power`,
    data
  });

export {
  fetchAll,
  fetchOne,
  modifyOne,
  fetchBackupPlans,
  fetchBackupResults,
  createVirtualBackupPlan,
  createMultipleVirtualBackupPlan,
  updateVirtualBackupPlan,
  deleteVirtualBackupPlan,
  fetchBackupOperation,
  createSingleRestorePlan,
  fetchRestorePlans,
  fetchRestoreRecords,
  createRestorePlan,
  deleteRestorePlan,
  updateRestorePlan,
  fetchRestoreOperation,
  rescan,
  fetchVirtualBackupPlanList,
  getVirtualsBackupResult,
  getVirtualByServerId,
  deletePlan,
  stopAllBackupPlan,
  deleteVirtualInServerHost,
  deleteVirtualBackupResult,
  updateBackupPlanForVirtual,
  fetchDisksByHostId,
  createLinks,
  fetchLinks,
  deleteLink,
  failOverLink,
  failBackLink,
  modifyLinkStrategy,
  fetchOperationRecords,
  fetchTimePoints,
  ModifyOneStartup,
  validatePassword,
  multiBootPower
};
