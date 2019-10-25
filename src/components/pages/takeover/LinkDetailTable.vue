<template>
  <section>
    <el-table :data="records"
              :default-sort="{prop: 'switchTime', order: 'descending'}">
      <el-table-column label="操作时间"
                       min-width="150"
                       align="center"
                       prop="switchTime"></el-table-column>
      <el-table-column label="持续时间"
                       min-width="150"
                       align="center"
                       prop="consume">
        <template slot-scope="scope">
          <span v-if="!scope.row.consume">-</span>
          <timer v-else-if="scope.row.state === 1" :val="scope.row.consume"></timer>
          <span v-else>{{ scope.row.consume | durationFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="切换内容"
                       min-width="200"
                       header-align="center"
                       prop="content"></el-table-column>
      <el-table-column label="切换形式"
                       min-width="120"
                       align="center"
                       :formatter="switchManualFormatter"
                       prop="manual"></el-table-column>
      <el-table-column label="状态"
                       width="120"
                       align="center"
                       prop="state">
        <template slot-scope="scope">
          <i :class="switchStateIconClass(scope.row.state)"></i>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import takeoverMixin from '@/components/mixins/takeoverMixins';
import baseMixin from '@/components/mixins/baseMixins';
import Timer from '@/components/Timer';
export default {
  name: 'LinkDetailTable',
  mixins: [takeoverMixin, baseMixin],
  components: {
    Timer
  },
  props: {
    records: {
      type: Array,
      required: true
    }
  },
  methods: {
    switchStateIconClass(value) {
      switch (value) {
        case 0:
          return ['el-icon-time', this.$style.waitingColor];
        case 1:
          return ['el-icon-loading'];
        case 2:
          return ['el-icon-success', this.$style.successColor];
        case 3:
          return ['el-icon-error', this.$style.errorColor];
        default:
          return ['el-icon-remove-outline'];
      }
    },
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
@import '@/style/color.scss';
</style>

