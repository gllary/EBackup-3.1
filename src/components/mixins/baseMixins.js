import dayjs from 'dayjs';

const baseMixin = {
  filters: {
    // 转化持续时间
    durationFilter(value = 0) {
      const hourSeconds = 60 * 60;
      const minuteSeconds = 60;
      const h = Math.floor(value / hourSeconds);
      const m = Math.floor((value % hourSeconds) / minuteSeconds);
      const s = value % minuteSeconds;
      if (!h && !m && !s) {
        return '0秒';
      }
      return `${h ? `${h}小时` : ''}${m ? `${m}分` : ''}${s ? `${s}秒` : ''} `;
    },
    NotNullfilter(data) {
      const tData = data.map(result => {
        Object.keys(result).forEach(i => {
          result[i] = (result[i] === null || result[i] === 'null') ? '' : result[i];
        });
        return result;
      });
      return tData;
    },
  },
  methods: {
    dateFmt(data) {
      return dayjs(data).format('YYYY-MM-DD HH:mm:ss');
    }
  }
};

export default baseMixin;
