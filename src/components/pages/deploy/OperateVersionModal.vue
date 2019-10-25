<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               custom-class="min-width-dialog"
               @open="modalOpen"
               @opened="modalOpened">
      <span slot="title">
        {{ operateType === 'create' ? '添加版本' : '更新版本' }}
      </span>
      <el-form :model="formData"
               :rules="rules"
               ref="ruleForm"
               size="small"
               label-width="120px">
        <el-form-item label="版本号"
                      prop="versionCode">
          <el-input v-model="formData.versionCode"></el-input>
        </el-form-item>
        <el-form-item label="版本路径"
                      prop="packagePath">
          <el-input v-model="formData.packagePath"></el-input>
        </el-form-item>
        <el-form-item label="版本信息"
                      prop="versionMsg">
          <el-input type="textarea"
                    v-model="formData.versionMsg"
                    :autosize="{minRows: 5, maxRows: 10}"></el-input>
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
import isEqual from 'lodash/isEqual';

const basicData = {
  versionCode: '',
  packagePath: 'C:\\packages\\',
  versionMsg: ''
}
const rules = {
  versionCode: [{ required: true, message: '请输入版本号', triggle: 'blur' }],
  packagePath: [{ required: true, message: '请输入代理包路径', triggle: 'blur' }],
  versionMsg: [{ required: true, message: '请输入版本信息', triggle: 'blur' }],
}
export default {
  name: 'OperateVersionModal',
  props: ['visible', 'btnLoading', 'selectData', 'operateType'],
  data() {
    return {
      formData: {},
      originFormData: {},
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
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
    },
    cancelButtonClick() {
      this.hasModifiedBeforeClose(() => {
        this.modalVisible = false;
      });
    },
    modalOpened() {
      this.$refs.ruleForm.clearValidate();
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
      if(this.operateType === 'create') {
        this.formData = Object.assign({}, basicData);
        this.originFormData = Object.assign({}, basicData);
      } else {
        this.formData = Object.assign({}, this.selectData);
        this.originFormData = Object.assign({}, this.selectData);
      }
    },
    confirm() {
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          this.$emit('confirm', this.formData);
        } else {
          return false;
        }
      })
    }
  }
}
</script>

