<template>
  <section>
      <el-form :model="formData"
               label-width="110px"
               ref="timeForm"
               :disabled="disable"
               :rules="rules"
               size="small">
        <el-form-item label="时间策略" class="is-required"
                      prop="timeStrategy">
          <el-radio-group v-model="formData.timeStrategy"
                          :class="$style.timeStrategyGroup">
            <el-radio :label="ts.code"
                      :class="$style.timeStrategyRadio"
                      v-for="ts in availableTimeStrategies"
                      :key="ts.code">{{ ts.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="[1,2].includes(formData.timeStrategy)?'计划开始时间': '计划创建时间'" class="is-required"
                      v-show="[1,2,3,4,5].includes(formData.timeStrategy)"
                      prop="startTime">
          <el-date-picker v-model="formData.startTime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="datetime"
                          :placeholder="[1,2].includes(formData.timeStrategy)?'选择计划开始时间': '选择计划创建时间'">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="执行时间" class="is-required"
                      v-show="formData.timeStrategy === 0"
                      prop="singleTime">
          <el-date-picker v-model="formData.singleTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择执行单次备份的时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择星期"  class="is-required"
                      prop="weekPoints"
                      v-show="formData.timeStrategy === 4">
          <el-checkbox-group v-model="formData.weekPoints"
                             @change="sortWeekPoints">
            <el-checkbox-button v-for="w in Object.keys(weekMapping)"
                                :label="w"
                                :key="w">{{ weekMapping[w] }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择日期"  class="is-required"
                      prop="datePoints"
                      v-show="formData.timeStrategy === 5">
          <el-select v-model="formData.datePoints"
                     @change="sortDatePoints"
                     multiple
                     style="width: 60%;">
            <el-option v-for="day in Array.from(new Array(31), (val, index) => String(index + 1))"
                       :key="day"
                       :value="day"
                       :label="day + '号'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`时间点${index+1}`"
                      style="width: 100%"
                      v-for="(p, index) in formData.timePoints"
                      :key="p.key"
                      v-show="[3,4,5].indexOf(formData.timeStrategy) !== -1">
          <el-time-select v-model="formData.timePoints[index].value"
                          :picker-options="{start: '00:00', end: '23:45', step: '00:15'}"></el-time-select>
          <template v-if="!disable">
            <el-button icon="el-icon-delete"
                       type="danger"
                       v-show="formData.timePoints.length !== 1"
                       @click="formData.timePoints.splice(index, 1)"></el-button>
            <el-button icon="el-icon-plus"
                       type="primary"
                       v-show="index + 1 === formData.timePoints.length"
                       @click="formData.timePoints.push({ value: '00:00', key: Date.now() })"></el-button>
          </template>
          
        </el-form-item>
        <el-form-item label="循环周期" class="is-required"
                      prop="minuteInterval"
                      v-show="formData.timeStrategy === 1">
          <el-input-number v-model="formData.minuteInterval"
                           :min="10"
                           :max="60"
                           :step="10"
                           contrls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="循环周期" class="is-required"
                      prop="hourInterval"
                      v-show="formData.timeStrategy === 2">
          <el-input-number v-model="formData.hourInterval"
                           :min="1"
                           :max="24"
                           :step="1"
                           contrls-position="right"></el-input-number>
          <span>（单位：小时）</span>
        </el-form-item>
      </el-form>
      
  </section>
</template>
<script>
import dayjs from 'dayjs';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
} from '../../utils/constant';
// 配置信息 如果有业务添加或者变更 可以直接修改这个对象
const strategyMapping = {
  default: {
    0: [0],
  },
  oracle: {
    1: [0, 2, 3, 4, 5],
    3: [3, 4, 5]
  },
  mysql: {
    1: [0, 2, 3, 4, 5],
  },
  vm: {
    1: [0, 2, 3, 4, 5],
  },
  sqlserver: {
    1: [0, 2, 3, 4, 5],
    2: [1],
  },
  windows: {
    1: [0, 1, 2, 3, 4, 5, 6],
    2: [0, 1, 2, 3, 4, 5, 6]
  },
  linux: {
    1: [0, 1, 2, 3, 4, 5, 6],
    2: [0, 1, 2, 3, 4, 5, 6]
  },
  db2: {
    1: [0, 2, 3, 4, 5]
  },
  dm: {
    0: [0, 2, 3, 4, 5],
    1: [0, 2, 3, 4, 5],
  },
  sybase: {
    0: [0, 2, 3, 4, 5],
    1: [0, 2, 3, 4, 5]
  },
  cache: {
    1: [0, 2, 3, 4, 5]
  },
  insql: {
    1: [0, 2, 3, 4, 5],
    2: [1],
  },
  informix: {
    1: [0, 2, 3, 4, 5]
  },
  postgresql: {
    1: [0, 2, 3, 4, 5]
  },
};
export default {
  name: 'time-strategy',
  props: {
    type: {
      type: String,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const singleTimeValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 0 && !value) {
        callback(new Error('请输入备份时间'));
      } else {
        callback();
      }
    };
    const startTimeValidate = (rule, value, callback) => {
      if (![0, 6].includes(this.formData.timeStrategy)) {
        if (!value) {
          callback(new Error('请输入计划时间'));
        } else if (dayjs(value) < dayjs()) {
          callback(new Error('计划时间必须晚于当前时间'));
        } else callback();
      } else {
        callback();
      }
    };
    const weekPointsValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 4 && value.length === 0) {
        callback(new Error('请选择循环星期'));
      } else {
        callback();
      }
    };
    const datePointsValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 5 && value.length === 0) {
        callback(new Error('请选择循环日期'));
      } else {
        callback();
      }
    };
    const hourIntervalValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 2 && !value) {
        callback(new Error('请输入循环周期'));
      } else {
        callback();
      }
    };
    const minuteIntervalValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 1 && !value) {
        callback(new Error('请输入循环周期'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        singleTime: [
          {
            validator: singleTimeValidate,
            trigger: 'blur',
          },
        ],
        startTime: [
          {
            validator: startTimeValidate,
            trigger: 'blur',
          },
        ],
        weekPoints: [
          {
            validator: weekPointsValidate,
            trigger: 'change',
          },
        ],
        datePoints: [
          {
            validator: datePointsValidate,
            trigger: 'change',
          },
        ],
        minuteInterval: [
          {
            validator: minuteIntervalValidate,
            trigger: 'blur',
          },
        ],
        hourInterval: [
          {
            validator: hourIntervalValidate,
            trigger: 'blur',
          },
        ],
      },
      weekMapping,
    };
  },
  computed: {
    // 根据选择的备份策略生成可用的时间策略
    availableTimeStrategies() {
      if (!this.type) {
        return [
          {
            code: 0,
            value: timeStrategyMapping['0'],
          },
        ];
      }
      return (
        strategyMapping[this.type][this.formData.backupStrategy] || []
      ).map(strategyCode => ({
        code: strategyCode,
        value: timeStrategyMapping[strategyCode],
      }));
    },
  },
  methods: {
    validate() {
      return this.$refs.timeForm.validate().then(res => {
        return this.validateData();
      });
    },
    clearValidate() {
      this.$refs.timeForm.clearValidate();
    },
    validateData() {
      const {
        timeStrategy,
        singleTime,
        startTime,
        datePoints,
        weekPoints,
        timePoints,
        hourInterval,
        minuteInterval,
      } = this.formData;
      return new Promise((resolve, reject) => {
        switch (timeStrategy) {
          case 0:
            if (dayjs(singleTime) < dayjs()) reject('单次时间必须晚于当前时间');

            break;
          case 1:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');

            break;
          case 2:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            break;
          case 3:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            if (timePoints.every(p => !p.value)) {
              reject('请至少输入一个时间点');
            }
            break;
          case 4:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            if (timePoints.every(p => !p.value)) {
              reject('请至少输入一个时间点');
            }
            break;
          case 5:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            if (timePoints.every(p => !p.value)) {
              reject('请至少输入一个时间点');
            }
            break;
          case 6:
            break;
          default:
        }
        resolve(true);
      });
    },
    sortWeekPoints() {
      this.formData.weekPoints = this.formData.weekPoints.sort((pre, next) => pre - next);
    },
    sortDatePoints() {
      this.formData.datePoints = this.formData.datePoints.sort((pre, next) => pre - next);
    }
  },
};
</script>
<style lang="scss" module>
.timeStrategyGroup {
  vertical-align: text-top;
}
.timeStrategyRadio {
  padding-bottom: 10px;
  margin-left: 8px !important;
  margin-right: 0!important;
}
.timeStrategyRadio:first-child {
  margin-left: 0 !important;
}
</style>
