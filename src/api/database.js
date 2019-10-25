import baseApi from './base';
import fileBaseApi from './fileBase';
// 获取数据库列表数据
const fetchListData = type =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'get',
    url: `/${type}s`,
  });
// 获取单个数据库详情
const fetchOne = (type, id) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'get',
    url: `/${type}s/${id}`,
  });
// 创建数据库
const createDatabase = (type, data) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'post',
    url: `/${type}s`,
    data
  });
// 修改数据库，主要为修改密码
const updateDatabase = (type, data) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'patch',
    url: `/${type}s/${data.id}`,
    data
  });
// 删除数据库
const deleteDatabase = (type, id) =>
  (type === 'file-host' ? fileBaseApi : baseApi).request({
    method: 'delete',
    url: `/${type}s/${id}`,
  });
export {
  fetchListData,
  fetchOne,
  createDatabase,
  updateDatabase,
  deleteDatabase
};
