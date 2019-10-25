<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @open="modalOpen"
               @close="modalClosed">
      <span slot="title">
        {{ action === 'update' ? '更新应用服务器' : '添加应用服务器' }}
      </span>
      <el-form :model="formData"
               label-width="110px"
               :rules="rules"
               ref="operateForm"
               size="small">
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="formData.name"
                    placeholder="请输入应用服务器名称"></el-input>
        </el-form-item>
        <el-form-item label="所属设备"
                      prop="hostId">
          <span slot="label">所属设备
            <el-tooltip placement="top"
                        content="生产环境设备" >
              <i class="el-icon-info"></i>
            </el-tooltip >
          </span>
          <el-input v-if="action === 'update'"
                    disabled
                    :value="formData.host ? `${formData.host.name || ''}(${formData.host.hostIp || ''})` : ''"></el-input>
          <el-select v-model="formData.hostId"
                     v-else
                     style="width: 100%;">
            <el-option v-for="host in availableHosts"
                       :key="host.id"
                       :label="`${host.name}(${host.hostIp})`"
                       :value="host.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading">确定</el-button>
        <el-button @click="cancelButtonClick()">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import { baseModalMixin } from '@/components/mixins/backupPlanModalMixin';
import { createOne, modifyOne } from '@/api/application';
import { constants } from 'fs';
const baseData = {
  name: '',
  hostId: ''
}
const OperateOne = {
  create: createOne,
  update: modifyOne
}
export default {
  name: 'OperateModal',
  mixins: [baseModalMixin],
  props: {
    data: {
      type: Object
    },
    action: {
      type: String
    }
  },
  data() {
    const validateHostId = (rule, value, callback) => {
      if(this.action === 'create' && value === '') {
        callback(new Error('请选择所属设备'));
      } else {
        callback();
      }
    }
    const rules = {
      name: [
        { required: true, message: '请输入应用服务器名称', trigger: 'blur' }
      ],
      hostId: [
        { validator: validateHostId, trigger: 'blur' }
      ]
    }
    return {
      rules,
      btnLoading: false
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
    },
    availableHosts() {
      return this.$store.getters.applicationHosts.filter(host => host.hostType === 1);
    }
  },
  methods: {
    modalOpen() {
      if(this.action === 'update'){
        this.originFormData = Object.assign({}, baseData, this.data);
      }else{
        this.originFormData = {...baseData};
      }
      this.formData = {...this.originFormData};
    },
    modalClosed() {
      this.$refs.operateForm.clearValidate();
    },
    confirm() {
      this.$refs.operateForm.validate(valid => {
        if(valid) {
          const {
            id,
            hostId,
            name
          } = this.formData;
          const data = this.action === 'create' ? {
            hostId, name
          } : {
            id, name
          }
          this.btnLoading = true;
          OperateOne[this.action](data)
            .then(res => {
              const { message } = res.data;
              this.$emit('confirm');
              this.$message.success(message);
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              this.btnLoading = false;
              this.modalVisible = false;
            })
        } else {
          return false;
        }
      })
    }
  }
}
</script>