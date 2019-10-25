<template>
  <section>
    <i-icon :name="`${theme}-list-btn`"
            :class="`{ ${showType === 'list' ? 'active-btn' : 'inactive-btn'} }`"
            @click.native="switchList"></i-icon>
    <span class="switch-division">/</span>
    <i-icon :name="`${theme}-card-btn`"
            :class="`{ ${showType === 'card' ? 'active-btn' : 'inactive-btn'} }`"
            @click.native="switchCard"></i-icon>
  </section>
</template>
<script>
import themeMixin from '@/components/mixins/themeMixins';
export default {
  name: 'SwitchCard',
  mixins: [themeMixin],
  data() {
    return {
      showType: 'list'
    }
  },
  methods: {
    switchList() {
      this.showType = 'list';
      this.$emit('switch-list');
    },
    switchCard() {
      this.showType = 'card';
      this.$emit('switch-card');
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/db.scss';
</style>
