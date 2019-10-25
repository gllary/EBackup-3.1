<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               custom-class="min-width-dialog"
               title="上传代理包"
               @open="modalOpen"
               @opened="modalOpened">
        <el-form :model="formData"
                 :rules="rules"
                 ref="ruleForm"
                 size="small"
                 label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="操作系统"
                            prop="osType">
                <el-select v-model="formData.osType">
                  <el-option v-for="os in ['Windows', 'Linux', 'AIX']"
                            :key="os"
                            :label="os"
                            :value="os"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类型"
                            prop="hostType">
                <el-select v-model.number="formData.hostType">
                  <el-option v-for="type in Object.keys(useTypeMapping)"
                            :key="type"
                            :label="useTypeMapping[type]"
                            :value="Number(type)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Wrapper部署"
                        prop="isWrapper">
            <el-radio-group v-model.number="formData.isWrapper">
              <el-radio v-for="type in Object.keys(yesOrNoMapping)"
                        :key="type"
                        :label="Number(type)">{{ yesOrNoMapping[type] }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传">
            <el-upload action=""
                        :limit="1"
                        :auto-upload="false"
                        :on-change="onChange"
                        :on-remove="handleRemove"
                        :file-list="fileList">
              <el-button size="small"
                         type="primary"
                         :disabled="Boolean(upload.get('file'))">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="代理包名"
                        prop="packageName">
            <el-input v-model="formData.packageName"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="代理包信息"
                        prop="updateMsg">
            <el-input type="textarea"
                      v-model="formData.updateMsg"
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
import { yesOrNoMapping, useTypeMapping } from '@/utils/constant';
import isEqual from 'lodash/isEqual';
const basicData = {
  packageName: '',
  osType: '',
  isWrapper: 1,
  hostType: '',
  updateMsg: ''
};
const rules = {
  packageName: [{ required: true, message: '请上传文件', triggle: 'blur' }],
  osType: [{ required: true, message: '请选择操作系统', triggle: 'blur' }],
  isWrapper: [{ type: 'number', required: true, message: '请选择部署方式', triggle: 'blur' }],
  hostType: [{ type: 'number', required: true, message: '请选择设备类型', triggle: 'blur' }],
  updateMsg: [{ required: true, message: '请输入更新信息', triggle: 'blur' }]
}
export default {
  name: 'UploadPackagesModal',
  props: ['visible', 'selectData', 'btnLoading'],
  data() {
    return {
      formData: {},
      originFormData: {},
      rules,
      fileList: [],
      upload: new FormData(),
      params: {},
      editableTabsValue: '1',
      tabIndex: 1,
      editableTabs: [],
      yesOrNoMapping,
      useTypeMapping
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
    },
    activeTab() {
      return this.editableTabs.find(tab => tab.name === this.editableTabsValue);
    }
  },
  methods: {
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
    },
    modalOpen() {
      this.formData = Object.assign({}, basicData);
      this.originFormData = { ...this.formData };
      this.upload = new FormData();
      this.tabIndex = 1;
      this.fileList = [];
    },
    modalOpened() {
      this.$refs.ruleForm.clearValidate();
    },
    confirm() {
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          Object.keys(this.formData).forEach(key => {
            this.upload.append(key, this.formData[key])
          });
          this.$emit('confirm', this.upload);
        } else {
          return false;
        }
      })
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
    onChange(file, fileList) {
      this.upload.append('file', file.raw, file.name);
       this.formData.packageName = file.name;
    },
    handleRemove(file, fileList) {
      this.upload.delete('file');
      this.formData.packageName = '';
    }
  }
}
</script>
