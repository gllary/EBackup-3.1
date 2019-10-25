<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               custom-class="min-width-dialog"
               @open="modalOpenFn"
               @cancel="cancelButtonClick">
      <span slot="title">
        请选择恢复文件
      </span>
      <div id="areaTree">
        <div class="tree-box">
          <div class="zTreeDemoBackground left">
            <ul id="resultTreeDemo" class="ztree"></ul>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirmBtnClick">确定</el-button>
        <el-button @click="cancelButtonClick">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import $ from 'jquery';
import "../../../../plugins/ztree/js/jquery.ztree.core.min.js";
import "../../../../plugins/ztree/js/jquery.ztree.excheck.min.js";
import { fmtSizeFn } from '@/utils/common';
import dayjs from 'dayjs';
import { fetchChildNodes } from '@/api/file';
export default {
  name: 'ResultSourcePath',
  props: {
    visible: {
      type: Boolean
    },
    fatherNodes: {
      type: Array,
      default: function() {
        return [];
      }
    },
    nodes: {
      type: Array,
      default: function() {
        return []
      }
    },
    hostId: {
      type: Number
    }
  },
  data() {
    return {
      childNodes: [],
      checkedNodes: [],
      setting: {
        check: {
            enable: true,
            chkboxType: { "Y": "", "N": "" }
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'sourcePath',
            pIdKey: 'sourceParentPath'
          },
          key: {
            name: 'sourceFileName'
          }
        },
        callback: {
          onClick: this.zTreeOnClick,
          onExpand: this.zTreeOnExpand,
          onCheck: this.zTreeOnCheck,
          beforeCheck: this.zTreeBeforeCheck
        },
        view: {
          addDiyDom: this.addDiyDom
        }
      },
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
    firstNodes() {
      return this.fatherNodes.map(node => {
        node.isParent = (Number(node.documentType) === 2);
        return node;
      })
    }
  },
  methods: {
    fmtSize(size) {
      return fmtSizeFn(size);
    },
    fmtDate(date) {
      if(!date)
        return '-'
      return new Date(parseInt(date)).toLocaleDateString().replace(/\//g, '-') + ' ' +
             new Date(parseInt(date)).toTimeString().substr(0, 8)
    },
    confirmBtnClick() {
      this.$emit('selectNodes', this.checkedNodes);
      this.modalVisible = false;
    },
    modalOpenFn(){
      this.$nextTick(() => {
        this.checkedNodes = [...this.nodes];
        $.fn.zTree.init($('#resultTreeDemo'), this.setting, this.firstNodes);
      })
    },
    cancelButtonClick() {
      this.modalVisible = false;
    },
    fetchNextNodes(treeNode) {
      var treeObj = $.fn.zTree.getZTreeObj("resultTreeDemo");
      const selectPath = treeNode.sourcePath;
      const _this= this;
      if(treeNode.isParent){
        fetchChildNodes({ id: this.hostId, path: selectPath })
          .then(res => {
            const { data } = res.data;
            _this.childNodes = data.map(node => {
              node.isParent = (Number(node.documentType) === 2);
              node.fileSize = this.fmtSize(node.size);
              node.time = this.fmtDate(node.createTime);
              return node;
            })
            if(!treeNode.children&&treeNode.isParent) {
              treeObj.addNodes(treeNode, this.childNodes);
            }
          })
          .catch(error => {
            this.$message.error(error);
          })
      }
    },
    zTreeOnClick(event, treeId, treeNode) {
      this.fetchNextNodes(treeNode);
    },
    zTreeOnExpand(event, treeId, treeNode) {
      this.fetchNextNodes(treeNode);
    },
    zTreeOnCheck(event, treeId, treeNode) {
      var treeObj = $.fn.zTree.getZTreeObj("resultTreeDemo");
      this.checkedNodes = Array.from(new Set(treeObj.getCheckedNodes(true).map(node => node.sourcePath).concat(this.nodes)));
    },
    zTreeBeforeCheck(treeId, treeNode) {
      if(this.checkedNodes.length === 3 && !treeNode.checked) {
        this.$message.warning('请选择3个以内的文件数量！');
        return false;
      } else if (this.checkedNodes.includes(treeNode.sourcePath) && !treeNode.checked) {
        this.$message.warning('该文件已选择！');
        return false;
      }
      return true;
    },
    addDiyDom(treeId, treeNode) {
      let aObj = $("#" + treeNode.tId + "_a");
      aObj.addClass('text-color');
      if(treeNode.time && treeNode.documentType === 1) {
        let date = `<span class="treeFileTime">${treeNode.time}</span>`;
        aObj.append(date);
      }
      if(treeNode.fileSize && treeNode.documentType === 1) {
        let size = `<span class="treeFileSize">${treeNode.fileSize}</span>`;
        aObj.append(size);
      }
    }
  }
}
</script>
<style>
@import '../../../../plugins/ztree/css/zTreeStyle/zTreeStyle.css';
#areaTree {
  border: 1px solid #e5e5e5;
  margin-bottom: 2px;
  border-radius: 4px;
  overflow-y: auto;
  max-height: 300px;
}
#areaTree li {
  position: relative;
}
.treeFileSize,
.treeFileTime {
  color: #909399;
  font-style: italic;
  font-size: 0.9em;
  margin-top: 0.2em;
}
.treeFileSize {
  position: absolute;
  right: 170px;
}
.treeFileTime {
  position: absolute;
  right: 5px;
}
</style>

