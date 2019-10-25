<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :before-close="beforeModalClose"
               @close="modalClosed"
               @open="modalOpened"
               :visible.sync="modalVisible">
      <span slot="title">
        执行恢复操作
      </span>
      <el-form size="small"
              label-position="right"
              label-width="110px"
              :model="formData"
              :rules="rules"
              ref="singleRestorePlanForm">
        <el-form-item label="计划名"
                      prop="planName">
          <el-input v-model="formData.planName"></el-input>
        </el-form-item>
        <el-form-item label="恢复主机"
                      prop="targetHostId">
          <el-select  v-model="formData.targetHostId"
                      @change="selectHostChange"
                      style="width: 100%;">
            <el-option v-for="host in selectionHosts"
                       :key="host.id"
                       :value="host.id"
                       :label="`${host.hostName}(${host.hostIp})`">
              <span style="float: left">{{ host.hostName}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ host.hostIp }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="恢复源路径"
                      prop="restorePath"
                      v-if="restoreType === 1">
          <el-button type="primary"
                      size="small"
                     @click="selectSourceFiles">+选择文件</el-button>
          <span v-if="formData.restorePath&&!formData.restorePath.length"
                style="color: #f56c6c; font-size: 12px">
            <i class="el-icon-warning"></i>未选择恢复文件
          </span>
          <el-popover placement="right"
                      width="400"
                      trigger="hover"
                      v-else>
            <div style="max-height: 400px; overflow: auto;">
              <p v-for="path in formData.restorePath"
                :key="path"
                style="margin-top: 0; margin-bottom: 5px">
                <el-tag closable
                        size="small"
                        :class="$style.fileTags"
                        @close="delSelectedFile(path)">
                  <span>{{ path }}</span>
                </el-tag>
              </p>
            </div>
            <span style="color: #409EFF; font-size: 12px; cursor: pointer"
                  slot="reference">
              <i class="el-icon-question"></i>查看已选文件
            </span>
          </el-popover>          
        </el-form-item>
        <el-form-item label="存放路径"
                      prop="targetPath">
          <el-button type="primary"
                     :disabled="!hasFetchedTargetPath"
                     style="float: left; margin-right: 4px"
                     size="small"
                     @click="selectTargetFiles">选择路径</el-button>
          <span v-if="!formData.targetPath"
                style="color: #f56c6c; font-size: 12px">
            <i class="el-icon-warning"></i>未选择存放路径
          </span>
          <el-tag v-else
                  :class="$style.targetPathTag">
            <span>{{ formData.targetPath }}</span>
          </el-tag>
        </el-form-item>
        <el-form-item label="恢复排除文件"
                      v-if="restoreType === 1">
          <el-tag :key="tag.id"
                  :class="$style.tags"
                  type="danger"
                  v-for="tag in formData.excludeFiles"
                  closable
                  @close="handleClose(tag)">{{tag}}</el-tag>
          <el-input v-if="inputTagVisible"
                    :class="$style.buttonNewTag"
                    ref="saveTagInput"
                    v-model="tagInputValue"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"></el-input>
          <el-button v-else @click="showInputTag">+ 排除文件</el-button>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务器登录名"
                          prop="loginName">
              <el-input v-model="formData.loginName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录密码"
                          prop="password">
              <input-toggle v-model="formData.password"
                            :hidden.sync="hiddenPassword"></input-toggle>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                  @click="confirmBtnClick"
                  :loading="btnLoading">确定</el-button>
        <el-button @click="cancelButtonClick">取消</el-button>
      </span>
    </el-dialog>
    <plan-source-path :visible.sync="filePlanTree"
                      :host-id="hostId"
                      :nodes="formData.restorePath"
                      :fatherNodes="sourcePath"
                      @selectNodes="selectSourceNodes"></plan-source-path>
    <result-source-path :visible.sync="fileResultTree"
                        :host-id="hostId"
                        :nodes="formData.restorePath"
                        :fatherNodes="sourcePath"
                        @selectNodes="selectSourceNodes"></result-source-path>
    <target-tree :visible.sync="fileTargetTree"
                 :host-id="formData.targetHostId"
                 :fatherNodes="targetNodes"
                 @selectNodes="selectTargetNodes"></target-tree>
  </section>
</template>
<script>
import { restorePlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import cloneDeep from 'lodash/cloneDeep';
import ResultSourcePath from '@/components/pages/file/ResultSourcePath';
import PlanSourcePath from '@/components/pages/file/PlanSourcePath';
import TargetTree from '@/components/pages/file/TargetTree';
import validate from '@/utils/validate';
import {
  fetchAll,
  fetchPathByHostId,
  fetchPathByPlanId,
  fetchPathByResultId
} from '@/api/file';
const basicFormData = {
  targetHostId: null,
  planName: '',
  targetPath: '',
  restorePath: [],
  excludeFiles: [],
  loginName: '',
  password: ''
};
const fetchSourcePath = {
  1: fetchPathByPlanId,
  2: fetchPathByResultId
}
export default {
  name: 'SingleRestoreModal',
  mixins: [restorePlanModalMixin],
  props: {
    btnLoading: {
      type: Boolean
    },
    visible: {
      type: Boolean
    },
    restoreType: {
      type: Number
    },
    id: {
      type: Number
    },
    hostId: {
      type: Number
    },
    sourcePath: {
      type: Array,
      default: function() {
        return [];
      }
    },
    type: {
      type: String
    }
  },
  data() {
    const targetPathValidate = (rule, value, callback) => {
      if(!this.formData.targetPath) {
        this.$message.warning('请选择恢复存放路径!');
      } else {
        callback();
      }
    }
    const restorePathValidate = (rule, value, callback) => {
      if(!this.formData.restorePath.length) {
        this.$message.warning('请选择恢复源路径!');
      } else {
        callback();
      }
    }
    return {
      selectionHosts: null,
      tagInputValue: null, // 恢复排除文件
      inputTagVisible: false,
      filePlanTree: false,
      fileResultTree: false,
      fileTargetTree: false,
      targetNodes: null,
      hasFetchedTargetPath: false,
      rules: {
        planName: validate.planName,
        targetHostId: {
          message: '请选择主机',
          required: true,
          trigger: 'blur'
        },
        loginName: {
          message: '请输入服务器登录名',
          required: true,
          trigger: 'blur'
        },
        password: {
          message: '请输入服务器登录密码',
          required: true,
          trigger: 'blur'
        },
        targetPath: {
          validator: targetPathValidate,
          trigger: ['blur']
        },
        restorePath: {
          validator: restorePathValidate,
          trigger: ['blur']
        }
      }
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
      },
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data: infos } = res.data;
          this.selectionHosts = infos;
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    modalClosed() {
      this.$refs.singleRestorePlanForm.clearValidate();
      this.hiddenPassword = true;
      this.hasFetchedTargetPath = false;
    },
    modalOpened() {
      const baseFormData = cloneDeep(basicFormData);
      this.originFormData = Object.assign({}, baseFormData);
      this.formData = Object.assign({}, this.originFormData);
    },
    selectSourceNodes(nodes) {
      this.formData.restorePath = nodes.concat();
    },
    selectTargetNodes(nodes) {
      this.formData.targetPath = nodes.map(node => node.sourcePath).concat()[0];
    },
    selectHostChange(hostId) {
      this.hasFetchedTargetPath = false;
      fetchPathByHostId(hostId)
        .then(res => {
          const { data: nodes } = res.data;
          this.targetNodes = nodes;
          this.hasFetchedTargetPath = true;
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    handleClose(tag) {
      this.formData.excludeFiles.splice(this.formData.excludeFiles.indexOf(tag), 1);
    },
    showInputTag() {
      this.inputTagVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    delSelectedFile(path) {
      this.formData.restorePath.splice(this.formData.restorePath.indexOf(path), 1);
    },
    handleInputConfirm() {
      let tagInputValue = this.tagInputValue;
      if(tagInputValue) {
        this.formData.excludeFiles.push(tagInputValue);
      }
      this.inputTagVisible = false;
      this.tagInputValue = '';
    },
    confirmBtnClick() {
      this.$refs.singleRestorePlanForm.validate(valid => {
        if(valid) {
          if(this.restoreType !== 1) {
            const { excludeFiles,restorePath, ...other } = this.formData;
            this.$emit('confirm', this.id, other);
          } else {
            this.$emit('confirm', this.id, this.formData);
          }
        }
      })
    },
    selectSourceFiles() {
      if(this.type === 'restoreResult') {
        this.fileResultTree = true;
      } else {
        this.filePlanTree = true;
      }
    },
    selectTargetFiles() {
      this.fileTargetTree = true;
    }
  },
  components: {
    ResultSourcePath,
    PlanSourcePath,
    TargetTree
  }
}
</script>
<style lang="scss" module>
.tags {
  margin-right: 8px;
}
.buttonNewTag {
  width: 100px;
}
.targetPathTag {
  display: inline-block;
  float: left;
  max-width: 500px;
  span {
    max-width: 480px;
    display: inline-block;
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.fileTags {
  display: inline-block;
  max-width: 380px;
  span {
    max-width: 340px;
    display: inline-block;
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  i {
    vertical-align: 0.4em !important;
  }
  // margin-top: 5px;
}
</style>


