import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { fetchDisksByHostId } from '@/api/virtuals';

const baseModalMixin = {
  props: {
    visible: {
      type: Boolean,
    }
  },
  data() {
    const validateCheckPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else {
        if (value !== this.formData.password) {
          callback(new Error('两次输入的密码不一致'));
        }
        callback();
      }
    };
    return {
      formData: {},
      originFormData: {},
      hiddenPassword1: true,
      validateCheckPassword
    };
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    }
  },
  methods: {
    // 点击取消按钮
    cancelButtonClick() {
      this.hasModifiedBeforeClose(() => {
        this.modalVisible = false;
      });
    },
    // 关闭之前 验证是否有修改
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
    },
    hasModifiedBeforeClose(fn) {
      if (isEqual(this.formData, this.originFormData)) {
        fn();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            fn();
          })
          .catch(() => { });
      }
    },
  }
};

const databaseModalMixin = {
  mixins: [baseModalMixin],
  props: {
    btnLoading: {
      type: Boolean,
    },
    data: {
      type: Object
    },
    action: {
      type: String
    }
  },
  data() {
    return {
      // 原始表单值
      hiddenPassword: true,
    };
  },
  computed: {
    title() {
      if (this.action === 'update') {
        return '更新数据库';
      } else if (this.action === 'query') {
        return '查看数据库';
      }
      return '添加数据库';
    },
    availableHosts() {
      const productHosts = this.$store.getters[`${this.type}Hosts`].filter(
        h => h.hostType === 1
      );
      return productHosts;
    },
  },
  methods: {
  },
  components: {
    InputToggle,
  },
};

const backupPlanModalMixin = {
  mixins: [baseModalMixin],
  props: {
    btnLoading: {
      type: Boolean,
    },
    backupPlan: {
      type: Object
    },
    action: {
      type: String
    }
  },
  computed: {
    title() {
      if (this.action === 'update') {
        return '更新备份计划';
      } else if (this.action === 'query') {
        return '查看备份计划';
      }
      return '添加备份计划';
    },
  },
  methods: {
    // 时间点去重排序
    filteredTimePoints(timePoints) {
      return Array.from(
        new Set(timePoints.map(p => p.value).filter(p => p))
      ).sort(
        (a, b) =>
          a.slice(0, 2) * 60 +
          a.slice(3, 5) -
          (b.slice(0, 2) * 60 +
          b.slice(3, 5))
      );
    },
    pruneFormData(formData) {
      const {
        name,
        timeStrategy,
        singleTime,
        startTime,
        datePoints,
        weekPoints,
        timePoints,
        hourInterval,
        minuteInterval,
        backupPath,
        backupSystem,
        ...other
      } = formData;
      let config;
      switch (timeStrategy) {
        case 0:
          config = { timeStrategy, singleTime, ...other };
          break;
        case 1:
          config = {
            timeStrategy,
            startTime,
            timeInterval: minuteInterval,
            ...other,
          };
          break;
        case 2:
          config = {
            timeStrategy,
            startTime,
            timeInterval: hourInterval * 60,
            ...other,
          };
          break;
        case 3:
          config = { timeStrategy, startTime, timePoints, ...other };
          break;
        case 4:
          config = {
            timeStrategy,
            startTime,
            weekPoints,
            timePoints,
            ...other,
          };
          break;
        case 5:
          config = {
            timeStrategy,
            startTime,
            datePoints,
            timePoints,
            ...other,
          };
          break;
        case 6:
          config = {
            timeStrategy,
            ...other
          };
          break;
        default:
      }
      if ([3, 4, 5].includes(timeStrategy)) {
        config.timePoints = this.filteredTimePoints(timePoints);
        // 全备+增备下按星期重排
        if (timeStrategy === 4) {
          config.weekPoints.sort((a, b) => a - b);
        }
      }
      return { name, config };
    }
  },
};

const restorePlanModalMixin = {
  mixins: [baseModalMixin],
  props: {
    btnLoading: {
      type: Boolean,
    },
    restorePlan: {
      type: Object
    },
    action: {
      type: String
    },
    details: {
      type: Object
    }
  },
  data() {
    return {
      // 原始表单值
      hiddenPassword: true,
    };
  },
  computed: {
    title() {
      if (this.action === 'update') {
        return '更新恢复计划';
      } else if (this.action === 'query') {
        return '查看恢复计划';
      }
      return '添加恢复计划';
    },
    // 用于恢复的设备
    // 1.易备环境下的设备
    // 2.type类型设备
    // 3.没有“安装”数据库
    availableHostsForRestore() {
      const ebackupHosts = this.$store.getters[`${this.type}Hosts`].filter(
        h => h.hostType === 2
      );
      return ebackupHosts;
    },
  },
  methods: {
    // 时间点去重排序
    filteredTimePoints(timePoints) {
      return Array.from(
        new Set(timePoints.map(p => p.value).filter(p => p))
      ).sort(
        (a, b) =>
          a.slice(0, 2) * 60 +
          a.slice(3, 5) -
          (b.slice(0, 2) * 60 +
          b.slice(3, 5))
      );
    },
    // 精简计划数据，返回不同时间策略下所需要的数据
    pruneFormData(formData) {
      const {
        name,
        timeStrategy,
        startTime,
        singleTime,
        timePoints,
        weekPoints,
        datePoints,
        recoveringStrategy,
        rPassword,
        ...other
      } = formData;
      let config;
      if (timeStrategy === 1) {
        config = { timeStrategy, recoveringStrategy, singleTime, ...other };
      } else if (timeStrategy === 2) {
        // 按周循环
        config = {
          timeStrategy,
          startTime,
          timePoints,
          weekPoints,
          ...other,
        };
      } else if (timeStrategy === 3) {
        // 按月循环
        config = {
          timeStrategy,
          startTime,
          timePoints,
          datePoints,
          ...other,
        };
      }
      if ([2, 3].includes(timeStrategy)) {
        config.timePoints = this.filteredTimePoints(timePoints);
      }
      return { name, config };
    },
    modalClosed() {
      // this.formData = { ...baseFormData };
      this.$refs.timeIntervalComponent.clearValidate();
      this.$refs.restorePlanCreateForm.clearValidate();
      this.hiddenPassword = true;
      this.hiddenPassword1 = true;
    },
    // 根据已选主机id获取可选恢复磁盘名(虚拟机恢复)
    changeHost(id, readyToFetch) {
      if (readyToFetch) {
        this.showLoading = true;
        this.hasHostIp = false;
        fetchDisksByHostId(id)
          .then(res => {
            const { data } = res.data;
            this.disks = data;
            this.formData.diskName = '';
            this.hasHostIp = true;
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {
            this.showLoading = false;
          });
      }
    },
  },
  components: {
    InputToggle,
  },
};

export { baseModalMixin, databaseModalMixin, restorePlanModalMixin, backupPlanModalMixin };
