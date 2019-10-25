<template>
  <div>
    <iframe :src="src"
            frameborder="0"
            scrolling="auto"
            width="100%"
            class="iframe"
            ref="inspectionTemplate"></iframe>
  </div>
</template>

<script>
import inspectionMixin from '@/components/mixins/inspectionMixins';
export default {
  name: 'InspectionTemplate',
  mixins: [inspectionMixin],
  data() {
    return {
    };
  },
  computed: {
    src() {
      return `http://${this.inspectUrl}/inspect/ebackup/template`;
    }
  },
  watch: {
    theme() {
      const iframe = this.$refs['inspectionTemplate'];
      iframe.src = `${this.src}#theme=${this.theme}`;
    }
  },
  methods: {
    sendMsg() {
      const iframe = this.$refs['inspectionTemplate'];
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
