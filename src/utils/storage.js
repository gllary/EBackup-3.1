import Cookies from 'js-cookie';

const TOKEN = 'TOKEN';

const userToken = {
  save(token, expires) {
    Cookies.set(TOKEN, token, { expires });
  },
  get() {
    return Cookies.get(TOKEN);
  },
  remove() {
    Cookies.remove(TOKEN);
  }
};

// eslint-disable-next-line
const _localStorage = {
  enable() {
    if (window.localStorage) {
      return true;
    }
    return false;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const val = localStorage.getItem(key);
    if (!val) return null;
    return JSON.parse(val);
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

export { userToken, _localStorage };
