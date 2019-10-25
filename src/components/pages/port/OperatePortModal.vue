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
               label-position="right"
               label-width="120px"
               ref="form"
               size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型"
                          prop="type"
                          :rules="{message: '请选择类型', required: true, trigger: 'blur'}">
              <el-select v-model="formData.type"
                         placeholder="请选择"
                         disabled>
                <el-option v-for="v in Object.keys(portHostTypeMapping)"
                          :key="v"
                          :label="portHostTypeMapping[v]"
                          :disabled="disableSelectType.includes(Number(v))"
                          :value="Number(v)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口号"
                          prop="port">
              <el-input-number v-model="formData.port" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
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
import { portHostTypeMapping } from '@/utils/constant';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
const basicData = {
  id: -1,
  type: null,
  port: 1
};
export default {
  name: 'OperatePortModal',
  props: {
    allType: {
      type: Array
    },
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
  },
  data() {
    return {
      baseData: Object.assign({}, basicData),
      formData: {},
      originFormData: {},
      portHostTypeMapping
    }
  },
  computed: {
    title() {
      if(this.action === 'create') {
        return '添加端口号';
      } else if(this.action === 'update') {
        return '修改端口号';
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
    disableSelectType() {
      if(this.action === 'create') {
        return this.allType;
      } else if(this.action === 'update') {
        return difference(this.allType, [this.data.type]);
      }
    }
  },
  methods: {
    confirm() {
      this.$refs.form.validate(valid => {
        if(valid) {
          this.$emit('confirm', this.formData);
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
          .catch(() => {});
      }
    },
    modalOpen() {
      if(this.action === 'update'){
        this.originFormData = Object.assign({}, this.baseData, this.data);
      } else {
        const {
          id,
          ...other
        } = this.baseData;
        this.originFormData = {...other};
      }
      this.formData = {...this.originFormData};
    },
    modalClosed() {
      this.$refs.form.clearValidate();
    },
  }
}
</script>
<style>

