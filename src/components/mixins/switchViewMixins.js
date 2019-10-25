const cardMixin = {
  data() {
    return {
      showType: 'list'
    };
  },
  updated() {
    const father = this.$refs.silkRibbon || [];
    const son = this.$refs.content || [];
    const height = son.length ? son[0].$el.offsetHeight : 0;
    for (let i = 0, j = father.length; i < j; i++) {
      father[i].style.height = `${height}px`;
    }
  },
  filters: {
    ribbonStyleFilter(type) {
      const ribbonStyle = {
        1: 'normal-silk-ribbon',
        2: 'abnormal-silk-ribbon',
        3: 'unkown-silk-ribbon',
        4: 'lsnAbnormal-silk-ribbon'
      };
      return ribbonStyle[type];
    },
    wrapStyleFilter(type) {
      const wrapStyle = {
        1: 'normal-wrap',
        2: 'abnormal-wrap',
        3: 'unkown-wrap',
        4: 'lsnAbnormal-wrap'
      };
      return wrapStyle[type];
    }
  },
  methods: {
    switchList() {
      if (this.showType === 'card') {
        this.showType = 'list';
        this.pageSize = 10;
        this.currentPage = 1;
      }
    },
    switchCard() {
      if (this.showType === 'list') {
        this.showType = 'card';
        this.pageSize = 9;
        this.currentPage = 1;
      }
    },
  }
};

export default cardMixin;
