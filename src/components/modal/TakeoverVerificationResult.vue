<template>
  <el-dialog :visible.sync="modalVisible" width="80%"
              @open="fetchData"
              top="8vh"
              :close-on-click-modal="false"
               @closed="modalClosed">
    <span slot="title">
      验证结果列表
    </span>
    <el-container class="verfication_result_container">
      <template>
        <el-table
          :data="tableData"
          v-loading="loading"
          :element-loading-background="themeColor.loadingBackGround"
          stripe
          :default-sort="{prop: 'time', order: 'descending'}"
          :max-height="maxTableHeight"
          row-class-name="custom_row"
          style="width: 100%;">
          <el-table-column
            prop="date"
            label=""
            align="center"
            width="80">
            <template slot-scope="scope">
              <el-row class="source_row">
                <el-tag size="small">生产</el-tag>
              </el-row>
              <el-row class="target_row">
                <el-tag type="warning" size="small">易备</el-tag>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            label="记录时间"
            sortable
            align="center"
            width="180">
            <template slot-scope="scope">
              <span>{{scope.row.time}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="主机名"
            align="center"
            width="">
            <template slot-scope="scope">
              <el-row class="source_row">{{scope.row.produce.hostName}}</el-row>
              <el-row class="target_row">{{scope.row.standby.hostName}}</el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="主机IP"
            align="center"
            width="">
            <template slot-scope="scope">
              <el-row class="source_row">{{scope.row.produce.hostIp}}</el-row>
              <el-row class="target_row">{{scope.row.standby.hostIp}}</el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="数据库名"
            align="center"
            width="">
            <template slot-scope="scope">
              <el-row class="source_row">{{scope.row.produce.dbName}}</el-row>
              <el-row class="target_row">{{scope.row.standby.dbName}}</el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="数据库容量"
            align="center"
            width="">
            <template slot-scope="scope">
              <el-row class="source_row">{{scope.row.produce.dbCapacity |capacityFmt}}</el-row>
              <el-row class="target_row">{{scope.row.standby.dbCapacity |capacityFmt}}</el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="表总数量(个)"
            align="center"
            width="">
            <template slot-scope="scope">
              <el-row class="source_row">{{scope.row.produce.tablesNumber}}</el-row>
              <el-row class="target_row">{{scope.row.standby.tablesNumber}}</el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="记录总数"
            align="center"
            width="">
            <template slot-scope="scope">
              <el-row class="source_row">{{scope.row.produce.recordNumber}}</el-row>
              <el-row class="target_row">{{scope.row.standby.recordNumber}}</el-row>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="time"
            label="记录时间"
            align="center"
            width="180">
            <template slot-scope="scope">
              <span>{{scope.row.time}}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="result"
            align="center"
            width="120"
            label="验证结果">
            <template slot-scope="scope">
              <el-tag :type="scope.row.result === 'consistent' ? 'success' : 'danger'" effect="dark" size="small">{{scope.row.result|resultFilter}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-container>
    <span slot="footer">
      <el-button type="primary"
                  @click="download"
                  :loading="btnLoading" size="medium">下载</el-button>
      <el-button @click="cancelBtnClick()" size="medium">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import dayjs from 'dayjs';
import {
  // getRestoreVerificationResultList,
  getTakeoverVerificationResultList,
  downloadTakeoverVerificationReport
} from '@/api/common';
import {verificationResultMapping} from '@/utils/constant';
import {fmtSizeFn} from '@/utils/common';
import themeMixin from '@/components/mixins/themeMixins';
export default {
  name: 'verificationResult',
  mixins: [themeMixin],
  props: {
    visible: {
      type: Boolean
    },
    id: {
      type: Number
    }
  },
  data() {
    return {
      tableData: [],
      btnLoading: false,
      loading: false,
      maxTableHeight: 300
    };
  },
  mounted() {
    // this.fetchData();
  },
  created() {
    const clientHeight = document.documentElement.clientHeight;
    this.maxTableHeight = clientHeight * 0.6;
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    },
  },
  filters: {
    resultFilter(val) {
      return verificationResultMapping[val] || val;
    },
    capacityFmt(val) {
      return fmtSizeFn(val);
    }
  },
  methods: {
    fetchData() {
      if (!this.id) {
        return;
      }
      this.loading = true;
      getTakeoverVerificationResultList(this.id).then(res => {
        const {message, data} = res.data;
        this.tableData = Array.isArray(data) ? data : [];
        this.loading = false;
      });
    },
    cancelBtnClick() {
      this.modalVisible = false;
    },
    modalClosed() {
      this.modalVisible = false;
      this.tableData = [];
    },
    download() {
      window.location.href = `http://${window.location.host}/api/v1/verify/takeover/report/${this.id}`;
    }
  },
};
</script>
<style lang="scss">
@import '@/assets/theme/variable.scss';
.source_row{
  padding-bottom: 12px;
  padding-left: 10px;
  padding-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.target_row{
  padding-top: 12px;
  @include themeify {
    border-top: 1px solid themed('custom-table-border-color');
  }
  padding-left: 10px;
  padding-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.verfication_result_container .custom_row .cell{
  padding: 0 !important;
}
.verfication_result_container .el-table--striped .el-table__body tr.el-table__row--striped td{
  // background: #FBF7F7;
  @include themeify {
    background: themed('stripe-table-bg-color');
  }
}
.verfication_result_container .el-table--enable-row-hover .el-table__body tr:hover>td {
  @include themeify {
    background: themed('table-hover-bg-color');
  }
}
::-webkit-scrollbar {/*滚动条整体样式*/
  width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
  /* height: 4px; */
}
::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  // -webkit-box-shadow: inset 0 0 5px #676769;
  // background: #676769;
  @include scrollbarThumbColor;
}
::-webkit-scrollbar-track {/*滚动条里面轨道*/
  // -webkit-box-shadow: 0 0 5px #1D3E5F;
  border-radius: 5px;
  // background: rgba(0,0,0,0.1);
  @include scrollbarTrackColor;
}
</style>
