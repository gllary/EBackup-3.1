import { fmtSizeFn } from '@/utils/common';
import {
  linkStateMapping,
  databaseStateMapping,
  backupResultMapping,
  restoreResultMapping,
  useTypeMapping,
  dbTypeMapping,
  dbDetailRouterMapping,
  dbTakeOverRouterMapping,
  vmDetailRouterMapping,
  vmTypeMapping,
  vmTakeOverRouterMapping,
  syncLinkMapping
} from '../../utils/constant';
import { fetchBackup, fetchRestore, fetchTakeOver, fetchVirtualTakeOver } from '../../api/home';

const dashboardTabMixin = {
  data() {
    const clickPieJumpTo = {
      bs: 'backupSuccess',
      bf: 'backupFail',
      rs: 'restoreSuccess',
      rf: 'restoreFail',
      ts: 'takeoverSuccess',
      tf: 'takeoverFail'
    };
    return {
      databaseBackup: [],
      databaseRestore: [],
      databaseTakeOver: [],
      filehostBackup: [],
      filehostRestore: [],
      appTakeOver: [],
      vmBackup: [],
      vmRestore: [],
      vmTakeOver: [],
      activeName: 'databaseBackup',
      clickPieJumpTo,
      vmTypeMapping
    };
  },
  computed: {
    // 备份结果
    filterBackupStateFilter() {
      return this.mappingConvertToFilters(backupResultMapping);
    },
    // 数据库类型
    dbTypeFilter() {
      return this.mappingConvertToFilters(dbTypeMapping);
    },
    // 恢复结果
    filterRestoreStateFilter() {
      return this.mappingConvertToFilters(restoreResultMapping);
    },
    // 数据库状态
    dbStateFilter() {
      return this.mappingConvertToFilters(databaseStateMapping);
    },
    // 数据库连接状态
    dbLinkStateFilter() {
      return this.mappingConvertToFilters(linkStateMapping);
    },
    // 虚拟机接管状态
    vmLinkStateFilter() {
      return this.mappingConvertToFilters(syncLinkMapping);
    },
    // 虚拟机类型
    vmTypeFilter() {
      return this.mappingConvertToFilters(vmTypeMapping);
    },
  },
  methods: {
    fetchTabData() {
      fetchBackup()
        .then(res => {
          const { data } = res.data;
          this.databaseBackup = this.filterArray(data, 1);
          this.filehostBackup = this.filterArray(data, 2);
          this.vmBackup = this.filterArray(data, 3);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.infoLoading = false;
        });
      fetchRestore()
        .then(res => {
          const { data } = res.data;
          this.databaseRestore = this.filterArray(data, 1);
          this.filehostRestore = this.filterArray(data, 2);
          this.vmRestore = this.filterArray(data, 3);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.infoLoading = false;
        });
      fetchTakeOver()
        .then(res => {
          const { data } = res.data;
          const takeOverData = data.sort((a, b) => Date.parse(b.initFinishTime) - Date.parse(a.initFinishTime));
          const databaseData = takeOverData.filter(item => item.ddvType !== 3);
          const appData = takeOverData.filter(item => item.ddvType === 3);
          if (this.$route.name === 'dashboard') {
            this.databaseTakeOver = databaseData.slice(0, 5);
            this.appTakeOver = appData.slice(0, 5);
          } else if (this.checkType === this.clickPieJumpTo.ts) {
            this.databaseTakeOver = databaseData.filter(db => Number(db.overState) === 2);
            this.appTakeOver = appData.filter(item => Number(item.overState) === 2);
          } else if (this.checkType === this.clickPieJumpTo.tf) {
            this.databaseTakeOver = databaseData.filter(db => [3, 4, 5, 6].includes(Number(db.overState)));
            this.appTakeOver = appData.filter(item => [3, 4, 5, 6].includes(Number(item.overState)));
          } else {
            this.databaseTakeOver = databaseData;
            this.appTakeOver = appData;
          }
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.infoLoading = false;
        });
      fetchVirtualTakeOver()
        .then(res => {
          const { data } = res.data;
          const takeOverData = data.sort((a, b) => Date.parse(b.createTime) - Date.parse(a.createTime));
          if (this.$route.name === 'dashboard') {
            this.vmTakeOver = takeOverData.slice(0, 5);
          } else if (this.checkType === this.clickPieJumpTo.ts) {
            this.vmTakeOver = takeOverData.filter(db => [1, 2, 3].includes(db.linkState));
          } else if (this.checkType === this.clickPieJumpTo.tf) {
            this.vmTakeOver = takeOverData.filter(db => Number(db.linkState) === 4);
          } else {
            this.vmTakeOver = takeOverData;
          }
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.infoLoading = false;
        });
    },
    filterArray(data, type) {
      // 首页返回结果前五个元素，设备详情页返回所有结果
      if (data.length > 0) {
        const dataBySortAndType = data.filter(item => item.type === type).sort((a, b) => Date.parse(b.endTime) - Date.parse(a.endTime));
        if (this.$route.name === 'dashboard') {
          return dataBySortAndType.slice(0, 5);
        }
        switch (this.checkType) { // 根据入口选择是否按状态显示
          case this.clickPieJumpTo.bs:
            return dataBySortAndType.filter(db => db.backupState === 0);
          case this.clickPieJumpTo.bf:
            return dataBySortAndType.filter(db => db.backupState === 1);
          case this.clickPieJumpTo.rs:
            return dataBySortAndType.filter(db => db.restoreState === 0);
          case this.clickPieJumpTo.rf:
            return dataBySortAndType.filter(db => db.restoreState === 1);
          default:
            return dataBySortAndType;
        }
      }
      return [];
    },
    // 映射对象转数组对象
    mappingConvertToFilters(mapping) {
      // eslint-disable-next-line
      return Object.keys(mapping).map(key => {
        return {
          text: mapping[key],
          value: Number(key)
        };
      });
    },
    filterHandle(value, row, column) {
      // eslint-disable-next-line
      const property = column['property'];
      return row[property] === value;
    },
    dbType(row) {
      return useTypeMapping[row.ddvType];
    },
    dbDetailRouter(row) {
      return dbDetailRouterMapping[row.ddvType];
    },
    takeOverRouter(row) {
      return dbTakeOverRouterMapping[row.ddvType];
    },
    vmTakeOverRouter(row) {
      return vmTakeOverRouterMapping[row.vmType];
    },
    vmDetailRouter(row) {
      return vmDetailRouterMapping[row.ddvType];
    },
    vmType(row) {
      return vmTypeMapping[row.ddvType];
    },
    databaseTypeConverter(state) { // 主备库状态
      return databaseStateMapping[state];
    },
    linkTypeConverter(state) { // 连接状态
      return linkStateMapping[Number(state)];
    },
    vmLinkType(state) {
      return syncLinkMapping[state];
    },
    sizeFormatter(row, column, cellValue) {
      const size = fmtSizeFn(cellValue);
      return size || '-';
    },
    stateTagType(state) { // 主备库el-tag类型
      switch (Number(state)) {
        case 1:
          return 'success';
        case 2:
        case 4:
          return 'danger';
        case 3:
          return 'warning';
        default:
          return '';
      }
    },
    linkTagType(state) {
      switch (Number(state)) {
        case 1:
          return 'warning';
        case 2:
          return 'success';
        case 3:
          return 'danger';
        case 4:
          return 'danger';
        case 5:
          return 'info';
        default:
          return '';
      }
    },
    vmLinkTagType(state) {
      switch (state) {
        case 0:
        case 1:
          return 'warning';
        case 2:
        case 3:
        case 4:
          return 'danger';
        default:
          return 'primary';
      }
    }
  }
};
export default dashboardTabMixin;
