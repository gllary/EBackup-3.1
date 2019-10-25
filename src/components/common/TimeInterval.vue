<template>
    <el-form size="small"
             label-position="right"
             label-width="100px"
             :model="formData"
             :rules="rules"
             ref="timeIntervalForm">
      <el-form-item label="时间策略" class="is-required"
                    style="width: 100%">
        <el-radio-group v-model="formData.timeStrategy">
          <el-radio :label="Number(s)"
                    v-for="s in Object.keys(strategys)"
                    v-if="type!=='vm'||s==='1'"
                    :key="s">{{ strategys[s] }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="type === 'postgresql' ? '计划时间' : '恢复时间'" class="is-required"
                        prop="singleTime"
                        v-show="formData.timeStrategy == 1">
            <el-date-picker type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="formData.singleTime"
                            style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="恢复至" class="is-required"
                        prop="restoreTimePoint"
                        v-show="formData.timeStrategy === 1 && type === 'postgresql'">
            <el-date-picker type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="formData.restoreTimePoint"
                            style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="计划时间" class="is-required"
                    prop="startTime"
                    v-show="[2,3].indexOf(formData.timeStrategy) !== -1">
        <el-date-picker type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="formData.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="选择星期" class="is-required"
                    prop="weekPoints"
                    v-show="formData.timeStrategy == 2">
        <el-checkbox-group v-model="formData.weekPoints"
                           @change="sortWeekPoints">
          <el-checkbox-button v-for="w in Object.keys(weekMapping)"
                              :label="w"
                              :key="w">{{ weekMapping[w] }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择日期" class="is-required"
                    prop="datePoints"
                    v-show="formData.timeStrategy == 3">
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
      <el-form-item label="时间点" class="is-required"
                    style="width: 100%"
                    prop="timePoints"
                    v-for="(p, index) in formData.timePoints"
                    :key="p.key"
                    v-show="[2,3].indexOf(formData.timeStrategy) !== -1">
        <el-time-select v-model="formData.timePoints[index].value"
                        :picker-options="{start: '00:00', end: '23:45', step: '00:15'}"></el-time-select>
      </el-form-item>
    </el-form>
    
</template>
<script>
import dayjs from 'dayjs';
import {
  restoreTimeStrategyMapping as strategys,
  weekMapping,
} from '../../utils/constant';
export default {
  name: 'timeInterval',
  props: {
    type: {
      type: String,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
  },
  data() {
    const singleTimeValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 1 && !value) {
        callback(new Error(`${this.type === 'postgresql' ? '请输入计划恢复时间' : '请输入恢复时间'}`));
      } else {
        callback();
      }
    };
    const startTimeValidate = (rule, value, callback) => {
      if ([2, 3].indexOf(this.formData.timeStrategy) !== -1 && !value) {
        callback(new Error('请输入计划时间'));
      } else {
        callback();
      }
    };
    const restoreTimePointValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 1 && this.type === 'postgresql' && !value) {
        callback(new Error('请选择恢复时间点'));
      } else {
        callback();
      }
    };
    const weekPointsValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 2 && value.length === 0) {
        callback(new Error('请输入循环星期'));
      } else {
        callback();
      }
    };
    const timePointsValidate = (rule, value, callback) => {
      if (this.formData.timePoints.every(p => !p.value)) {
        callback(new Error('请输入时间点'));
      } else {
        callback();
      }
    };
    const datePointsValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 3 && value.length === 0) {
        callback(new Error('请输入循环日期'));
      } else {
        callback();
      }
    };
    return {
      strategys, // 时间策略
      weekMapping, // 星期映射
      rules: {
        singleTime: [
          {
            validator: singleTimeValidate,
            trigger: ['blur']
          },
        ],
        startTime: [
          {
            validator: startTimeValidate,
            trigger: ['blur']
          },
        ],
        restoreTimePoint: [
          {
            validator: restoreTimePointValidate,
            trigger: ['blur']
          }
        ],
        weekPoints: [
          {
            validator: weekPointsValidate,
            trigger: ['change']
          },
        ],
        timePoints: [
          {
            validator: timePointsValidate,
            trigger: ['change']
          },
        ],
        datePoints: [
          {
            validator: datePointsValidate,
            trigger: ['change']
          },
        ],
      },
    };
  },
  methods: {
    validate() {
      return this.$refs.timeIntervalForm.validate().then(res => {
        return this.validateData();
      });
    },
    clearValidate() {
      this.$refs.timeIntervalForm.clearValidate();
    },
    // 精简计划数据，返回不同时间策略下所需要的数据
    validateData() {
      const { timeStrategy, startTime, singleTime } = this.formData;
      return new Promise((resolve, reject) => {
        if (timeStrategy === 1) {
          if (dayjs(singleTime) < dayjs()) reject('单次时间必须晚于当前时间');
          if (this.type === 'postgresql' && dayjs(this.formData.restoreTimePoint) > dayjs())
            reject('恢复时间点必须早于当前时间');
        } else {
          if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
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
<style >
</style>
