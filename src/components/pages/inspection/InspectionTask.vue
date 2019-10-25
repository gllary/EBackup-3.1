<template>
  <div style="width: 100%; height: 100%;">
    <iframe :src="src"
            width="100%"
            class="iframe"
            frameborder="0"
            scrolling="auto"
            ref="inspectionTask"></iframe>
  </div>
</template>

<script>
import inspectionMixin from '@/components/mixins/inspectionMixins';
import { fetchAll as fetchAllOracle } from '@/api/oracle';
import { fetchAll as fetchAllSqlserver } from '@/api/sqlserver';
export default {
  name: 'InspectionTask',
  mixins: [inspectionMixin],
  computed: {
    src() {
      return `http://${this.inspectUrl}/inspect/ebackup/inspection`;
    }
  },
  watch: {
    theme() {
      const iframe = this.$refs['inspectionTask'];
      iframe.src = `${this.src}#theme=${this.theme}`;
    }
  },
  methods: {
    sendMsg() {
      const iframe = this.$refs['inspectionTask'];
      this.sendTheme(iframe);
    }
  }
}
</script>
<style scoped lang="scss">
.iframe {
  height: calc(100vh - 110px);
  width: calc(100% + 20px);
}
</style>