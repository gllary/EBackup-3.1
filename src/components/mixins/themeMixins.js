import * as themeConf from '../../utils/theme.conf';

const themeMixin = {
  computed: {
    theme() {
      return this.$store.state.nav.theme;
    },
    themeColor() {
      return themeConf[this.theme];
    },
  }
};

export default themeMixin;
