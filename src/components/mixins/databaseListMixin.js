import {
  databaseStateMapping,
  databaseRoleMapping,
} from '../../utils/constant';

const listMixin = {
  data() {
    const roleFilters = [
      { text: '无连接', value: 0 },
      { text: '主库', value: 1 },
      { text: '备库', value: 2 }
    ];
    return {
      items: [],
      currentItems: [],
      roleFilters,
      selectedId: '',
      createModalVisible: false,
      updateModalVisible: false,
      btnLoading: false,
      tabLoading: true,
      inputSearch: '',
      filterItem: '',
      currentPage: 1,
      pagesize: 10,
      selectTag: 'name'
    };
  },
  filters: {
    filterBySearch(tableData, arg) { // 未带搜索项
      if (!tableData) {
        return [];
      }
      return tableData.filter(v => !v.name || v.name.toLowerCase().includes(arg.toLowerCase()));
    },
    filterByTag(tableData, arg, tag) { // 带有搜索项
      if (!tableData) {
        return [];
      }
      return tableData.filter(v => !v[tag] || v[tag].toLowerCase().includes(arg.toLowerCase()));
    },
    filterByPage(data, currentPage, pagesize) {
      if (!data) {
        return [];
      }
      return data.slice((currentPage - 1) * pagesize, currentPage * pagesize);
    }
  },
  watch: {
    inputSearch() {
      if (this.inputSearch === '') {
        this.filterItem = '';
        this.currentPage = 1;
      }
    }
  },
  computed: {
    selectedDb() {
      return this.items.find(item => item.id === this.selectedId) || {};
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    selectOne(db) {
      this.selectedId = db.id;
      this.updateModalVisible = true;
    },
    filterChange(filter) {
      this.currentPage = 1;
      if (filter.role && filter.role.length === 0) { // 重置
        this.currentItems = this.items;
      } else { // 筛选
        this.currentItems = this.items.filter(item => filter.role.includes(item.role));
      }
    },
    // 更新后的回调
    // updateDb(data) {
    //   const { id } = data;
    //   // 使用splice替换oracles列表中被选中的记录
    //   this.items.splice(this.items.findIndex(db => db.id === id), 1, data);
    //   this.selectedId = '';
    // },
    stateFormatter(row, column, cellValue) {
      return databaseStateMapping[cellValue];
    },
    databaseRoleFormatter(row, column, cellValue) {
      return databaseRoleMapping[cellValue];
    },
    databaseRole(role) {
      return databaseRoleMapping[role];
    },
    databaseState(state) {
      return databaseStateMapping[state];
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
    searchByName() {
      this.filterItem = this.inputSearch;
      this.currentPage = 1;
    },
    handleSizeChange(size) {
      this.pagesize = size;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    }
  },
};
// eslint-disable-next-line
export { listMixin };
