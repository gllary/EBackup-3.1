<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               title="批量部署"
               custom-class="min-width-dialog"
               @open="modalOpen"
               @opened="modalOpened">
      <el-tabs v-model="editableTabsValue"
               type="card"
               @edit="handleTabsEdit"
               addable>
        <el-tab-pane v-for="item in editableTabs"
                     :closable="editableTabs.length > 1"
                     :key="item.name"
                     :label="item.title"
                     :name="item.name">
          <el-form :ref="`form${item.name}`"
                   :rules="rules"
                   :model="item.formData"
                   size="small"
                   label-width="120px">
            <el-form-item label="代理IP"
                          prop="agentIp">
              <el-input v-model="item.formData.agentIp"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="部署版本"
                              prop="versionId">
                  <el-select v-model.number="item.formData.versionId">
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
                  <el-select v-model.number="item.formData.packageId">
                    <el-option v-for="pack in (item.formData.versionId ? versions.find(v => v.id === item.formData.versionId).packages : [])"
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
                  <el-select v-model="item.formData.agentOs"
                             @change="agentOsChange(item)">
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
                  <el-select v-model.number="item.formData.auto">
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
              <el-input v-model="item.formData.installPath"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="系统用户名"
                              prop="user">
                  <el-input v-model="item.formData.user"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密码"
                              prop="pass">
                  <el-input v-model="item.formData.pass"
                            type="password"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
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
import { rejects } from 'assert';

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
  agentIp: validate.hostIp,
  agentOs: [{ required: true, message: '请选择操作系统', trigger: 'blur' }],
  installPath: [{ required: true, message: '请输入安装路径', triggle: 'blur' }],
  versionId: [{ type: 'number', required: true, message: '请选择部署版本', triggle: 'blur' }],
  packageId: [{ type: 'number', required: true, message: '请选择部署包', triggle: 'blur' }],
  auto: [{ type: 'number', required: true, message: '请选择部署方式', triggle: 'blur' }],
  user: [{ required: true, message: '请输入系统名', triggle: 'blur' }],
  pass: [{ required: true, message: '请输入系统密码', triggle: 'blur' }],
}

export default {
  name: 'CreateDeployModal',
  props: ['visible', 'versions', 'btnLoading'],
  data() {
    return {
      editableTabsValue: '1',
      refForms: [],
      tabIndex: 1,
      switchManualMapping,
      editableTabs: [],
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
  },
  methods: {
    validateProp() {
      const multiFormData = this.refForms;
      const that = this;
      return new Promise(function(resolve, reject) {
        for (let i = 0, l = multiFormData.length; i < l; ++i) {
          const refForm = multiFormData[i];
          that.$refs[refForm][0].validate(valid => {
            if(valid) {
              resolve();
            } else {
              reject();
            }
          })
        }
      });
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        let newTabName = String(++this.tabIndex);
        this.editableTabs.push({
          title: `部署${newTabName}`,
          name: newTabName,
          formData: Object.assign({}, basicData)
        });
        this.editableTabsValue = newTabName;
        this.refForms.push(`form${this.newTabName}`);
      }
      if (action === 'remove') {
        const tabs = this.editableTabs;
        const targetIndex = tabs.findIndex(tab => tab.name === targetName);
        if(this.editableTabsValue === targetName) {
          const nextTab = tabs[targetIndex + 1] || tabs[targetIndex - 1];
          if(nextTab) {
            this.editableTabsValue = nextTab.name;
          }
        }
        this.editableTabs.splice(targetIndex, 1);
        this.refForms.splice(targetIndex, 1);
      }
    },
    modalOpen() {
      this.editableTabs = [{
        title: '部署1',
        name: '1',
        formData: Object.assign({}, basicData)
      }];
      this.editableTabsValue = this.editableTabs[0].name;
      this.tabIndex = 1;
      this.refForms.push(`form${this.editableTabsValue}`);
    },
    cancelButtonClick() {
      this.modalVisible = false;
    },
    modalOpened() {
      this.$refs.form1[0].clearValidate();
    },
    agentOsChange({ formData }) {
      if(formData.agentOs === 'Windows') {
        formData.installPath = 'C:\\';
      } else if (['Linux', 'AIX'].includes(formData.agentOs)) {
        formData.installPath = '/opt/';
      }
    },
    confirm() {
      this.validateProp()
        .then(() => {
          const depRecords = this.editableTabs.map(tab => {
            const { versionId, packageId, ...other } = tab.formData;
            const version = this.versions.find(version => version.id === versionId);
            const { packages, ...another } = version;
            const depPackage = Object.assign({}, version.packages.find(pack => pack.id === packageId));
            depPackage.version = version;
            return { ...other, depPackage };
          })
          this.$emit('confirm', { depRecords });
        })
        .catch(() => {
          this.$message.warning('初始化信息不符合要求');
        })
    }
  }
}
</script>
