const inspectionMixin = {
  data() {
    return {
      height: null
    };
  },
  computed: {
    configMsg() {
      return this.$store.state.nav.configMsg;
    },
    theme() {
      return this.$store.state.nav.theme;
    },
    inspectWeb() {
      if (this.configMsg.inspectWeb) {
        return {
          ip: this.configMsg.inspectWeb.ip,
          port: this.configMsg.inspectWeb.port,
          active: this.configMsg.inspectWeb.active
        };
      }
      return { ip: null, port: null, active: false };
    },
    inspectUrl() {
      if (this.inspectWeb.port) {
        return `${this.inspectWeb.ip}:${this.inspectWeb.port}`;
      }
      return this.inspectWeb.ip;
    },
    hasInspectConfig() {
      return this.inspectWeb.ip && this.inspectWeb.active;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.sendMsg) {
        this.sendMsg();
      }
    });
  },
  methods: {
    sendTheme(iframe) {
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          iframe.src = `${this.src}#theme=''`;
          iframe.src = `${this.src}#theme=${this.theme}`;
        });
      } else {
        iframe.onload = () => {
          iframe.src = `${this.src}#theme=''`;
          iframe.src = `${this.src}#theme=${this.theme}`;
        };
      }
    }
  },
};

export default inspectionMixin;
