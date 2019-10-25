<template>
  <span>{{ value | durationFilter}}</span>
</template>
<script>
import baseMixin from './mixins/baseMixins';
export default {
  name: 'Timer',
  props: ['val'],
  mixins: [baseMixin],
  data(){
      return {
          value: '-',
          interverObj: null
      }
  },
  mounted(){
    this.value = this.val;
    clearInterval(this.interverObj);
    this.interverObj = setInterval(() => {
        this.value = this.value + 1;
    }, 1000);
  },
  watch: {
      val(newVal){
          this.value = newVal;
          clearInterval(this.interverObj);
          this.interverObj = setInterval(() => {
              this.value = this.value + 1;
          }, 1000);
      }
  },
  destroyed(){
      clearInterval(this.interverObj);
  }
};
</script>


