<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               custom-class="min-width-dialog"
               @open="modalOpen"
               @close="modalClosed">
      <el-form :model="formData"
               :rules="rules"
               label-position="right"
               label-width="120px"
               ref="form"
               size="small">
        <el-form-item label="访问密匙"
                      prop="ak">
          <el-input v-model="formData.ak"></el-input>
        </el-form-item>
        <el-form-item label="安全密匙"
                      prop="sk">
          <el-input v-model="formData.sk"></el-input>
        </el-form-item>
        <el-form-item label="区域地址"
                      prop="endPoint">
          <el-input v-model="formData.endPoint"></el-input>
        </el-form-item>
      </el-form>
      <span slot="title">
        {{ action === 'create' ? '添加' : '修改' }}存储
      </span>
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
import isEqual from 'lodash/isEqual';
const basicData = {
  id: -1,
  ak: '',
  sk: '',
  endPoint: ''
};
const rules = {
  ak: [
    { required: true, message: '请输入访问密匙', trigger: 'blur' }
  ],
  sk: [
    { required: true, message: '请输入安全密匙', trigger: 'blur' }
  ],
  endPoint: [
    { required: true, message: '请输入区域地址', trigger: 'blur' }
  ]
};
export default {
  name: 'OperateModal',
  props: ['action', 'visible', 'btnLoading', 'sourceData'],
  data() {
    return {
      baseData: Object.assign({}, basicData),
      formData: {},
      rules
    }
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
        this.originFormData = Object.assign({}, this.baseData, this.sourceData);
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
