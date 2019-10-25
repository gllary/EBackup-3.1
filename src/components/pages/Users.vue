<template>
  <div id="app">
    <el-row type="flex" class="row-bg" justify="end">
      <el-form inline>
          <el-form-item style="float: right;">
              <el-button type="success"
                        @click="toguide('roleManage')">操作说明</el-button>
          </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="danger" :disabled="delDisabled" @click="delAll()">删除</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="handleCreate()">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table v-loading="loading"
                  :element-loading-background="themeColor.loadingBackGround"
                  element-loading-text="拼命加载中..."
                  :data="tableUsers|filterAdmin"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column prop="loginName" label="账户" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="userName" label="姓名" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="160" align="center">
          </el-table-column>
          <el-table-column prop="receiveState" label="接收状态" min-width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.receiveState === 1">
                <i class="el-icon-circle-check" style="color: #67C23A;font-size: 18px">
                </i>
              </span>
              <span v-else>
                <i class="el-icon-remove" style="color: #909399;font-size: 18px"></i>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态"
                                        :filters="[{ text: '启用', value: 1 }, { text: '禁用', value: 0 }]"
                                        :filter-method="filterState"
                                        filter-placement="bottom-end"
                                        min-width="120"
                                        align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.state === 1">
                <i class="el-icon-circle-check" style="color: #67C23A;font-size: 18px">
                </i>
              </span>
              <span v-else>
                <i class="el-icon-remove" style="color: #909399;font-size: 18px"></i>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="角色" min-width="170" align="center">
            <template slot-scope="scope">
              <span v-for="item in scope.row.roles" :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">{{ item.name }}<br></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="primary"
                        icon="el-icon-edit"
                        circle
                        size="mini"
                        :class="$style.miniCricleIconBtn"
                        @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button type="danger"
                        icon="el-icon-delete"
                        circle
                        size="mini"
                        :class="$style.miniCricleIconBtn"
                        @click="handleDelete(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 编辑用户 begin-->
    <el-dialog title="修改用户信息"
               :visible.sync="dialogUpdateVisible"
               @close="modalClosed">
      <el-form :model="update"
               ref="update"
               label-width="110px"
               status-icon
               :rules="rules"
               size="small">
        <el-form-item label="账户" prop="loginName">
          <el-input v-model="update.loginName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="update.userName"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱"
                          prop="email"
                          :rules="emailRule"
                          ref="emailItem">
              <el-input v-model="update.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="receiveState">
              <el-checkbox v-model="update.receiveState"
                           :true-label="1"
                           :false-label="0"
                           @change="receiveChange">接收</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="权限">
              <el-select v-model="rolesSelected" multiple collapse-tags placeholder="请选择">
                <el-option v-for="item in rolesAll" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-radio-group v-model="update.state">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="密码">
          <el-button @click="updatePass = !updatePass">修改密码</el-button>
          <el-tooltip content="重置后密码为：Xfback@201806！" placement="right">
            <el-button @click="handlereset(update.id)" :disabled="passDisable">重置密码</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="updatePass">
          <el-input v-model="update.password" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass" v-if="updatePass">
          <el-input v-model="update.checkpass" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" :loading="updateLoading" @click="updateUser">确定</el-button>
        <el-button @click="dialogUpdateVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户 end-->
    <!-- 创建用户 begin-->
    <el-dialog title="创建用户"
               :visible.sync="dialogCreateVisible">
      <el-form :model="create"
               status-icon
               :rules="rules"
               ref="create"
               label-width="110px"
               size="small">
        <el-form-item label="账户" prop="loginName">
          <el-input v-model="create.loginName"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="create.userName"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" 
                          prop="email"
                          :rules="emailRule"
                          ref="emailItem">
              <el-input v-model="create.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="receiveState">
              <el-checkbox v-model="create.receiveState"
                           :true-label="1"
                           :false-label="0"
                           @change="receiveChange">接收</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="权限">
              <el-select v-model="rolesSelected" multiple collapse-tags placeholder="请选择">
                <el-option v-for="item in rolesAll" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-radio-group v-model="create.state">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="密码" prop="password">
          <el-input v-model="create.password" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input v-model="create.checkpass" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" :loading="createLoading" @click="createUser">确定</el-button>
        <el-button @click="dialogCreateVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 创建用户 end-->
  </div>
</template>

<script>
import {
  createUserInfo,
  getUsersInfo,
  updateUserInfo,
  deleteUserInfo,
  deleteUsersInfo,
} from '../../api/user';

import {  validateLength } from '../../utils/common';
import themeMixin from '@/components/mixins/themeMixins';

const rolesUser = [
  // {
  //   id: 'admin',
  //   name: '超级管理员',
  // },
  {
    id: 'file admin',
    name: '文件管理员',
  },
  {
    id: 'oracle dba',
    name: 'Oracle管理员',
  },
  {
    id: 'sql server dba',
    name: 'SQL Server管理员',
  },
  {
    id: 'mysql dba',
    name: 'MySql管理员'
  },
  {
    id: 'db2 dba',
    name: 'DB2管理员'
  },
  {
    id: 'dm dba',
    name: '达梦管理员'
  },
  {
    id: 'vm admin',
    name: '虚拟机管理员',
  },
  {
    id: 'application admin',
    name: '应用服务管理员'
  },
  {
    id: 'sybase dba',
    name: 'Sybase管理员'
  },
  {
    id: 'cache dba',
    name: 'Cache管理员'
  },
  {
    id: 'insql dba',
    name: 'InSql管理员'
  },
  {
    id: 'informix dba',
    name: 'Informix管理员'
  },
  {
    id: 'postgresql dba',
    name: 'PostgreSQL管理员'
  }
];

export default {
  mixins: [themeMixin],
  created() {
    this.getUsers();
  },
  filters: {
    filterAdmin(tableData) {
      if(!tableData) {
        return '';
      } else {
        return tableData.filter(v => v.roles.map(i => i.id).indexOf('admin')<0);
      }
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (this.dialogCreateVisible && value !== this.create.password) {
        callback(new Error('两次输入密码不一致!'));
      } else if (this.dialogUpdateVisible && value !== this.update.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const validateName = (rule, value, callback) => {
      const data = this.tableUsers;
      let j = 0;
      for (let i = 0; i < data.length; i++) {
        if (value === data[i].loginName && this.dialogCreateVisible === true) {
          callback(new Error('账户已存在!'));
          j = 1;
        }
      }
      if (j === 0) {
        callback();
      }
    };
    return {
      loading: true,
      delDisabled: false,
      passDisable: false,
      createLoading: false,
      updateLoading: false,
      dialogCreateVisible: false, // 创建弹框的显示状态
      dialogUpdateVisible: false, // 编辑弹框的显示状态
      listIndex: '', // s索引
      updatePass: false,
      rules: {
        loginName: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { validator: validateLength(20), trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]+$/, message: '账户只能为字母和数字' },
          { validator: validateName },
        ],
        userName: [
          { validator: validateLength(10), trigger: 'blur' },
          { min: 2, max: 25, message: '长度在 2 到 25 个字符' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validateLength(50), trigger: 'blur' },
          { min: 6, message: '长度在不能小于6个字符' },
        ],
        checkpass: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: validateLength(40),
            trigger: 'blur'
          },
          {
            pattern: /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
            message: '邮箱格式不正确',
            trigger: 'blur',
          }
        ],
      },
      rolesAll: rolesUser,
      rolesSelected: [],
      tableUsers: [],
      multipleSelection: [], // 列表复选框
      update: {
        id: '',
        loginName: '',
        userName: '',
        state: '',
        roles: [],
        email: '',
        receiveState: 1,
      },
      create: {
        loginName: '',
        userName: '',
        state: 1,
        password: '',
        checkpass: '',
        roles: [],
        email: '',
        receiveState: 1,
      },
    };
  },
  computed: {
    emailRule() {
      return (this.dialogCreateVisible===true&&this.create.receiveState===1)
             || (this.dialogUpdateVisible===true&&this.update.receiveState===1)
             ?this.rules.email
             :[{ required: false, message: '请输入邮箱', trigger: 'blur'},
               {
                pattern: /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
                message: '邮箱格式不正确',
                trigger: 'blur'
               }];
    }
  },
  methods: {
    toguide(id){
      let select = id;
      localStorage.setItem('id',select);
      this.$router.push({ name: 'equipmentManage', query: { aId:'roleManage' }})
    },
    // 筛选状态
    filterState(value, row) {
      return row.state === value;
    },
    // 创建
    handleCreate() {
      this.rolesSelected = [];
      this.dialogCreateVisible = true;
      this.$nextTick(() => {
        // 等待dom同步后打开模态框
        this.$refs.create.resetFields();
      });
    },
    // 编辑
    handleEdit(index, row) {
      const newRow = Object.assign({password: '', checkpass: ''}, row);
      this.update = Object.assign({password: '', checkpass: ''}, row);
      this.dialogUpdateVisible = true;
      this.passDisable = false;
      this.rolesSelected = newRow.roles.map(item => item.id);
      // 记录索引
      this.listIndex = index;
      this.updatePass = false;
    },
    // 重置密码
    handlereset(value) {
      this.$confirm(
        `此操作将对账户 ${this.update.loginName} 的密码重置，是否继续？`,
        '提示',
        { type: 'warning' }
      )
        .then(() => {
          // 向请求服务端重置
          const resetUpdate = {
            id: value,
            password: 'Xfback@201806!',
          };
          updateUserInfo(resetUpdate)
            .then(response => {
              this.$message.success(response.data.message);
              this.passDisable = true;
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(() => {
          this.$message.info('已取消操作!');
        });
    },
    // 删除单个
    handleDelete(index, row) {
      this.$confirm(
        `此操作将永久删除账户 ${row.loginName} ，是否继续？`,
        '提示',
        { type: 'warning' }
      )
        .then(() => {
          // 向请求服务端删除
          deleteUserInfo(row.id)
            .then(response => {
              this.$message.success(
                `成功删除了用户 ${row.loginName}!${response.data.message}`
              );
              this.tableUsers.splice(
              this.tableUsers.findIndex(user => user.id === row.id),
              1);
              // this.getUsers();
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(() => {
          this.$message.info('已取消操作!');
        });
    },
    // 复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取用户列表
    getUsers() {
      this.loading = true;
      getUsersInfo()
        .then(response => {
          this.tableUsers = response.data.data;
          // this.pagination.tableRows = this.tableUsers.length;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error);
        });
    },
    // 创建用户
    createUser() {
      this.$refs.create.validate(valid => {
        if (valid) {
          this.createLoading = true;
          createUserInfo(this.create)
            .then(response => {
              this.tableUsers.unshift(response.data.data);
              this.$message.success(response.data.message);
              this.dialogCreateVisible = false;
              this.createLoading = false;
            })
            .catch(error => {
              this.createLoading = false;
              this.$message.error(error);
            });
        } else {
          return false;
        }
      });
    },
    // 编辑用户
    updateUser() {
      this.$refs.update.validate(valid => {
        if(valid) {
          this.updateLoading = true;
          delete this.update.checkpass;
          if (!this.updatePass) delete this.update.password;
          updateUserInfo(this.update)
          .then(response => {
            const { data, message } = response.data
            // 根据索引，赋值到list制定的数
            this.tableUsers.splice(
            this.tableUsers.findIndex(user => user.id === data.id),
            1,
            data);
            this.$message.success(message);
            this.dialogUpdateVisible = false;
            this.updateLoading = false;
          })
          .catch(error => {
            this.updateLoading = false;
            this.$message.error(error);
          });
        } else {
          return false;
        }
      })
    },
    modalClosed() {
      this.$refs.update.clearValidate();
    },
    //邮件接收状态改变时，移除表单验证结果
    receiveChange(val) {
      if(val===0)
        this.$refs.emailItem.clearValidate();
    },
    // 批量删除
    delAll() {
      this.$confirm(
        `此操作将永久删除 ${
          this.multipleSelection.length
        } 条用户信息, 是否继续?`,
        '提示',
        {
          type: 'warning',
        }
      )
        .then(() => {
          const ids = [];
          this.multipleSelection.map(item => {
            ids.push(item.id);
          });
          const data = { ids };
          // 向请求服务端删除
          deleteUsersInfo(data)
            .then(response => {
              this.$message.success(
                `删除了 ${this.multipleSelection.length} 条用户信息! ${
                  response.data.message
                }`
              );
              this.getUsers();
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(() => {
          this.$message.info('已取消操作!');
        });
    },
    // 转换Roles结构
    transformRoles(newVal) {
      /* this.create.roles = newVal.map(i=> {
        for(let j=0; j< rolesUser.length; j++){
          if(rolesUser[j].id === i){
             return rolesUser[j]
          }
        }
      }); */
      this.create.roles = newVal;
      this.update.roles = newVal;
    },
  },
  watch: {
    rolesSelected: function(newVal) {
      this.transformRoles(newVal);
    },
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>