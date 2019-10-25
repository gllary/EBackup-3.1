<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script>
export default {
  name: 'IIcon',
  props: ['name'],
  computed: {
    iconName() {
      return `#icon-${this.name}`;
    },
  },
};
</script>


