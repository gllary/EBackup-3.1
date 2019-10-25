<template>
    <div id="areaTree">
      <div class="tree-box">
        <div class="zTreeDemoBackground left">
          <ul id="treeDemo" class="ztree"></ul>
        </div>
      </div>
    </div>
</template>

<script>
import $ from 'jquery';
import "../../../plugins/ztree/js/jquery.ztree.core.min.js";
import "../../../plugins/ztree/js/jquery.ztree.excheck.min.js";
import {
  fetchAll,
  fetchChildNodes,
} from '@/api/file';
export default {
  name: 'zTree',
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
    hostId: {
      type: Number
    }
  },
  data() {
    return {
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
          onCheck: this.zTreeOnCheck
        },
      },
      nodes: null
    };
  },
  computed: {
    driverNodes() {
      return this.fatherNodes.map(node => {
        return {
          sourceFileName: node.fileDriver,
          sourcePath: node.fileDriver,
          sourceFileName: node.fileDriver,
          isParent: true
        }
      })
    }
  },
  methods: {
    zTreeOnClick(event, treeId, treeNode) {
      var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
      const selectPath = treeNode.sourcePath;
      const _this= this;
      if(treeNode.level === 0) {
        const firstNodes = this.fatherNodes.find(node => node.fileDriver === selectPath).fileNodes;
        _this.nodes = firstNodes.map(node => {
          node.isParent = (Number(node.documentType) === 1);
          return node;
        })
        if(!treeNode.children&&treeNode.isParent) {
          treeObj.addNodes(treeNode, this.nodes);
        }
      } else if(treeNode.isParent){
        fetchChildNodes({ id: this.hostId, data: selectPath })
          .then(res => {
            const { data } = res.data;
            _this.nodes = data.map(node => {
              node.isParent = (Number(node.documentType) === 1);
              return node;
            })
            if(!treeNode.children&&treeNode.isParent) {
              treeObj.addNodes(treeNode, this.nodes);
            }
          })
          .catch(error => {
            this.$message.error(error);
          })
      }
    },
    zTreeOnCheck(event, treeId, treeNode) {
      var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
      this.$emit('selectNodes', treeObj.getCheckedNodes(true));
    },
    // freshArea: function() {
    //   this.zNodes = this.fileHostOriginPath;
    //   $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes);
    // },
    // getOriginPath() {
    //   // 测试数据
    //   fetchChildNodes(123)
    //     .then(res => {
    //       const { data: fileHostPath } = res.data;
    //       this.zNodes = fileHostPath;
    //       $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes);
    //     })
    //     .catch(error => {
    //       this.$message.error(error);
    //     });
    // },
  },
  mounted() {
    $.fn.zTree.init($('#treeDemo'), this.setting, this.driverNodes);
    // this.getOriginPath();
    // $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes);
  },
};
</script>

<style>
@import '../../../plugins/ztree/css/zTreeStyle/zTreeStyle.css';
#areaTree {
  border: 1px solid #e5e5e5;
  margin-bottom: 2px;
  border-radius: 4px;
  overflow-y: auto;
  max-height: 300px;
}
</style>
