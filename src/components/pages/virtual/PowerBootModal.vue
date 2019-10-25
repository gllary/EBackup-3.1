<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               class="custom-scrollbar power-boot-dialog"
               width="80%"
               :visible.sync="modalVisible"
               title="虚拟机自启"
               @close="modalClosed"
               @open="dialogOpen">
      <el-row :gutter="15"
              type="flex"
              align="middle">
        <el-col :span="10"
                :offset="vmType === 1 ? 0 : 1">
          <div class="header-font">
            <span class="bold">手动启动列表</span>
            <span class="fr">已选 {{ checkSourceData.length }}条 / 共 {{ sourceData.length }}条</span>
          </div>
          <div class="main">
            <div class="head">
              <el-checkbox :indeterminate="sourceIndeterminate"
                            v-model="isCheckAllSourceData">全选</el-checkbox>
              <el-input placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="searchSourceData"
                        size="mini"
                        style="float: right; width: 50%"></el-input>
            </div>
            <div class="source-content custom-scrollbar">
              <el-checkbox-group v-model="checkSourceData"
                                  v-if="sourceVirtuals.length">
                <ul>
                  <li v-for="(virtual, index) in sourceVirtuals"
                      :key="virtual.id"
                      class="list-group-item">
                    <el-checkbox :label="virtual.id">
                      <span class="index">{{ index + 1 }}、</span>
                      <span class="hight-light-content"
                            v-html="highLightMatch(virtual.vmName, searchSourceData, index)"></span>
                    </el-checkbox>
                  </li>
                </ul>
              </el-checkbox-group>
              <div class="null-data"
                    v-else>暂无数据</div>
            </div>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="btn-content">
            <div class="btn-content-top">
              <el-button :type="checkSourceData.length ? 'primary' : 'info'"
                          :disabled="!checkSourceData.length"
                          class="btn"
                          icon="el-icon-arrow-right"
                          @click="moveLeft"
                          circle></el-button>
            </div>
            <div class="btn-content-bottom">
              <el-button :type="checkTargetData.length ? 'primary' : 'info'"
                          :disabled="!checkTargetData.length"
                          class="btn"
                          icon="el-icon-arrow-left"
                          @click="moveRight"
                          circle></el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="header-font">
            <span class="bold">自动启动列表</span>
            <span class="fr">已选 {{ checkTargetData.length }}条 / 共 {{ targetData.length }}条</span>
          </div>
          <div class="main" style="padding-bottom: 40px;">
            <div class="head">
              <el-checkbox :indeterminate="targetIndeterminate"
                            v-model="isCheckAllTargetData">全选</el-checkbox>
              <el-input placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="searchTargetData"
                        size="mini"
                        style="float: right; width: 50%"></el-input>
            </div>
            <div class="target-content custom-scrollbar">
              <el-checkbox-group v-model="checkTargetData"
                                  class="list-group"
                                  v-if="targetVirtuals.length">
                <vuedraggable v-model="targetVirtuals"
                              :options="dragOptions"
                              ghost-class="ghost"
                              draggable=".list-group-item">
                  <transition-group type="transition"
                                    name="flip-list"
                                    tag="ul">
                    <li v-for="(virtual, index) in targetVirtuals"
                        :key="virtual.id"
                        class="list-group-item">
                      <el-checkbox :label="virtual.id"
                                    class="check-box-item">
                        <span class="index">{{ index + 1 }}、</span>
                        <span class="hight-light-content"
                              v-html="highLightMatch(virtual.vmName, searchTargetData, index)">
                        </span>
                        <span class="delay-time">
                          <el-form label-width="0"
                                   class="delay-time-form">
                            <el-form-item size="mini"
                                          prop="virtual.bootDelayTime">
                              <el-input v-model.number="virtual.bootDelayTime"
                                        size="mini"
                                        style="width: 60px"
                                        @change="bootDelayTimeChange(virtual)"></el-input>
                              <span>s</span>
                            </el-form-item>
                          </el-form>
                        </span>
                      </el-checkbox>
                    </li>
                  </transition-group>
                </vuedraggable>
              </el-checkbox-group>
              <div class="null-data"
                    v-else>暂无数据</div>
              <div class="all-delay-time"
                   v-show="targetData.length">
                <el-form label-width="80px"
                          class="delay-time-form">
                  <el-form-item label="延迟时间"
                                size="mini">
                    <el-input v-model.number="delayTime"
                              size="mini"
                              style="width: 70px"
                              @change="allBootDelayTimeChange(delayTime)"></el-input>
                    <span>(单位：s)</span>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="2"
                v-if="vmType === 1">
          <div class="btn-content">
            <div class="btn-content-top">
              <el-button :type="checkTargetData.length ? 'primary' : 'info'"
                          :disabled="!checkTargetData.length"
                          class="btn rotateBtn"
                          icon="el-icon-download"
                          circle
                          @click="moveToTop"></el-button>
            </div>
            <div class="btn-content-top">
              <el-button :type="checkTargetData.length  === 1 ? 'primary' : 'info'"
                          :disabled="checkTargetData.length !== 1"
                          class="btn"
                          icon="el-icon-arrow-up"
                          circle
                          @click="moveUp"></el-button>
            </div>
            <div class="btn-content-bottom">
              <el-button :type="checkTargetData.length === 1 ? 'primary' : 'info'"
                          :disabled="checkTargetData.length !== 1"
                          class="btn"
                          icon="el-icon-arrow-down"
                          circle
                          @click="moveDown"></el-button>
            </div>
            <div class="btn-content-bottom">
              <el-button :type="checkTargetData.length ? 'primary' : 'info'"
                          :disabled="!checkTargetData.length"
                          class="btn"
                          icon="el-icon-download"
                          circle
                          @click="moveToBottom"></el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="cancelButtonClick">取消</el-button>
        <el-button type="primary"
                   :loading="btnLoading"
                   @click="confirmBtn">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import vuedraggable from 'vuedraggable';
import InputToggle from '@/components/InputToggle';
import { multiBootPower } from '@/api/virtuals';
import isEqual from 'lodash/isEqual';
import { virtualMapping } from '@/utils/constant';

export default {
  name: 'PowerBootModal',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    virtuals: {
      type: Array,
      required: true,
      default: () => []
    },
    id: {
      type: Number,
      required: true,
      default: -1
    }
  },
  data() {
    return {
      searchSourceData: '',
      searchTargetData: '',
      btnLoading: false,
      checkSourceData: [],
      checkTargetData: [],
      targetData: [],
      sourceData: [],
      delayTime: 0
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 10,
        group: "description",
        disabled: this.searchTargetData || this.vmType === 3,
        handle:'.list-group-item',
        ghostClass: "ghost",
        draggable:'.list-group-item'
      };
    },
    vmType() {
      return Number(Object.keys(virtualMapping).find(type =>
        this.$route.name.toLowerCase().includes(virtualMapping[type].toLowerCase())
      ));
    },
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', false);
        }
      }
    },
    isCheckAllTargetData: {
      get() {
        const ids = this.targetVirtuals.map(virtual => virtual.id);
        return this.targetVirtuals.length > 0 && isEqual(this.checkTargetData, ids);
      },
      set(val) {
        this.checkTargetData = val ? this.targetVirtuals.map(virtual => virtual.id) : [];
      }
    },
    isCheckAllSourceData: {
      get() {
        const ids = this.sourceVirtuals.map(virtual => virtual.id);
        return this.sourceVirtuals.length > 0 && isEqual(this.checkSourceData, ids);
      },
      set(val) {
        this.checkSourceData = val ? this.sourceVirtuals.map(virtual => virtual.id) : [];
      }
    },
    sourceIndeterminate() {
      return this.checkSourceData.length > 0 && this.checkSourceData.length < this.sourceVirtuals.length;
    },
    targetIndeterminate() {
      return this.checkTargetData.length > 0 && this.checkTargetData.length < this.targetVirtuals.length;
    },
    sourceVirtuals: {
      get() {
        if (this.searchSourceData) {
          return this.sourceData.filter(
            virtual => virtual.vmName.toLowerCase().includes(this.searchSourceData.toLowerCase())
          );
        }
        return this.sourceData;
      },
      set(val) {
        this.targetData = val;
      }
    },
    targetVirtuals: {
      get() {
        if (this.searchTargetData) {
          return this.targetData.filter(
            virtual => virtual.vmName.toLowerCase().includes(this.searchTargetData.toLowerCase())
          );
        }
        return this.targetData;
      },
      set(val) {
        this.targetData = val;
      }
    }
  },
  watch: {
    delayTime(time) {
      this.targetData = this.targetData.map(virtual => {
        const { bootDelayTime, ...others } = virtual;
        return {
          bootDelayTime: time,
          ...others
        }
      })
    }
  },
  methods: {
    highLightMatch(fullName, searchName, index) {
      const findIndex = fullName.toLowerCase().indexOf(searchName.toLowerCase());
      if (findIndex > -1 && searchName) {
        const highLightWords = fullName.substr(findIndex, searchName.length);
        return fullName.replace(highLightWords, `<span>${highLightWords}</span>`);
      }
      return fullName;
    },
    bootDelayTimeChange(virtual) {
      let time = virtual.bootDelayTime;
      if(((!parseInt(time) && time !== 0) || time < 0)) {
        virtual.bootDelayTime = 0;
        this.$message.warning('请输入正确的延迟时间');
      }
    },
    allBootDelayTimeChange() {
      if((!parseInt(this.delayTime) && this.delayTime !== 0) || this.delayTime < 0) {
        this.delayTime = 0;
        this.$message.warning('请输入正确的延迟时间');
      }
    },
    cancelButtonClick() {
      this.modalVisible = false;
    },
    modalClosed() {
      this.delayTime = 0;
      this.modalVisible = false;
    },
    confirmBtn() {
      this.btnLoading = true;
      const bootList = this.targetData.map((virtual, index) => ({
        virtualId: virtual.id,
        bootOrder: index + 1,
        bootDelayTime: virtual.bootDelayTime
      }))
      multiBootPower(this.id, bootList)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.modalVisible = false;
          this.$emit('refresh');
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.searchSourceData = '';
        this.searchTargetData = '';
        this.checkSourceData = [];
        this.checkTargetData = [];
        this.sourceData = this.virtuals.filter(virtual => virtual.bootMode === 0)
          .map(virtual => ({
            ...virtual,
            bootDelayTime: virtual.bootDelayTime ? virtual.bootDelayTime : 0
          }));
        this.targetData = this.virtuals.filter(virtual => virtual.bootMode === 1)
          .sort((pre, next) => pre.bootOrder - next.bootOrder)
          .map(virtual => ({
            ...virtual,
            bootDelayTime: virtual.bootDelayTime ? virtual.bootDelayTime : 0
          }));
      })
    },
    classifyVirtuals(all, checks) {
      return all.reduce(
        ([pass, fail], item) => checks.includes(item.id) ? [[...pass, item], fail] : [pass, [...fail, item]],
        [[], []]
      );
    },
    moveLeft() {
      const [selectedVirtuals, remainingVirtuals] = this.classifyVirtuals(this.sourceData, this.checkSourceData);
      this.sourceData = remainingVirtuals;
      this.targetData = [...this.targetData, ...selectedVirtuals];
      this.checkTargetData = [...this.checkTargetData, ...this.checkSourceData];
      this.checkSourceData = [];
    },
    moveRight() {
      const [selectedVirtuals, remainingVirtuals] = this.classifyVirtuals(this.targetData, this.checkTargetData);
      this.targetData = remainingVirtuals;
      this.sourceData = [...this.sourceData, ...selectedVirtuals];
      this.checkSourceData = [...this.checkSourceData, ...this.checkTargetData];
      this.checkTargetData = [];
    },
    moveToTop() {
      const [selectedVirtuals, remainingVirtuals] = this.classifyVirtuals(this.targetData, this.checkTargetData);
      this.targetData = [...selectedVirtuals, ...remainingVirtuals];
    },
    moveToBottom() {
      const [selectedVirtuals, remainingVirtuals] = this.classifyVirtuals(this.targetData, this.checkTargetData);
      this.targetData = [...remainingVirtuals, ...selectedVirtuals];
    },
    moveUp() {
      const index = this.targetData.findIndex(virtual => virtual.id === this.checkTargetData[0]);
      const length = this.targetData.length;
      if (index) {
        this.targetData = [
          ...this.targetData.slice(0, index - 1),
          this.targetData[index],
          this.targetData[index - 1],
          ...this.targetData.slice(index + 1, length)
        ]
      }
    },
    moveDown() {
      const index = this.targetData.findIndex(virtual => virtual.id === this.checkTargetData[0]);
      const length = this.targetData.length;
      if (index < length - 1) {
        this.targetData = [
          ...this.targetData.slice(0, index),
          this.targetData[index + 1],
          this.targetData[index],
          ...this.targetData.slice(index + 2, length)
        ]
      }
    }
  },
  components: {
    vuedraggable,
    InputToggle
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/theme/variable.scss';
.power-boot-dialog {
  /deep/
  .el-dialog {
    min-width: 900px!important;
  }
}
ul {
  margin: 0;
  padding: 0;
  li {
    padding-top: 5px;
  }
}
.header-font {
  padding-bottom: 8px;
  margin-top: -20px;
  @include primary-color;
  .bold {
    margin-left: 5px;
    font-weight: 700;
  }
  .fr {
    float: right;
  }
}
.main {
  border: 1px solid #ccc;
  box-shadow: 1px 1px 5px #bebebe;
  padding-bottom: 10px;
  position: relative;
  .head {
    height: 40px;
    line-height: 40px;
    @include main-background-color;
    padding: 0 10px;
    border-bottom: 1px solid #dfd5d5;
  }
  .source-content,
  .target-content {
    padding: 10px;
    width: calc(100% - 20px);
    height: 270px;
    overflow: auto;
  };
  .source-content {
    height: 300px;
  }
}
.btn-content {
  margin: 0 auto;
  .btn-content-top {
    margin-bottom: 10px;
  }
  .btn-content-bottom {
    margin-top: 10px;
  }
  .btn {
    display: block;
    margin: 0 auto;
  }
  .rotateBtn {
    transform: rotate(180deg)
  }
}
.hight-light-content {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  /deep/
  span {
    @include primary-color;
  }
  .index {
    margin-right: 5px
  }
}
.index {
  @include primary-color
}
.null-data {
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.ghost {
  opacity: 0.5;
  border-bottom: 1px solid #c8c6c0;
  @include content-background-color;
}
.list-group-item {
  cursor: move;
  padding: 8px 0px;
  position: relative;
  .check-box-item {
    cursor: move;
    width: 100%;
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.delay-time {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  .delay-time-form {
    .el-form-item {
      margin: 0!important;
    }
  }
}
.all-delay-time {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  padding: 2px 0;
  border-top: 1px solid #dfd5d5;
  @include main-background-color;
  .delay-time-form {
    display: inline-block;
    float: right;
    transform: translateX(-10px);
    .el-form-item {
      margin: 0!important;
      margin-right: 10px;
    }
  }
}
</style>
