const applyFilterMethods = (originData, methods) =>
  methods.reduce((a, b) => a.filter(b), originData);

const keepTwoDecimalFull = num =>
  Math.round(num * 100) / 100;

const fmtSizeFn = num => {
  let size = null;
  if (!num) {
    return num;
  }
  const process = num / 1024;
  if (process < 1) {
    return `${num}B`;
  }
  if (process < 1024) {
    size = `${keepTwoDecimalFull(process)}K`;
  } else {
    const res = process / 1024 / 1024;
    if (res < 1) {
      size = `${keepTwoDecimalFull(res * 1024)}M`;
    } else if (res > 1024) {
      size = `${keepTwoDecimalFull(res / 1024)}T`;
    } else {
      size = `${keepTwoDecimalFull(res)}G`;
    }
  }
  return size;
};

const maxLengthFn = (w, maxLength) => {
  if (w) {
    const t = String(w).replace(/[\u4e00-\u9fa5]/g, ''); // 替换中文
    return (w.length - t.length) * 2 + t.length > maxLength; // 判断长度
  }
  return false;
};

const validateLength = length =>
  (rule, value, callback) => {
    if (maxLengthFn(value, length)) {
      callback(new Error(`长度在${length}个字符以内，注：中文占2个字符`));
    } else {
      callback();
    }
  };
// eslint-disable-next-line
export {
  applyFilterMethods,
  fmtSizeFn,
  keepTwoDecimalFull,
  maxLengthFn,
  validateLength
};
