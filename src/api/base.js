import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store/index';
import router from '../router/index';
import types from '../store/type';

const baseApi = axios.create({
  baseURL: '/api/v1',
  // @FIXME: 没有设定超时时间
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// eslint-disable-next-line
baseApi.interceptors.response.use(undefined, error => {
  if (error.message.indexOf('timeout') >= 0) {
    return Promise.reject('请求超时，请检查网络连接');
  }
  const { data, status } = error.response;
  if (status === 401) {
    // 401 NOT AUTHORIZED = token失效／过期
    // 需要重新登陆
    const { message } = data;
    Message.warning({
      message,
    });
    store.commit(types.CLEAR_LOGININFO);
    router.push('/login');
    return Promise.reject();
  } else if (status === 403) {
    // 403 FORBIDDEN 权限不足
    // lisence无效或过期
    const { message } = data;
    Message.warning({
      message,
    });
    store.commit(types.CLEAR_LOGININFO);
    router.push({ name: 'lisenceNotAvail' });
    return Promise.reject();
  }
  const errorMsg = `${error.response.data.message}(${
    error.response.data.code
  })`;
  // eslint-disable-next-line
  return Promise.reject(errorMsg);
});

export default baseApi;
