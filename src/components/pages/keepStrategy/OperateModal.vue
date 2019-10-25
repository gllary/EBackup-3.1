<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               custom-class="min-width-dialog"
               @open="modalOpen"
               @close="modalClosed">
      <span slot="title">
        {{ title }}
      </span>
      <el-form :model="formData"
               label-width="110px"
               ref="form"
               size="small">
        <el-form-item label="设备类型"
                      prop="hostType"
                      :rules="{message: '请选择设备类型', required: true, trigger: 'blur'}">
          <el-select v-model="formData.hostType"
                     placeholder="请选择">
            <el-option v-for="type in Object.keys(useTypeMapping)"
                       :key="type"
                       :label="useTypeMapping[type]"
                       :disabled="disableSelectHost.includes(Number(type))"
                       :value="Number(type)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保留策略"
                      prop="keepType">
            <el-radio-group v-model="formData.keepType">
              <el-radio v-for="strategy in Object.keys(keepStrategyMapping)"
                        :key="strategy"
                        :label="Number(strategy)"
                        v-if="[0, 1].includes(Number(strategy)) || (Number(strategy) === 2 && formData.hostType === 3)">{{ keepStrategyMapping[strategy] }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-row v-if="formData.keepType === 1">
          <el-col :span="12">
            <el-form-item label="容器数量"
                          prop="totalContainer">
              <el-input-number v-model="formData.totalContainer"
                               :min="1"
                               @change="totalContainerChange"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  v-if="action === 'update' && formData.hostType === 3">
            <el-form-item label="当前容器"
                          prop="currentContainer">
              <el-input-number v-model="formData.currentContainer"
                               :min="1"
                               :max="formData.totalContainer"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="清除脚本路径"
                      prop="scriptsPath"
                      v-if="formData.keepType === 2">
          <el-input v-model="formData.scriptsPath"></el-input>
        </el-form-item>
        <el-form-item label="时间策略"
                      prop="keepDate"
                      v-if="[1,2].includes(formData.keepType) && formData.hostType === 3">
          <el-radio-group v-model="formData.keepDate">
            <el-radio v-for="date in Object.keys(keepDateMapping)"
                      :key="date"
                      :label="date">{{ keepDateMapping[date] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择日期"
                      prop="scheduleDate"
                      v-if="[1,2].includes(formData.keepType) && formData.hostType === 3">
          <el-radio-group v-model="formData.scheduleDate"
                             v-if="Number(formData.keepDate) === 1">
            <el-radio-button v-for="w in Object.keys(weekMapping)"
                             :key="w"
                             :label="Number(w)">{{ weekMapping[w] }}</el-radio-button>
          </el-radio-group>
          <el-select v-model="formData.scheduleDate"
                     v-else
                     style="width: 60%;">
            <el-option v-for="day in Array.from(new Array(31), (val, index) => index + 1)"
                       :key="day"
                       :value="day"
                       :label="day + '号'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间"
                      prop="scheduleTime"
                      v-if="[1,2].includes(formData.keepType) && formData.hostType === 3">
            <el-time-picker v-model="formData.scheduleTime"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            type="datetime"
                            placeholder="选择时间"></el-time-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading">确定</el-button>
        <el-button @click="cancelButtonClick">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import {
  useTypeMapping,
  keepStrategyMapping,
  keepDateMapping,
  weekMapping
} from '@/utils/constant';
import dayjs from 'dayjs';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
const basicData = {
  id: -1,
  hostType: null,
  keepType: 0,
  totalContainer: 0,
  currentContainer: 0,
  keepDate: '1',
  scheduleDate: 1,
  scheduleTime: dayjs().format('HH:mm:ss'),
  scriptsPath: ''
}
export default {
  name: 'OperateModal',
  props: {
    visible: {
      type: Boolean
    },
    btnLoading: {
      type: Boolean
    },
    action: {
      type: String
    },
    data: {
      type: Object
    },
    allHostType: {
      type: Array
    }
  },
  data() {
    return {
      baseData: Object.assign({}, basicData),
      formData: {},
      originFormData: {},
      weekMapping,
      useTypeMapping,
      keepDateMapping,
      keepStrategyMapping
    }
  },
  computed: {
    title() {
      if(this.action === 'create') {
        return '添加备份保留策略';
      } else if(this.action === 'update') {
        return '修改备份保留策略';
      } else {
        return '';
      }
    },
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      }
    },
    disableSelectHost() {
      if(this.action === 'create') {
        return this.allHostType;
      } else if(this.action === 'update') {
        return difference(this.allHostType, [this.data.hostType]);
      }
    }
  },
  methods: {
    emptyData(data, propSet) {
      propSet.forEach(item => data[item] = '');
      return data;
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if(valid) {
          const timeSet = ['keepDate', 'scheduleDate', 'scheduleTime'];
          const containerSet = ['currentContainer', 'totalContainer'];
          let emptyProps = null;
          if(this.formData.keepType === 0) {
            emptyProps = ['scriptsPath', ...timeSet, ...containerSet];
          } else if(this.formData.hostType !== 3) {
            this.formData.currentContainer = this.originFormData.currentContainer; // 数据库禁止修改当前容器
            emptyProps = ['scriptsPath', ...timeSet];
          } else if(this.formData.keepType === 1) {
            emptyProps = ['scriptsPath'];
          } else {
            emptyProps = [...containerSet];
          }
          this.$emit('confirm', Object.assign({}, this.emptyData(this.formData, emptyProps)));
        } else {
          return false;
        }
      });
    },
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
    },
    cancelButtonClick() {
      this.hasModifiedBeforeClose(() => {
        this.modalVisible = false;
      });
    },
    hasModifiedBeforeClose(fn) {
      if (isEqual(this.formData, this.originFormData)) {
        fn();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            fn();
          })
          .catch(() => { });
      }
    },
    modalOpen() {
      if(this.action === 'update'){
        this.originFormData = Object.assign({}, this.baseData, this.data);
      }else{
        this.originFormData = {...this.baseData};
      }
      this.formData = {...this.originFormData}
    },
    modalClosed() {
      this.$refs.form.clearValidate();
    },
    totalContainerChange() {
      if(this.formData.totalContainer<this.formData.currentContainer && this.action === 'update') {
        this.formData.currentContainer = this.formData.totalContainer;
      }
    }
  }
}
</script>

