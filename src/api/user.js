import baseApi from './base';

const login = ({ loginName, password, rememberMe }) =>
  baseApi.request({
    method: 'post',
    url: '/login',
    data: {
      loginName,
      password,
      rememberMe,
    },
  });

const logout = ({ token }) =>
  baseApi.request({
    method: 'post',
    url: '/logout',
    data: {
      token,
    },
  });

const validateToken = token =>
  baseApi.request({
    method: 'get',
    url: '/validate',
    params: {
      token,
    },
  });

const validatePassword = password =>
  baseApi.request({
    method: 'post',
    url: '/validate-password',
    data: {
      password,
    },
  });

const createUserInfo = user =>
  baseApi.request({
    method: 'post',
    url: '/users',
    data: user,
  });

const getUsersInfo = () =>
  baseApi.request({
    method: 'get',
    url: '/users',
    data: {},
  });

const updateUserInfo = user =>
  baseApi.request({
    method: 'patch',
    url: `/users/${user.id}`,
    data: user,
  });

const changeUserInfo = user =>
  baseApi.request({
    method: 'patch',
    url: '/profile',
    data: user,
  });

const deleteUserInfo = id =>
  baseApi.request({
    method: 'delete',
    url: `/users/${id}`,
    data: {},
  });

const deleteUsersInfo = data =>
  baseApi.request({
    method: 'delete',
    url: '/users',
    data,
  });

export {
  login,
  logout,
  validateToken,
  validatePassword,
  createUserInfo,
  getUsersInfo,
  updateUserInfo,
  deleteUserInfo,
  deleteUsersInfo,
  changeUserInfo,
};
