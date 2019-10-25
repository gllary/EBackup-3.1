import baseApi from './base';

/**
 * 查询恢复验证结果列表
 * @param {Number} id 数据库id
 */
const getRestoreVerificationResultList = id =>
  baseApi.request({
    method: 'get',
    url: `/verify/restore/list/${id}`,
  });
/**
 * 查询一键接管验证结果列表
 * @param {Number} id 一键接管id
 */
const getTakeoverVerificationResultList = id =>
  baseApi.request({
    method: 'get',
    url: `/verify/takeover/list/${id}`,
  });

/**
 * 下载数据库一键接管验证报告
 * @param {Array} data 一键接管验证对象数组
 */
const downloadTakeoverVerificationReport = data => {
  baseApi.request({
    method: 'post',
    url: '/verify/takeover/report',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      scriptCharset: 'utf-8'
    },
    responseType: 'arraybuffer'
  });
};

/**
 * 下载数据库恢复验证报告
 * @param {Array} data 数据库恢复验证对象数组
 */
const downloadRestoreVerificationReport = data => {
  baseApi.request({
    method: 'post',
    url: '/verify/restore/report',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      scriptCharset: 'utf-8'
    },
    responseType: 'arraybuffer'
  });
};

/**
 * 获取数据库列表
 * @param {String} type 数据库类型
 */
const fetchDBList = type =>
  baseApi.request({
    method: 'get',
    url: `/${type}s`,
  });

/**
 * 获取连接信息
 * @param {String} type 数据库类型
 */
const fetchLinks = type =>
  baseApi.request({
    method: 'get',
    url: `/${type}-links`,
  });


const fetchLink = (type, id) =>
  baseApi.request({
    method: 'get',
    url: `/${type}s/${id}/${type}-links`,
  });

/**
 * 创建连接
 * @param {String} type 数据库类型
 * @param {Object} data 连接对象
 */
const createLinks = (type, data) =>
  baseApi.request({
    method: 'post',
    url: `/${type}-links`,
    data,
  });

/**
 * 创建双切任务
 * @param {String} type 数据库类型
 * @param {Object} data 双切对象
 */
const createSwitches = (type, data) =>
  baseApi.request({
    method: 'post',
    url: type === 'mysql' ? `/${type}-switch/switch-instances` : `/${type}-switches`,
    data,
  });

/**
 * 创建单切任务
 * @param {String} type 数据库类型
 * @param {Object} data 单切对象
 */
const createSingleSwitches = (type, data) =>
  baseApi.request({
    method: 'post',
    url: `/${type}-simple-switches`,
    data
  });

/**
 * 单切实例(mysql)
 * @param {String} type 数据库类型
 * @param {Object} data 切换对象
 */
const singleSwitchInstance = (type, data) =>
  baseApi.request({
    method: 'post',
    url: `/${type}-switch/disturbance-switch-instances`,
    data
  });

/**
 * 回切初始化(mysql)
 * @param {String} type 数据库类型
 * @param {Object} data 切换对象
 */
const readyToCutBack = (type, data) =>
  baseApi.request({
    method: 'post',
    url: `/${type}-switch/reinit-switch-instances`,
    data
  });

/**
 * 查询一个数据库连接信息
 * @param {*} type 数据库类型
 * @param {*} linkId 连接ID
 */
const fetchLinkByLinkId = (type, linkId) =>
  baseApi.request({
    method: 'get',
    url: `/${type}-links/${linkId}`,
  });

/**
 * 查询一个数据库连接下的所有切换操作
 * @param {String} type 数据库类型
 * @param {Number} linkId 连接ID
 */
const fetchSwitches = (type, linkId) =>
  baseApi.request({
    method: 'get',
    url: `/${type}-links/${linkId}/switches`,
  });

/**
 * 根据设备id获取该设备上的所有盘符
 * @param {String} type 数据库类型
 * @param {Number} id 设备id
 */
const fetchHostRootPath = (type, id) =>
  baseApi.request({
    method: 'get',
    url: `/${type}s/${id}/root-path`,
  });

/**
 * 根据盘符和设备id获取该盘符下的所有目录
 * @param {String} type 数据库类型
 * @param {Number} id 设备id
 * @param {String} data 盘符
 */
const fetchHostPath = (type, id, data) =>
  baseApi.request({
    method: 'post',
    url: `/${type}s/${id}/get-path`,
    data
  });

export {
  getRestoreVerificationResultList,
  getTakeoverVerificationResultList,
  downloadTakeoverVerificationReport,
  downloadRestoreVerificationReport,
  fetchDBList,
  fetchLinks,
  fetchLink,
  createLinks,
  createSwitches,
  createSingleSwitches,
  fetchLinkByLinkId,
  fetchSwitches,
  fetchHostRootPath,
  fetchHostPath,
  singleSwitchInstance,
  readyToCutBack
};
