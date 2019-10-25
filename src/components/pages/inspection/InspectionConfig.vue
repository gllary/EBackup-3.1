<template>
  <iframe :src="src"
          width="100%"
          class="iframe"
          scrolling="auto"
          frameborder="0"
          ref="inspectionConfig"></iframe>
</template>

<script>
import inspectionMixin from '@/components/mixins/inspectionMixins';
export default {
  name: 'InspectionConfig',
  mixins: [inspectionMixin],
  data() {
    return {
    };
  },
  computed: {
    src() {
      return `http://${this.inspectUrl}/inspect/ebackup/system/params/config`
    }
  },
  watch: {
    theme() {
      const iframe = this.$refs['inspectionConfig'];
      iframe.src = `${this.src}#theme=${this.theme}`;
    }
  },
  methods: {
    sendMsg() {
      const iframe = this.$refs['inspectionConfig'];
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