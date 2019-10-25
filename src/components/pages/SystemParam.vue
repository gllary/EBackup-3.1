<template>
  <section>
    <el-row>
      <el-form inline
               size="small">
        <el-form-item style="float: right;">
          <el-button type="primary"
                    @click="handleCreate()">添加</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
            <el-button type="success"
                      @click="toguide('StoreAddress')">操作说明</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="systemParameters"
              style="width: 100%">
      <el-table-column prop="sysType"
                       label="系统类别"
                       :formatter="judgeSystem"
                       min-width="150"
                       fixed
                       align="center"></el-table-column>
      <el-table-column prop="useType"
                       label="使用类别"
                       :formatter="judgeUse"
                       min-width="130"
                       align="center"></el-table-column>
      <el-table-column prop="shareUrl"
                       label="地址"
                       min-width="180"
                       show-overflow-tooltip
                       align="center"></el-table-column>
      <el-table-column prop="mountUrl"
                       label="挂载点"
                       min-width="180"
                       show-overflow-tooltip
                       align="center"></el-table-column>
      <el-table-column label="状态"
                       min-width="100"
                       header-align="center"
                       align="center"
                       prop="state">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 0">
            <i class="el-icon-circle-check" style="color: #67C23A;font-size: 18px">
            </i>
          </span>
          <span v-else>
            <i class="el-icon-remove" style="color: #909399;font-size: 18px"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="loginName"
                       label="登录账号"
                       min-width="140"
                       align="center"></el-table-column>
      <el-table-column label="操作"
                       min-width="150"
                       header-align="center"
                       fixed="right"
                       align="center"
                       prop="state">
        <template slot-scope="scope">
          <el-tooltip content="修改"
                      placement="top"
                      effect="light">
            <el-button type="primary"
                      icon="el-icon-edit"
                      circle
                      size="mini"
                      :class="$style.miniCricleIconBtn"
                      @click="handleUpdate(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除"
                      placement="top"
                      effect="light">
            <el-button type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                      :class="$style.miniCricleIconBtn"
                      @click="handleDelete(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip :content="`${scope.row.state===1?'启用':'禁用'}`"
                      placement="top"
                      effect="light">
            <el-button :type="`${scope.row.state===1?'success':'info'}`"
                       :icon="`${scope.row.state===1?'el-icon-check':'el-icon-minus'}`"
                       circle
                       :class="$style.miniCricleIconBtn"
                       @click="changeState(scope.$index, scope.row)"
                       size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改 -->
    <el-dialog :visible.sync="updateModalVisible"
               @close="modalClose"
               @open="updateModalOpened"
               :before-close="handleClose">
      <span slot="title">
        修改参数
        <span style="color: #999999">(ID: {{formData.id}})</span>
      </span>
      <el-form :model="formData"
               ref="formData"
               :rules="rules"
               label-width="130px"
               size="small">
        <el-form-item label="系统类别"
                      prop="sysType">
          <el-radio-group v-model="formData.sysType">
            <el-radio :label="1">{{ formData.useType === 3 ? 'Windows Share' : 'Windows'}}</el-radio>
            <el-radio :label="2">{{ formData.useType === 3 ? 'Linux NFS' : 'Linux' }}</el-radio>
            <el-radio :label="3" v-if="formData.useType === 3">Windows NFS</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用类别"
                      prop="useType">
          <el-select v-model="formData.useType" placeholder="请选择">
            <el-option v-for="useType in useTypeSelect"
                       :key="useType.label"
                       :label="useType.label"
                       :value="useType.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Windows系统版本"
                      v-if="[1, 3].includes(formData.sysType) && [2, 10].includes(formData.useType)"
                      prop="windowsType">
          <el-radio v-model="formData.windowsType" :label="1">2003</el-radio>
          <el-radio v-model="formData.windowsType" :label="2">2008及以上</el-radio>
        </el-form-item>
        <el-form-item :label="`${formData.sysType === 1 ? '共享路径' : 'NFS地址'}`"
                      prop="shareUrl">
          <el-input v-model="formData.shareUrl"></el-input>
        </el-form-item>
        <el-form-item label="挂载点"
                      v-if="[2, 3].includes(formData.sysType)"
                      :rules="formData.useType === 7 ? [...validate.maxLength100, { required: true, message: '请输入路径', trigger: 'blur' }]: validate.maxLength100"
                      prop="mountUrl">
          <el-input v-model="formData.mountUrl"
                    v-if="formData.sysType === 2"></el-input>
          <el-select v-model="formData.mountUrl"
                     v-if="formData.sysType === 3"
                     placeholder="请选择">
            <el-option v-for="item in Array.from(new Array(26), (val, index) => (String.fromCharCode(index+65))+':')"
                       :key="item"
                       :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态"
                      prop="state">
          <el-radio v-model="formData.state" :label="0">启用</el-radio>
          <el-radio v-model="formData.state" :label="1">禁用</el-radio>
        </el-form-item>
        <template v-if="isShowLogin">
          <el-form-item label="系统登录名"
                        prop="loginName">
            <el-input v-model="formData.loginName"></el-input>
          </el-form-item>
          
          <el-row>
            <el-col :span="12">
              <el-form-item label="登录密码"
                            prop="password">
                <input-toggle v-model="formData.password"
                              :hidden.sync="hiddenPassword"></input-toggle>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认密码"
                            class="is-required"
                            :rules="{validator: validateCheckPassword, trigger: ['blur']}"
                            prop="rPassword">
                <input-toggle v-model="formData.rPassword"
                              :hidden.sync="hiddenPassword1"></input-toggle>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="updateConfirm" :loading="btnLoading">确定</el-button>
        <el-button @click="updateModalVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 添加 -->
    <el-dialog :visible.sync="createModalVisible"
               :before-close="handleClose"
               @open="createModalOpened"
               @close="modalClose">
      <span slot="title">
        添加参数
      </span>
      <el-form :model="formData"
               ref="formData"
               :rules="rules"
               label-width="130px"
               size="small">
        <el-form-item label="系统类别"
                      prop="sysType">
          <el-radio-group v-model="formData.sysType">
            <el-radio :label="1">{{ formData.useType === 3 ? 'Windows Share' : 'Windows'}}</el-radio>
            <el-radio :label="2">{{ formData.useType === 3 ? 'Linux NFS' : 'Linux' }}</el-radio>
            <el-radio :label="3" v-if="formData.useType === 3">Windows NFS</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用类别"
                      prop="useType">
          <el-select v-model="formData.useType" placeholder="请选择">
            <el-option v-for="useType in useTypeSelect"
                       :key="useType.label"
                       :label="useType.label"
                       :value="useType.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Windows系统版本"
                      v-if="[1, 3].includes(formData.sysType) && [2, 10].includes(formData.useType)"
                      prop="windowsType">
          <el-radio v-model="formData.windowsType" :label="1">2003</el-radio>
          <el-radio v-model="formData.windowsType" :label="2">2008及以上</el-radio>
        </el-form-item>
        <el-form-item :label="`${formData.sysType === 1 ? '共享路径' : 'NFS地址'}`"
                      prop="shareUrl">
          <el-input v-model="formData.shareUrl"></el-input>
        </el-form-item>
        <el-form-item label="挂载点"
                      v-if="[2, 3].includes(formData.sysType)"
                      :rules="formData.useType === 7 ? [...validate.maxLength100, { required: true, message: '请输入路径', trigger: 'blur' }]: validate.maxLength100"
                      prop="mountUrl">
          <el-input v-model="formData.mountUrl"
                    v-if="formData.sysType === 2"></el-input>
          <el-select v-model="formData.mountUrl"
                     v-if="formData.sysType === 3"
                     placeholder="请选择">
            <el-option v-for="item in Array.from(new Array(26), (val, index) => (String.fromCharCode(index+65))+':')"
                       :key="item"
                       :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态"
                      prop="state">
          <el-radio v-model="formData.state" :label="0">启用</el-radio>
          <el-radio v-model="formData.state" :label="1">禁用</el-radio>
        </el-form-item>
        <template v-if="isShowLogin">
          <el-form-item label="系统登录名"
                        prop="loginName">
            <el-input v-model="formData.loginName"></el-input>
          </el-form-item>
          <el-form-item label="登录密码"
                        prop="password">
            <input-toggle v-model="formData.password"
                          :hidden.sync="hiddenPassword"></input-toggle>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="createConfirm" :loading="btnLoading">确定</el-button>
        <el-button @click="createModalVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { fetchAll, modifyOne, createOne, deleteOne } from '../../api/systemParam';
import { sysTypeMapping, windowsTypeMapping, useTypeMapping, systemStateMapping } from '../../utils/constant';
import InputToggle from '@/components/InputToggle';
import validate from '@/utils/validate';
import isEqual from 'lodash/isEqual';

export default {
  name: 'SystemParam',
  data() {
    const validateCheckPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else {
        if (value !== this.formData.password) {
          callback(new Error('两次输入的密码不一致'));
        }
        callback();
      }
    };
    const validateSysType = (rule, value, callback) => {
      if (!value || (this.formData.useType !== 3 && value === 3)) {
        this.$message.warning('请选择系统类别!');
      } else {
        callback();
      }
    }
    return {
      systemParameters: [],
      createModalVisible: false,
      updateModalVisible: false,
      listId: '',
      validateCheckPassword,
      hiddenPassword1: true,
      btnLoading: false,
      formData: {},
      originFormData: {},
      hiddenPassword: true,
      validate: validate,
      rules: {
        sysType: [{
          validator: validateSysType, trigger: 'blur'
        }],
        shareUrl: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],
        loginName: [
          { length: 20, message: '长度在20个字符以内', trigger: 'blur' },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
          { required: true, message: '请输入系统登录名', trigger: 'blur' },
        ],
        password: [
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
          { required: true, message: '请输入系统登录密码', trigger: 'blur' },
        ],
      },
    }
  },
  watch: {
    'formData.useType': function(newVal, oldVal) {
      if(oldVal === 3 && this.formData.sysType === 3) {
        this.formData.sysType = 1;
      }
    }
  },
  computed: {
    isShowLogin(){
      if(this.formData.sysType === 1 && this.formData.useType===3){
        return true
      }else if(this.formData.sysType === 1 && this.formData.useType===2 && this.formData.windowsType === 1){
        return true
      }else return false
    },
    useTypeSelect() {
      return Object.keys(useTypeMapping).map(type => {
        return {
          label: useTypeMapping[type],
          value: Number(type)
        }
      })
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    toguide(id){
      let select = id;
      localStorage.setItem('id',select);
      this.$router.push({ name: 'equipmentManage', query: { aId:'configurationManage' }})
    },
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.systemParameters = data;
          this.systemParameters.sort((a,b) =>
            {return a.state-b.state});
        })
        .catch(error => {
          error => Promise.reject(error);
        })
    },
    judgeSystem(data) {
      let str = '';
      if(sysTypeMapping[data.sysType]){
        if(data.useType === 3) {
          str += sysTypeMapping[data.sysType];
        } else {
          str += data.sysType === 1 ? 'Windows' : 'Linux';
        }
      }
      if([2, 10].includes(data.useType) && data.sysType === 1 && windowsTypeMapping[data.windowsType]){
        str += windowsTypeMapping[data.windowsType];
      }
      return str;
    },
    judgeUse(data) {
      return useTypeMapping[data.useType];
    },
    changeState(index, row) {
      this.$confirm(`此操作将${row.state === 0? '禁用' : '启用'}${row.shareUrl}，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let newRow = Object.assign({},this.systemParameters.find(list => list.id === row.id));
          newRow.state = newRow.state===0?1:0;
          modifyOne(newRow)
            .then(response => {
              this.$message.success('修改成功');
              this.systemParameters.splice(index, 1, response.data.data);
              this.systemParameters.sort((a,b) =>
                {return a.state-b.state});
            })
            .catch(error => {
              this.$message.error(error);
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作!'
          })
        });
    },
    handleUpdate(index, row) {
      this.listId = row.id;
      this.updateModalVisible = true;
    },
    updateModalOpened(index, row) {
      this.formData = Object.assign({},this.systemParameters.find(list => list.id === this.listId), {password: ''});
      this.originFormData = Object.assign({},this.systemParameters.find(list => list.id === this.listId), {password: ''});
    },
    handleCreate() {
      this.createModalVisible = true;
    },
    createModalOpened() {
      const baseFormData = {
        id: -1,
        shareUrl: '',
        loginName: '',
        password: '',
        mountUrl: '',
        windowsType: 2,
        useType: 1,
        sysType: 1,
        state: 0,
      }
      this.formData = Object.assign({}, baseFormData);
      this.originFormData = Object.assign({}, baseFormData);
    },
    handleDelete(index, row) {
      this.$confirm(
        `此操作将永久删除此参数 ，是否继续？`,
        '提示',
        { type: 'warning' }
      )
      .then(() => {
        deleteOne(row.id)
          .then(response => {
            this.$message.success(
              '删除成功'
            );
            this.systemParameters.splice(index, 1);
            this.systemParameters.sort((a,b) =>
              {return a.state-b.state});
          })
          .catch(error => {
            this.$message.error(error);
          });
      })
      .catch(() => {
        this.$message.info('已取消操作!');
      });
    },
    updateConfirm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.btnLoading=true;
          let data = {...this.formData};
          if(!(data.sysType === 1 && [2, 10].includes(data.useType))){
            delete data.windowsType
          }
          delete data.rPassword;
          modifyOne(data)
          .then(response => {
            const { data, message } = response.data;
            this.$message.success(message);
            this.updateModalVisible = false;
            this.systemParameters.splice(this.systemParameters.findIndex(systemParameter => systemParameter.id === data.id),
            1,
            data);
            this.systemParameters.sort((a,b) =>
            {return a.state-b.state});
            this.listId = '';
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {this.btnLoading=false;})
        } else {
          return false;
        }
      });
    },
    createConfirm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.btnLoading=true;
          let data = {...this.formData};
          if(!(data.sysType === 1 && [2, 10].includes(data.useType))){
            delete data.windowsType
          }
          createOne(data)
            .then(response => {
              this.$message.success(response.data.message);
              this.createModalVisible = false;
              this.systemParameters.push(response.data.data);
              this.systemParameters.sort((a,b) =>
              {return a.state-b.state});
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {this.btnLoading=false;});
        } else {
          return false;
        }
      });
    },
    handleClose(done) {
      if (!isEqual(this.formData, this.originFormData)) {
        this.$confirm('有未保存的修改，是否退出？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      } else {
        this.createModalVisible = false;
        this.updateModalVisible = false;
      }
    },
    modalClose() {
      this.$refs.formData.clearValidate();
      this.hiddenPassword = true;
      this.hiddenPassword1 = true;
    },
  },
  components: {
    InputToggle,
  }
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>