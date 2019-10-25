<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               title="修改部署信息"
               custom-class="min-width-dialog"
               @open="modalOpen"
               @close="modalClosed">
      <el-form ref="ruleForm"
               :model="formData"
               size="small"
               :rules="rules"
               label-width="120px">
        <el-form-item label="代理IP"
                      prop="agentIp">
          <el-input v-model="formData.agentIp"
                    disabled></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部署版本"
                          prop="versionId">
              <el-select v-model="formData.versionId">
                <el-option v-for="version in versions"
                          :key="version.id"
                          :label="version.versionCode"
                          :value="version.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部署包"
                          prop="packageId">
              <el-select v-model.number="formData.packageId">
                <el-option v-for="pack in availPackages"
                          :key="pack.id"
                          :label="pack.packageName"
                          :value="pack.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作系统"
                          prop="agentOs">
              <el-select v-model="formData.agentOs">
                <el-option v-for="(os, index) in ['Windows', 'Linux', 'AIX']"
                          :key="index"
                          :label="os"
                          :value="os"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部署方式"
                          prop="auto">
              <el-select v-model.number="formData.auto">
                <el-option v-for="type in Object.keys(switchManualMapping)"
                          :key="type"
                          :label="switchManualMapping[type]"
                          :value="Number(type)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="安装路径"
                      prop="installPath">
          <el-input v-model="formData.installPath"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统用户名"
                          prop="user">
              <el-input v-model="formData.user"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码"
                          prop="pass">
              <input-toggle v-model="formData.pass"
                            :hidden.sync="hiddenPassword"></input-toggle>
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
import { switchManualMapping } from '@/utils/constant';
import validate from '@/utils/validate';
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';

const basicData = {
  agentIp: '',
  agentOs: '',
  installPath: '',
  versionId: '',
  packageId: '',
  auto: '',
  user: '',
  pass: ''
};
const rules = {
  // agentIp: validate.hostIp,
  agentOs: [{ required: true, message: '请选择操作系统', trigger: 'blur' }],
  installPath: [{ required: true, message: '请输入安装路径', triggle: 'blur' }],
  versionId: [{ type: 'number', required: true, message: '请选择部署版本', triggle: 'blur' }],
  packageId: [{ type: 'number', required: true, message: '请选择部署包', triggle: 'blur' }],
  auto: [{ type: 'number', required: true, message: '请选择部署方式', triggle: 'blur' }],
  user: [{ required: true, message: '请输入系统名', triggle: 'blur' }],
  pass: [{ required: true, message: '请输入系统密码', triggle: 'blur' }],
};
export default {
  name: 'UpdateDeployModal',
  props: ['visible', 'versions', 'btnLoading', 'selectData'],
  components: {
    InputToggle
  },
  data() {
    return {
      formData: {},
      originFormData: {},
      switchManualMapping,
      hiddenPassword: true,
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
    },
    availPackages() {
      const version = Object.assign({}, this.versions.find(v => v.id === this.formData.versionId));
      return version ? version.packages : [];
    }
  },
  methods: {
    modalOpen() {
      const { depPackage } = this.selectData;
      const packageId = depPackage.id;
      const versionId = depPackage.version.id;
      this.formData = Object.assign({ ...basicData, packageId, versionId }, this.selectData);
      this.originFormData = { ...this.formData };
    },
    confirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let { versionId, packageId, depPackage, ...other } = this.formData;
          const version = { ...this.versions.find(version => version.id === versionId) };
          const newDepPackage = version ? Object.assign({}, version.packages.find(pack => pack.id === packageId)) : {};
          newDepPackage.version = Object.assign({}, version);
          this.$emit('confirm', { depPackage: newDepPackage, ...other });
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
    modalClosed() {
      this.$refs.ruleForm.clearValidate();
      this.hiddenPassword = true;
    },
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
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
  }
}
</script>

