import { getMonitorInfo } from '@/api/home';
import { paginationMixin, filterMixin, sortMixin } from './commonMixin';
import themeMixin from './themeMixins';
import {
  databaseStateMapping,
  databaseRoleMapping
} from '../../utils/constant';
import {
  fetchListData,
  createDatabase,
  updateDatabase,
  deleteDatabase
} from '../../api/database';


const tableMixin = {
  mixins: [paginationMixin, filterMixin, sortMixin, themeMixin],
  data() {
    return {
      createModalVisible: false,
      btnLoading: false,
      inputSearch: '',
      tableData: [],
      action: 'create',
      currentSelectData: null,
      defaultSort: { prop: 'createTime', order: 'descending' },
      objectType: ''
    };
  },
  computed: {
    configMsg() {
      return this.$store.state.nav.configMsg;
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // 从服务器获取所有的数据库
    fetchData() {
      fetchListData(this.databaseType).then(res => {
        const { data } = res.data;
        this.tableData = Array.isArray(data) ? data : [];
      }).catch(error => {
        this.$message.error(error);
      });
    },
    databaseState(state) {
      return databaseStateMapping[state];
    },
    databaseRole(role) {
      return databaseRoleMapping[role];
    },
    roleTagType(role) {
      switch (role) {
        case 1:
          return '';
        case 0:
        case 2:
          return 'info';
        default:
          return '';
      }
    },
    stateTagType(state) {
      switch (state) {
        case 1:
          return 'success';
        case 2:
        case 3:
          return 'danger';
        case 4:
          return 'warning';
        default:
          return '';
      }
    },
    addFn() {
      this.createModalVisible = true;
      this.action = 'create';
      this.currentSelectData = null;
    },
    modifyDb(row) {
      this.createModalVisible = true;
      this.action = 'update';
      this.currentSelectData = row;
    },
    confirmCall(data, type) {
      this.btnLoading = true;
      (type === 'create' ? createDatabase(this.databaseType, data) : updateDatabase(this.databaseType, data)).then(res => {
        const { message } = res.data;
        this.fetchData();
        this.createModalVisible = false;
        this.$message.success(message);
      }).catch(error => {
        this.$message.error(error);
      }).then(() => {
        this.btnLoading = false;
      });
    },
    delete(row, title) {
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteDatabase(this.databaseType, row.id)
            .then(() => {
              this.fetchData();
              this.$message.success({
                message: '删除成功!',
              });
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(() => { });
    },
    linkMonitor(row) {
      const objId = row.id;
      getMonitorInfo(objId, this.objectType).then(res => {
        const { data } = res.data;
        const { token, id, origin } = data;
        const popup = window.open(`${origin}/monitor/common`);
        window.addEventListener('message', e => {
          if (e.origin === origin && e.data === 'monitor') {
            const obj = {
              token,
              id,
              type: `${this.objectType}Dashboard`,
              theme: this.theme
            };
            popup.postMessage(obj, origin);
          }
        });
      }).catch(error => {
        this.errorMessage(error);
      });
    }
  },
};
export default tableMixin;
