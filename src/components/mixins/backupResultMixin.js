import dayjs from 'dayjs';
import { backupResultMapping, backupTypeMapping, yesOrNoMapping } from '@/utils/constant';
import { cancelHighlight } from '@/api/home';

const backupResultMixin = {
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
  },
  data() {
    return {
      showFilter: false,
      filterValue: '',
      filterForm: {
        fileName: '',
        startTime: '',
        endTime: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近三天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  filters: {
    NotNullfilter(data) {
      const tData = data.map(result => {
        Object.keys(result).forEach(i => {
          result[i] = (result[i] === null || result[i] === 'null') ? '' : result[i];
        });
        return result;
      });
      return tData;
    },
    filterFn(data, filter) {
      const tData = data.filter(e => {
        let flag = true;
        // eslint不允许使用for...in和for...of，若想跳出循环，解决方法一：使用原始的for循环
        const keys = Object.keys(filter);
        for (let i = 0; i < keys.length; i++) {
          if (filter[keys[i]]) {
            if (keys[i].includes('Time')) {
              if (dayjs(e[keys[i]]) < dayjs(filter[keys[i]][0]) || dayjs(e[keys[i]]) > dayjs(filter[keys[i]][1])) {
                flag = false;
                break;
              }
            } else if (!e[keys[i]].includes(filter[keys[i]])) {
              flag = false;
              break;
            }
          }
        }
        // 解决方法二：使用foreach抛异常来终止循环
        // try {
        //   Object.keys(filter).forEach(i => {
        //     if (filter[i]) {
        //       if (i.includes('Time')) {
        //         if (dayjs(e[i]) < dayjs(filter[i][0]) || dayjs(e[i]) > dayjs(filter[i][1])) {
        //           flag = false;
        //           throw new Error('跳出');
        //         }
        //       } else if (!e[i].includes(filter[i])) {
        //         flag = false;
        //         throw new Error('跳出');
        //       }
        //     }
        //   });
        // } catch (error) {
        //   console.log(error);
        // }
        return flag;
      });
      return tData;
    },
    backupTypeFilter(val) {
      return backupTypeMapping[val];
    },
    logTypeFilter(val) {
      return yesOrNoMapping[val];
    }
  },
  methods: {
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return backupResultMapping[stateCode];
    },
    // 点击恢复按钮
    restoreBtnClick({ id }) {
      this.$emit('single-restore-btn-click', id);
    },
    deleteResult({ id }) {
      this.$emit('delete-result', id);
    },
    endTimeSortMethod(a, b) {
      return dayjs(a) - dayjs(b);
    },
    filterHandler() {
      this.filterValue = Object.assign({}, this.filterForm);
    },
    resetFn() {
      this.$refs.filterForm.resetFields();
      this.filterHandler();
    },
    expandChange(row, expandedRows) {
      // 展开失败的扩展表
      if (expandedRows.includes(row) && row.state === 1) {
        cancelHighlight(row.id, this.machineType).then(() => {
          // console.log('ok', res);
        });
      }
    },
  },
  computed: {
    buttonIcon() {
      return this.showFilter ? 'el-icon-arrow-down' : 'el-icon-arrow-right';
    },
  },
};

export default backupResultMixin;
