<template>
  <section>
    <el-table :data="tableData"
              @expand-change="expandChange"
              :default-sort="{ prop: 'startTime', order: 'descending' }">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form inline
                   :class="$style.resultDetailForm"
                   v-if="props.row.restoreType === 2">
            <el-form-item label="开始时间"
                          :class="$style.detailFormItem">
              <span>{{ props.row.filePaths[0].startTime }}</span>
            </el-form-item>
            <el-form-item label="文件名"
                          :class="$style.detailFormItem">
              <span>{{ props.row.filePaths[0].sourceFileName }}</span>
            </el-form-item>
            <el-form-item label="结束时间"
                          :class="$style.detailFormItem">
              <span>{{ props.row.filePaths[0].endTime }}</span>
            </el-form-item>
            <el-form-item label="源路径"
                          :class="$style.detailFormItem">
              <span>{{ props.row.filePaths[0].sourcePath }}</span>
            </el-form-item>
            <el-form-item label="持续时间"
                          :class="$style.detailFormItem">
              <span>{{ props.row.filePaths[0].consume | durationFilter }}</span>
            </el-form-item>
            <el-form-item label="存放路径"
                          :class="$style.detailFormItem">
              <span>{{ props.row.filePaths[0].targetPath }}</span>
            </el-form-item>
            <el-form-item label="状态"
                          :class="$style.detailFormItem">
              <span>
                <el-tag size="mini"
                        :type="props.row.filePaths[0].state === 0 ? 'success' : 'danger'">
                  {{ stateConverter(props.row.filePaths[0]) }}
                </el-tag>
              </span>
            </el-form-item>
            <el-form-item label="错误信息"
                          v-if="props.row.filePaths[0].state === 1"
                          :class="$style.detailFormItem">
              <span>{{ props.row.filePaths[0].message }}</span>
            </el-form-item>
            <el-form-item label="大小"
                          :class="$style.detailFormItem">
              <span>{{ fmtSizeFn(props.row.filePaths[0].sourceSize) }}</span>
            </el-form-item>
          </el-form>
          <el-table v-else
                    :data="props.row.filePaths"
                    style="font-size: 12px;"
                    :default-sort="{ prop: 'startTime', order: 'ascending' }">
            <el-table-column prop="sourceFileName"
                             label="文件名"
                             align="center"
                             min-width="100px"></el-table-column>
            <el-table-column prop="sourceSize"
                             label="大小"
                             align="center"
                             min-width="80px"
                             :formatter="fmtSize"></el-table-column>
            <el-table-column prop="sourcePath"
                             label="源文件路径"
                             align="center"
                             show-overflow-tooltip
                             min-width="150px"></el-table-column>
            <!-- 相同 -->
            <el-table-column prop="targetPath"
                             label="存放路径"
                             align="center"
                             show-overflow-tooltip
                             min-width="150px"></el-table-column>
            <el-table-column prop="pointPath"
                             label="nfs挂载路径"
                             show-overflow-tooltip
                             align="center"
                             min-width="150px"></el-table-column>
            <el-table-column label="恢复结果"
                             prop="state"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <el-tooltip :disabled="scope.row.state === 0"
                            :content="scope.row.message"
                            placement="right"
                            effect="light">
                    <i v-if="scope.row.state === 0"
                      class="el-icon-success"
                      :class="$style.successColor"></i>
                    <i v-else
                      class="el-icon-error"
                      @mouseenter="mouseenterFn(scope.row)"
                      :class="$style.errorColor"></i>
                  </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="计划名"
                       prop="planName"
                       align="center"
                       min-width="100"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="开始时间"
                       prop="startTime"
                       align="center"
                       min-width="150"></el-table-column>
      <el-table-column label="恢复设备IP"
                       prop="host.hostIp"
                       align="center"
                       min-width="150"></el-table-column>
      <el-table-column label="恢复类型"
                       prop="restoreType"
                       :formatter="fmtRestoreType"
                       align="center"
                       min-width="150"></el-table-column>
      <el-table-column label="恢复结果"
                       prop="state"
                       align="center"
                       min-width="100">
        <template slot-scope="scope">
          <i v-if="scope.row.state === 0"
             class="el-icon-success"
             :class="$style.successColor"></i>
          <i v-else
             class="el-icon-error"
             :class="$style.errorColor"></i>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import {
  filehostRestoreTypeMapping,
  restoreResultMapping
} from '@/utils/constant';
import baseMixin from '@/components/mixins/baseMixins';
import { fmtSizeFn } from '@/utils/common';
import { cancelRestoreHighlight } from '@/api/home';
export default {
  name: 'RestoreRecords',
  mixins: [baseMixin],
  props: {
    records: {
      type: Array,
      required: true
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      machineType: 2
    }
  },
  computed: {
    tableData() {
      return this.records.map(record => {
        if(record.restoreType === 1) { //文件恢复，查找是否有恢复失败的文件
          if(record.filePaths.find(filePath => filePath.state === 1)) {
            record.state = 1;
          } else {
            record.state = 0;
          }
        } else { // 卷恢复，数组中只有一个值
          record.state = record.filePaths[0].state;
        }
        return record;
      })
    }
  },
  methods: {
    fmtRestoreType({ restoreType }) {
      return filehostRestoreTypeMapping[restoreType];
    },
    stateConverter({ state }) {
      return restoreResultMapping[state];
    },
    fmtSizeFn(size) {
      return fmtSizeFn(size);
    },
    fmtSize(row) {
      return this.fmtSizeFn(row.sourceSize);
    },
    mouseenterFn(row) {
      cancelRestoreHighlight(row.id, this.machineType).then(res => {
        // console.log('ok')
      });
    },
    expandChange(row, expandedRows){
      // 展开失败的扩展表
      if(row.restoreType === 2 && expandedRows.includes(row) && row.state === 1) {
        cancelRestoreHighlight(row.id, this.machineType).then(res => {
          console.log('ok')
        });
      }
    },
  },
  mounted() {
  }
}
</script>
<style lang="scss" module>
@import '@/style/color.scss';
.resultDetailForm {
  label {
    width: 100px;
    color: #99a9bf;
  }
}
.detailFormItem {
  margin: {
    right: 0 !important;
    bottom: 0 !important;
  }
  width: 30%;
  &:nth-child(2n) {
    width: 69%;
  }
}
</style>