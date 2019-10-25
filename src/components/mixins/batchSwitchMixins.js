import { createOne } from '../../api/switch';

const batchSwitchMixin = {
  data() {
    return {
      switchDialog: false,
      flag: 0
    };
  },
  watch: {
    switchDialog(newVal) {
      if (newVal) {
        this.clearTimer();
      } else {
        this.setTimer();
      }
    }
  },
  methods: {
    batchSwitch() {
      this.switchDialog = true;
    },
    addSwitchPlan(data) {
      this.btnLoading = true;
      createOne(data)
        .then(res => {
          const { data: switchPlan, message } = res.data;
          const path = this.$route.path;
          if (path.substring(path.lastIndexOf('/') + 1, path.length) === 'takeover') { // 接管入口
            this.$router.push({
              name: 'oracleSwitchDetail',
              params: { id: switchPlan.id }
            });
          } else { // 灾备入口
            this.planList.unshift(switchPlan);
            this.$message.success(message);
          }
          this.switchDialog = false;
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    }
  },
  computed: {
    switchLinks() {
      return this.links ? this.links.map(item => {
        const linkIds = item.databaseLinks.filter(databaseLink => databaseLink.state !== 1).map(i => i.id);
        return Object.assign({ flag: this.flag, linkIds }, item);
      }) : [];
    },
    dbType() {
      if (this.databaseType === 'oracle') {
        return 1;
      } else if (this.databaseType === 'sqlserver') {
        return 2;
      }
    },
  }
};
export default batchSwitchMixin;
