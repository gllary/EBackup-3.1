<template>
  <section>
    <el-input :value="value"
              :type="hiddenPassword ? 'password' : 'text'"
              @input="inputChange"
              :disabled="disabled"
              @paste.native.capture.prevent
              @contextmenu.native.capture.prevent
              @copy.native.capture.prevent
              @cut.native.capture.prevent
              :hidden.sync="hiddenPassword">
      <i-icon :class="$style.icon"
              slot="suffix"
              :name="iconName"
              @click.native="toggleDisplay"></i-icon>
    </el-input>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';

export default {
  name: 'input-toggle',
  props: {
    value: String,
    hidden: Boolean,
    disabled:Boolean
  },
  computed: {
    iconName() {
      return this.hiddenPassword ? 'eye-off' : 'eye';
    },
    hiddenPassword: {
      get() {
        return this.hidden;
      },
      set(value) {
        this.$emit('update:hidden', value);
      },
    },
  },
  methods: {
    toggleDisplay() {
      this.hiddenPassword = !this.hiddenPassword;
    },
    inputChange(value) {
      this.$emit('input', value);
    },
  },
  components: {
    IIcon,
  },
};
</script>
<style module>
.icon {
  margin-top: 9px;
}
</style>
