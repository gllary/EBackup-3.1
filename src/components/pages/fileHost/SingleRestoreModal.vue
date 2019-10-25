<template>
  <el-dialog custom-class="min-width-dialog"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed"
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
        <el-form-item label="恢复主机"
                      :rules="type === 'windows' ? validate.hostIp: { required: true, message: '请选择主机', trigger: 'blur' }"
                      prop="hostIp">
          <el-input v-model="formData.hostIp"
                    placeholder="请输入恢复主机IP"
                    v-if="type==='windows'"></el-input>
          <el-select  v-model="formData.hostIp"
                      v-if="type === 'linux'"
                      style="width: 100%;">
            <el-option v-for="host in selectionHosts"
                        :key="host.id"
                        :value="host.hostIp"
                        :label="`${host.hostName}(${host.hostIp})`">
              <span style="float: left">{{ host.hostName}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ host.hostIp }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type==='linux'"
                      label="恢复源路径"
                      class="is-required"
                      prop="originDetailInfo">
          <el-popover placement="bottom"
                      style="height: 300px;"
                      v-model="treeVisible">
            <div :class="$style.tree"
                 ref="outerTree"
                 id="outerTree">
                 <!-- <z-tree></z-tree> -->
              <el-tree :data="treeData"
                      node-key="id"
                      highlight-current
                      :check-strictly="true"
                      :expand-on-click-node="false"
                      @node-click="nodeClick"
                      ref="tree"
                      v-loading="treeLoading"
                      :class="$style.treeStyle">
                <div class="custom-tree-node"
                      slot-scope="{ node, data }">
                  <i-icon :name="data.documentType&&data.documentType==='2'?'folder':'papers'"
                          :class="$style.fileHostIcon"></i-icon>
                  <el-tooltip :content="data.fileName"
                              placement="top-start">
                    <span :class="$style.treeName">{{ data.fileName }}</span>
                  </el-tooltip>
                  <span :class="$style.treeFileSize" v-if="data.documentType==='1'">{{ data.length | filterToTb }}</span>
                  <span :class="$style.treeFileTime">{{ data.lastUpTime | filterToTime }}</span>
                </div>
              </el-tree>
            </div>
            <el-input v-model="formData.originDetailInfo"
                      ref="originPathInput"
                      slot="reference"></el-input>
          </el-popover>
        </el-form-item>
				<el-form-item label="恢复目标路径"
                      prop="detailInfo">
          <el-input v-model="formData.detailInfo"></el-input>
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
        <el-form-item v-if="type==='windows'" class="is-required"
                    label="覆盖策略"
                    prop="reveringStrategy">
          <el-radio-group v-model="formData.recoveringStrategy">
            <el-radio v-for="s in Object.keys(recoveringStrategys)"
                      :key="s"
                      :label="Number(s)">{{ recoveringStrategys[s] }}</el-radio>
          </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary"
                 @click="confirmBtnClick"
                 :loading="btnLoading">确定</el-button>
      <el-button @click="cancelButtonClick">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import dayjs from 'dayjs';
import { restorePlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import validate from '@/utils/validate';
import { recoveringStrategyMapping } from '@/utils/constant';
import {
  maxLengthFn,
  fmtSizeFn
} from '@/utils/common';
import {
  fetchAll,
  fetchOriginPath,
} from '@/api/fileHost';
import IIcon from '@/components/IIcon';
import zTree from '@/components/common/zTree';
const baseFormData = {
  hostIp: '',
  // linux
  originDetailInfo: '',
  // linux
  documentType: '',
  // windows
  recoveringStrategy: 1,
  detailInfo: '',
  loginName: '',
  password: '',
};

export default {
  name: 'singleRestorePlanModal',
  mixins: [restorePlanModalMixin],
  props: {
    resultId: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true
    }
  },
  components: {
    IIcon,
    zTree
  },
  data() {
    const originPathValidate = (rule, value, callback) => {
      if (!this.formData.originDetailInfo ) {
        callback(new Error('请输入文件恢复源路径'));
      } else if (maxLengthFn(value, 255)) {
        callback(new Error('长度在255个字符以内，注：中文占2个字符'));
      } else if (!this.fileHostOriginPath.map(originPath => originPath.path).includes(value)) {
        callback(new Error('文件恢复源路径不存在'));
      } else {
        callback();
      }
    };
    return {
      // type: 'dm',
      formData: Object.assign({}, baseFormData), // 备份数据
      originFormData: Object.assign({}, baseFormData), // 原始数据
      recoveringStrategys: recoveringStrategyMapping,
      treeVisible: false,
      validate: validate,
      rules: {
        originDetailInfo: [
          {
            validator: originPathValidate,
            trigger: 'change'
          }
        ],
        detailInfo: validate.targetPath,
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
      },
      selectionHosts: [],
      fileHostOriginPath: [],
      treeLoading: false,
      treeData: []
    };
  },
  computed: {
    // treeData() { // 数组转树状结构对象, 用于生成单次立即恢复模态框中的源路径树状
    //   // let tree = [];
    //   // let tree = this.fileHostOriginPath.filter(father => {
    //   //   // let branchArr = this.fileHostOriginPath.filter(child => {
    //   //   //   return father.id === child.parentId && child.id !== child.parentId
    //   //   // })
    //   //   // if(branchArr.length>0) {
    //   //   //   father.children = branchArr;
    //   //   // }
    //   //   return father.id === father.parentId
    //   // });
    //   return tree
    // }
  },
  watch: {
    '$store.state.nav.clientWidth'( val) {
      if(this.$refs && this.$refs.originPathInput){
        this.$refs.outerTree.style.width = this.$refs.originPathInput.$el.offsetWidth + 'px'
      }
    }
  },
  filters: {
    // 时间戳转日期
    filterToTime(date) {
      if(!date)
        return '-'
      return new Date(parseInt(date)).toLocaleDateString().replace(/\//g, '-') + ' ' +
             new Date(parseInt(date)).toTimeString().substr(0, 8)
    },
    // 单位：b->tb
    filterToTb(size) {
      if(!size)
        return '-'
      else
      return fmtSizeFn(Number(size));
    }
  },
  destroyed(){
    this.worker = null;
  },
  methods: {
    confirmBtnClick() {
      this.$refs.singleRestorePlanForm.validate(valid => {
        if (valid) {
          const name = dayjs().format('YYYYMMDDHHmmss');
          // 单次执行
          const config = { ...this.formData, timeStrategy: 1, singleTime: '' };
          this.$emit('confirm', { id: this.resultId, data: { name, config } });
        }
      });
    },
    modalClosed() {
      this.formData = { ...baseFormData };
      this.$refs.singleRestorePlanForm.clearValidate();
      this.hiddenPassword = true;
      if(this.type==='linux') {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    modalOpened() {
      if (this.type === 'linux') {
        this.getHosts();
        this.getOriginPath();
      }
      this.$nextTick( () => {
        this.$refs.singleRestorePlanForm.clearValidate();
        if(this.$refs.outerTree) { // 源路径树形图宽度 = 源路径输入框宽度
          // 外层父元素渲染在最外层且存在padding值
          let treeParentNode = document.getElementById('outerTree').parentNode;
          treeParentNode.style.paddingLeft = 0;
          treeParentNode.style.paddingRight = 0;
          this.$refs.outerTree.style.width = this.$refs.originPathInput.$el.offsetWidth + 'px';
          const that = this;
        }
      });
    },
    getOriginPath() {
      this.treeLoading = true;
      this.treeData = [];
      fetchOriginPath(this.resultId)
        .then(res => {
          const { data: fileHostPath } = res.data;
          this.fileHostOriginPath = fileHostPath;
          const dataFmt = data => {
            const length = data.length;
            let tree = [];
            for(let i =length;i--;){
              let aa = [];
              for(let j =length;j--;j){
                if(data[i].id === data[j].parentId && data[j].id !== data[j].parentId){
                  aa.push(data[j]);
                }
              }
              data[i].children = aa;
              if(data[i].id === data[i].parentId){
                tree.push(data[i]);
              }
            }
            return tree;
          }
          this.worker = this.$worker.run(dataFmt, [fileHostPath])
            .then(res => {
              this.treeData = res;
              this.treeLoading = false;
            })
            .catch(e => {
              this.treeLoading = false
            });
        })
        .catch(error => {
          this.$message.error(error);
          this.treeLoading = false;
        });
    },
    getHosts() {
      fetchAll() // 获取文件列表信息
        .then(res => {
          const { data: infos } = res.data;
          this.selectionHosts = infos.filter(info => info.osName==='Linux');
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    nodeClick(item, checked, node) {
      if(checked) {
        this.formData.originDetailInfo = item.path;
        this.formData.documentType = item.documentType;
      } else {
        this.formData.originDetailInfo = '';
      }
      this.treeVisible = false;
    },
  },
};
</script>
<style lang="scss" module>
.treeFileSize,
.treeFileTime {
  color: #909399;
  font-style: italic;
  font-size: 0.9em;
  margin-top: 0.2em;
}
.treeName {
  width: 280px;
  display: inline-block;
  overflow: hidden;
}
.treeFileSize {
  position: absolute;
  right: 20px;
}
.treeFileTime {
  position: absolute;
  right: 90px;
}
.fileHostIcon {
  vertical-align: -0.2em;
  height: 1.4em;
}
.tree{
  overflow-y: auto;
  // overflow-x: scroll;
  // width:564px;
  max-height: 200px;
  .el-tree {
    max-width: 100%;
    display:inline-block !important;
  }
}
.treeStyle {
  .treeStyle .el-tree-node.is-expanded {
    background-color: blue;
    .el-tree-node__children {
      height: 300px;
      overflow: scroll;
    }
  }
}
</style>
