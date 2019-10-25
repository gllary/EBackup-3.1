const operationStateMapping = {
  0: '未开始',
  1: '进行中',
  2: '已结束',
  3: '失败'
};

const backupResultMapping = {
  0: '成功',
  1: '失败',
};

const restoreResultMapping = {
  0: '成功',
  1: '失败'
};

const backupStrategyMapping = {
  0: '全备',
  1: '全备+增备',
  2: '全备+日志备份',
  3: 'CDP持续备份'
};

// 文件备份策略

const filehostBackupStrategyMapping = {
  1: '同步',
  2: '增量不删减'
};

const logStrategyMapping = {
  1: '备份日志',
  2: '不备份日志'
};

const timeStrategyMapping = {
  0: '单次',
  1: '按分钟循环',
  2: '按小时循环',
  3: '按天循环',
  4: '按周循环',
  5: '按月循环',
  6: '立即'
};

const weekMapping = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日',
};

const filehostBackupTypeMapping = {
  1: '文件备份',
  2: '卷备份',
  3: '系统备份'
};

const filehostRestoreTypeMapping = {
  1: '文件恢复',
  2: '卷恢复'
};

const restoreTimeStrategyMapping = {
  1: '单次执行',
  2: '按周循环',
  3: '按月循环',
};

const recoveringStrategyMapping = {
  1: '覆盖',
  2: '创建副本',
  3: '跳过',
};
// 由于设计不清 将 0:未知 修改为 3:未知 @0619
// 0626 添加监听异常状态
const databaseStateMapping = {
  1: '正常',
  2: '异常',
  3: '未知',
  4: '监听异常',
};
const databaseRoleMapping = {
  0: '无连接',
  1: '主库',
  2: '备库',
};

// 设备类型
const hostTypeMapping = {
  1: '生产环境',
  2: '易备环境',
};

// 系统类别
const sysTypeMapping = {
  // 0: '通用',
  1: 'Windows Share',
  2: 'Linux NFS',
  3: 'Windows NFS'
};

// Windows系统版本
const windowsTypeMapping = {
  1: '2003',
  2: '2008及以上'
};

// oracle版本
const oracleVersionMapping = {
  1: '10G',
  2: '11G',
  3: '12C'
};

const pathTypeMapping = {
  1: '共享文件夹路径',
  2: 'NFS路径'
};
// 使用类别
const useTypeMapping = {
  1: 'oracle',
  2: 'sqlserver',
  3: '文件',
  4: '虚拟机',
  5: 'mysql',
  6: 'db2',
  7: '达梦数据库',
  8: '应用服务器',
  9: 'sybase',
  10: 'cache',
  11: 'insql',
  12: 'informix',
  13: 'postgresql'
};
// 保留策略类型
const keepStrategyMapping = {
  0: '不启用策略',
  1: '副本保留策略',
  2: '时间策略'
};

// 端口管理设备类别
const portHostTypeMapping = {
  1: 'sqlserver',
  2: 'oracle',
  3: '文件',
  4: '虚拟机',
  5: 'mysql',
  6: 'db2',
  7: '达梦数据库',
  8: '应用服务器',
  9: 'sybase',
  10: 'cache',
  11: 'insql',
  12: 'informix',
  13: 'postgresql'
};

const keepDateMapping = {
  1: '按周保留',
  2: '按月保留'
};

const systemStateMapping = {
  0: '启用',
  1: '禁用',
};

// 设备包含的用途类型
const databaseTypeMapping = {
  1: 'oracle',
  2: 'sqlserver',
  4: '虚拟机',
  5: 'mysql',
  6: 'db2',
  7: '达梦数据库',
  8: '应用服务器',
  9: 'sybase',
  10: 'cache',
  11: 'insql',
  12: 'informix',
  13: 'postgresql'
};

// 数据库连接状态
const linkStateMapping = {
  1: '正在初始化',
  2: '正常',
  3: '异常不可接管',
  4: '异常可接管',
  5: '待修复',
  6: '修复中'
};

// 是否切换IP
const switchIpMapping = {
  1: '切换IP',
  2: '保持IP',
};

// 切换操作状态
const switchStateMapping = {
  1: '切换中',
  2: '成功',
  3: '失败',
};

const switchManualMapping = {
  1: '手动',
  2: '自动',
};

const switchTypeMapping = {
  1: '切换实例',
  2: '切换IP',
  3: '解除连接',
  4: '单切恢复',
  5: '回切初始化',
  6: '单切实例',
  7: '单切IP'
};

const serviceIpMarkMapping = {
  1: '生产环境',
  2: '易备环境',
};

const virtualHostServerTypeMapping = {
  1: 'vCenter',
  2: '物理主机',
  3: 'FusionSphere',
  4: 'Hyper-V'
};

const backupTypeMapping = {
  1: '全备',
  2: '增备',
  3: '日志备份'
};

const yesOrNoMapping = {
  1: '是',
  2: '否'
};

// 首页数据库详情路由(不含虚拟机)
const dbDetailRouterMapping = {
  1: 'oracleDetail',
  2: 'sqlserverDetail',
  5: 'mysqlDetail',
  6: 'db2Detail',
  7: 'dmDetail',
  9: 'sybaseDetail',
  10: 'cacheDetail',
  11: 'insqlDetail',
  12: 'informixDetail',
  13: 'postgresqlDetail'
};

// 数据库类型
const dbTypeMapping = {
  1: 'oracle',
  2: 'sqlserver',
  5: 'mysql',
  6: 'db2',
  7: 'dm',
  9: 'sybase',
  10: 'cache',
  11: 'insql',
  12: 'informix',
  13: 'postgresql'
};

// 首页数据库一键接管
const dbTakeOverRouterMapping = {
  1: 'oracleLinkDetail',
  2: 'sqlserverLinkDetail',
  3: 'applicationLinkDetail',
  4: 'insqlLinkDetail',
  5: 'mysqlLinkDetail'
};

// 首页虚拟机接管详情路由
const vmTakeOverRouterMapping = {
  1: 'vmwareLinkDetail',
  2: 'fusionSphereLinkDetail',
  3: 'hyperVLinkDetail'
};

// 首页虚拟机详情路由
const vmDetailRouterMapping = {
  1: 'vmwareDetail',
  2: 'fusionSphereDetail',
  3: 'hyperVDetail'
};

const vmTypeMapping = {
  1: 'VMware',
  2: '华为虚拟机',
  3: 'Hyper-V'
};

const virtualMapping = {
  1: 'vmware',
  2: 'fusionSphere',
  3: 'hyperV'
};

const serverTypeMapping = {
  1: [1, 2],
  2: [3],
  3: [4]
};

const syncStragegyMapping = { // 同步策略
  0: '实时同步',
  1: '按分钟',
  2: '按小时',
  3: '按天',
  4: '按周'
};

const syncLinkMapping = {
  0: '初始化',
  1: '同步',
  2: '故障转移',
  3: '故障恢复',
  4: '异常'
};

const syncOperationStateMapping = {
  0: '成功',
  1: '开始',
  2: '失败'
};

const syncOperationMapping = {
  0: '故障转移',
  1: '故障恢复',
  2: '解除连接'
};

const syncStateMapping = {
  0: '成功',
  1: '失败',
  2: '告警'
};

const deployStateMapping = {
  1: '部署中',
  2: '已启动',
  3: '部署失败',
  4: '启动失败',
  5: '已停止',
  6: '卸载中',
  7: '未知'
};

const storeTypeMapping = {
  1: 'NFS',
  2: 'CLOUD'
};

const verificationResultMapping = {
  inconsistent: '不一致',
  consistent: '一致'
};

const bootStateMapping = {
  0: '关机',
  1: '开机',
  2: '未知',
  starting: '开机中', // 自定义
  stopping: '关机中' // 自定义
};

const bootModeMapping = {
  0: '手动',
  1: '自动',
  2: '未知'
};

const restoreTypeMapping = {
  1: '全备+增备恢复',
  2: '日志恢复',
  3: '表级恢复'
};

const emailConfigTimeStrategyMapping = {
  1: '每天',
  2: '每周',
  3: '每月'
};

export {
  operationStateMapping,
  backupStrategyMapping,
  filehostBackupStrategyMapping,
  filehostBackupTypeMapping,
  filehostRestoreTypeMapping,
  logStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  backupResultMapping,
  restoreResultMapping,
  restoreTimeStrategyMapping,
  recoveringStrategyMapping,
  databaseStateMapping,
  hostTypeMapping,
  portHostTypeMapping,
  sysTypeMapping,
  windowsTypeMapping,
  oracleVersionMapping,
  pathTypeMapping,
  useTypeMapping,
  keepStrategyMapping,
  keepDateMapping,
  systemStateMapping,
  databaseTypeMapping,
  databaseRoleMapping,
  linkStateMapping,
  switchStateMapping,
  switchIpMapping,
  switchManualMapping,
  switchTypeMapping,
  serviceIpMarkMapping,
  virtualHostServerTypeMapping,
  backupTypeMapping,
  dbTypeMapping,
  dbDetailRouterMapping,
  dbTakeOverRouterMapping,
  vmTakeOverRouterMapping,
  vmDetailRouterMapping,
  vmTypeMapping,
  virtualMapping,
  serverTypeMapping,
  syncStragegyMapping,
  syncLinkMapping,
  syncStateMapping,
  syncOperationStateMapping,
  yesOrNoMapping,
  deployStateMapping,
  storeTypeMapping,
  syncOperationMapping,
  verificationResultMapping,
  bootStateMapping,
  bootModeMapping,
  restoreTypeMapping,
  emailConfigTimeStrategyMapping
};
