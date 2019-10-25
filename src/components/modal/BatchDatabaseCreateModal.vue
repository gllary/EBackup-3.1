<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @close="modalClosed">
      <span slot="title">
        批量添加数据库
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="itemCreateForm"
               size="small">
        <el-form-item label="所属设备"
                      prop="hostId">
          <span slot="label">所属设备
              <el-popover placement="top" trigger="hover"
                  content="类型为生产环境的设备"
                  >
                  <i class="el-icon-info" slot="reference"></i>
              </el-popover>
          </span>    
          <el-select v-model="formData.hostId" :disabled="scanBtnDisable"
                     style="width: 100%;">
            <el-option v-for="host in availableHosts"
                       :key="host.id"
                       :label="`${host.name}(${host.hostIp})`"
                       :value="host.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="端口"
                      prop="dbPort">
          <el-input v-model="formData.dbPort"
                    placeholder="请输入端口号" :disabled="scanBtnDisable"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="管理员账号"
                          prop="adminUser">
              <el-input v-model="formData.adminUser" :disabled="scanBtnDisable"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理员密码"
                          prop="adminPassword" >
              <input-toggle v-model="formData.adminPassword" :disabled="scanBtnDisable"
                            :hidden.sync="hiddenPassword"></input-toggle>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item >
              <el-button type="primary" @click="scanDatabase" :loading="scanBtnLoading" :disabled="scanBtnDisable">扫描数据库</el-button>
              <el-button @click="reset" :disabled="!scanBtnDisable">返回</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="数据库" v-if="showDatabase">
          <el-row style="width:80%" >
            <el-col :span="6">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            </el-col>
            <el-col :span="12" :offset="6">
              <el-input placeholder="请输入名称" v-model="inputSearch" @keyup.enter.native="searchByName" class="input-with-select" size="small">
                <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
              </el-input>
            </el-col>
            
            <el-table :data="curTableData" @select="selectDbChangeFn"  ref="refTable" size="small" 
                  @select-all="((selection) => selectAll(selection, curTableData))">
                <el-table-column   
                    type="selection"
                    align="left"
                    width="55">
                </el-table-column>
                <el-table-column
                    type="index"
                    align="left"
                    width="50">
                    <template slot-scope="scope">
                      {{scope.$index+1+(currentPage-1)*pagesize}}
                    </template>
                </el-table-column>
                <el-table-column label="数据库名称"
                            header-align="center"
                            align="center"
                            min-width="200">
                    <template slot-scope="scope">
                      {{scope.row}}
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="text-align:right;margin-top:10px;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pagesize"
                small
                background
                layout="prev, pager, next, jumper"
                v-if="tableData"
                :total="tableData|filterBySearch(filterItem).length">
            </el-pagination>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading" :disabled="comfirBtnDisable">确定</el-button>
        <el-button @click="cancelBtnClick()">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { genModalMixin } from '../mixins/modalMixins';
import { scanDatabase } from '../../api/sqlserver';

const vm = {
  name: 'batchDatabaseCreateModal',
  mixins: [genModalMixin('database')],
  data() {
    return {
      showDatabase: false,
      scanBtnLoading: false,
      scanBtnDisable: false,
      isIndeterminate: false,
      checkAll: false,
      pagesize: 5,
      currentPage: 1,
      filterItem: '',
      inputSearch: '',
      currentSelect: [],
      tableData: [],
      confirmData:'',
      rules: {
        adminUser: [{
          required: true,
          message: `请输入管理员登录账号`,
          trigger: 'blur',
        },
        {
          length: 20,
          message: '长度在20个字符以内',
          trigger: 'blur'
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ],
        adminPassword: [{
          required: true,
          message: `请输入管理员登录密码`,
          trigger: 'blur',
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        }],
      }
    };
  },
  created(){
    this.formData = {
      dbPort: 1433,
      hostId: '',
      adminUser: '',
      adminPassword: ''
    }
    this.originFormData = {...this.formData}
  },
  filters: {
    filterBySearch(tableData, arg) {
      if (!tableData) {
        return '';
      }
      return tableData.filter(v => v.toLowerCase().includes(arg.toLowerCase()));
    },
  },
  watch: {
    currentSelect(val){
      this.isIndeterminate = this.currentSelect.length > 0 && this.currentSelect.length !== this.tableData.length ? true:false;
      this.checkAll = this.currentSelect.length === this.tableData.length && this.currentSelect.length > 0 ? true : false;
    }
  },
  computed:{
    curTableData(){
      let data = [];
      data = this.tableData.filter(v => v.toLowerCase().includes(this.filterItem.toLowerCase()));
      data = data.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
      if(this.currentSelect && this.currentSelect.length > 0){
        this.$nextTick( () => {
          data.forEach( e => {
              if(this.currentSelect.includes(e)){
              this.$refs.refTable.toggleRowSelection(e,true);
              }
          });
        });
      }
      return data;
    },
    comfirBtnDisable(){
      return this.currentSelect.length > 0 ? false: true;
    }
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$emit('confirm', {...this.confirmData, dbNames: this.currentSelect});
    },
    modalClosed() {
      this.$refs.itemCreateForm.resetFields();
      this.confirmData = '';
      this.reset();
      this.hiddenPassword = true;
    },
    // 根据设备，扫描数据库
    scanDatabase(){
      this.$refs.itemCreateForm.validate(valid => {
        if (valid) {
          const {
            adminPassword,
            dbPort,
            adminUser,
            hostId,
          } = this.formData;
          this.confirmData = {
            adminPassword,
            dbPort: Number(dbPort),
            adminUser,
            // 创建对象 传入host对象 0609
            host: this.availableHosts.find(host => host.id === hostId)
          };
          this.scanBtnLoading = true;
          scanDatabase(this.confirmData).then(res => {
            const {data} = res.data;
            this.tableData = data;
            this.scanBtnDisable = true;
            this.showDatabase = true;
          }).catch(error => {
            this.$message.error(error);
          }).then( () => {
            this.scanBtnLoading = false;
          });
        } else {
          return false;
        }
      });
    },
    selectDbChangeFn(selectData, row){
      if(!this.currentSelect.includes(row)){
        this.currentSelect.push(row);
      }else if (!selectData.includes(row)){
        //需要优化，匹配到即跳出循环
        this.currentSelect = this.currentSelect.filter( e => {
          if(e === row){
            return false;
          }
          return true;
        });
      }
    },
    selectAll(selection,list){
      if(selection.length === 0){
        this.currentSelect = this.currentSelect.filter( e => {
          let flag = true;
          list.forEach( i => {
            if(i === e){
              flag = false;
            }
          });
          return flag;
        });
      }else{
        let data = [];
        list.forEach( e => {
          let flag = true;
          this.currentSelect.forEach( i => {
            if(i === e){
                flag = false;
            }
          });
          flag && data.push(e);
        });
        this.currentSelect.push(...data);
      }
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
    },
    searchByName() {
      this.filterItem = this.inputSearch;
      this.currentPage = 1;
    },
    handleCheckAllChange(val){
      this.currentSelect = val ? this.tableData : [];
    },
    reset(){
      this.tableData = [];
      this.currentSelect = [];
      this.currentPage = 1;
      this.showDatabase = false;
      this.scanBtnDisable = false;
      this.isIndeterminate = false;
      this.checkAll = false;
    }
  },
  components: {
    InputToggle,
  },
};
export default vm;
</script>
<style>
</style>
