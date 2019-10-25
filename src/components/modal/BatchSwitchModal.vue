<template>
  <section>
    <el-dialog :visible.sync="dialogVisible"
               :title="dialogTitle"
               width="900px"
               @open="openDialog">
      <el-table :data="links"
                style="margin-top: -30px"
                ref="multipleTable"
                default-expand-all
                @select-all="selectAll"
                @select="handleSelection"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-checkbox-group v-model="props.row.linkIds">
              <div v-for="databaseLink in props.row.databaseLinks"
                   :key="databaseLink.id"
                   style="margin: 10px 50px">
                <el-checkbox style="display: block"
                             :label="databaseLink.id"
                             :disabled="switchDatabaseDisable(databaseLink.state)">
                  <span>
                    <span :class="$style.switchModalDetail">{{ databaseLink.primaryDatabase.instanceName}}</span>
                    <span>{{ databaseLink.primaryDatabase.role | databaseRoleFilter}}</span>
                  </span>
                  <i-icon :name="`${theme}-ready-switch`"
                          :class="$style.readySwitch"></i-icon>
                  <span>
                    <span>{{ databaseLink.viceDatabase.role | databaseRoleFilter}}</span>
                    <span :class="$style.switchModalDetail" style="text-align: right">{{ databaseLink.viceDatabase.instanceName}}</span>
                  </span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column label="生产设备IP"
                         align="center"
                         min-width="100px"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip :content="`${scope.row.primaryHost.name}`"
                        effect="light"
                        placement="right">
              <span>{{ scope.row.primaryHost.hostIp }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="易备设备IP"
                         align="center"
                         min-width="100">
          <template slot-scope="scope">
            <el-tooltip :content="`${scope.row.viceHost.name}`"
                        effect="light"
                        placement="right">
              <span>{{ scope.row.viceHost.hostIp }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="服务/临时IP"
                         align="center"
                         min-width="140">
          <template slot-scope="scope">
            <!-- 服务IP -->
            <span v-if="scope.row.primaryHost.osName==='Linux'">
              服务IP({{scope.row.serviceIpMark===1?'生产':'易备'}})：
              {{ scope.row.primaryHost.serviceIp }}
            </span>
            <!-- 临时 -->
            <span v-else-if="scope.row.primaryHost.osName==='Windows'">
              临时IP：{{ scope.row.primaryHost.serviceIp }}
            </span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="切IP"
                         align="center"
                         min-width="80">
          <template slot-scope="scope">
            <el-select v-model="scope.row.flag"
                       :class="$style.ipSelect"
                       size="small"
                       @clear="clearSelect(scope.row)"
                       clearable
                       placeholder="--请选择--"
                       :disabled="switchIpDisable(scope.row)">
              <el-option v-for="item in switchIpType"
                         v-show="item.value !== 0 "
                         :key="item.id"
                         :disabled="!canSwitchVip(scope.row.primaryHost) && item.value === 2"
                         :label="selectLabelType(scope.row.primaryHost, item)"
                         :value="item.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <el-form inline
               :class="$style.planForm"
               size="small">
        <el-row :gutter="20">
          <el-col :span="9" :offset="3">
            <el-form-item label="计划名称">
              <el-input v-model="name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="用户密码">
              <el-input v-model="password"
                        type="password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" :class="$style.dialogFooter">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading"
                   :disabled="confirmBtnDisiable">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import takeoverMixin from '@/components/mixins/takeoverMixins';
import themeMixin from '@/components/mixins/themeMixins';
import { validatePassword } from '@/api/user';
import IIcon from '@/components/IIcon'
export default {
  name: 'BatchSwitchModal',
  mixins: [takeoverMixin, themeMixin],
  props: {
    originLinks: Array,
    visible: Boolean,
    flag: Number,
    btnLoading: Boolean,
    databaseType: String
  },
  data() {
    return {
      name: '',
      password: '',
      multipleSelection: [],
      links: [],
      switchIpType: [
        { value: 0, label: '--请选择--' },
        { value: 1, label: '切服务/临时/scanIP' },
        { value: 2, label: 'VIP' },
        { value: 3, label: '单切' },
      ]
    }
  },
  watch: {
    // 实例多选=>表格多选
    'links':{
      handler(databaseLinks) {
        databaseLinks.forEach(databaseLink => {
          // 未选择实例、未切换IP => 表格取消选择
          // 选择一项或多项实例、选择切换IP => 表格选中
          const readySelectRow = this.links.findIndex(link => link.id === databaseLink.id)
          const isSelect = databaseLink.linkIds.length === 0 && databaseLink.flag === this.flag
          if(this.$refs.multipleTable) {
            this.$refs.multipleTable.toggleRowSelection(this.links[readySelectRow], !isSelect)
          }
        });
      },
      deep: true
    }
  },
  methods: {
    // 表格全选 => 实例全选
    selectAll(selection) {
      if(selection.length>0) { // 全选 => 实例全选
        this.links.forEach(link => {
          this.originLinks.forEach(origin => {
            if(link.id === origin.id) {
              link.linkIds = origin.linkIds
            }
          })
        })
      } else { // 取消全选 => 取消实例选择
        this.links.forEach(link => {
          link.flag = this.flag;
          link.linkIds = []
        })
      }
    },
    // 表格多选=>实例多选
    handleSelection(selection, row) {
      if(selection.length===0) { // 表格取消选择
        row.flag = this.flag
        row.linkIds = []
      } else {
        const lastItemId = selection[selection.length-1].id;
        if(lastItemId === row.id) { // 表格勾选
          row.linkIds = this.originLinks.find(element => element.id===lastItemId).linkIds
        } else { // 表格取消选择
          row.flag = this.flag;
          row.linkIds = [];
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    openDialog() {
      // 对象数组的深拷贝
      this.links = [].concat(JSON.parse(JSON.stringify(this.originLinks)));
      this.password = '';
      this.name = '';
      // 默认全选
      this.$nextTick(() => {
        // this.$refs.multipleTable.toggleAllSelection()
        const selected = this.links;
        selected.forEach(i => {
          this.$refs.multipleTable.toggleRowSelection(this.links.find(
            link => link.id === i.id
          ), true)
        })
      })
    },
    confirm() {
      if(this.multipleSelection.length>0) {
        validatePassword(this.password)
          .then(() => {
            const data = {
              name: this.name,
              createTime: this.createTime,
              dbType: this.dbType,
              switchIds: this.switchIds
            }
            this.$emit('confirm', data);
          })
          .catch(error => {
            this.$message.error(error);
          });
      } else {
        this.$message.warning('请选择需要执行切换的设备')
      }
    },
    // 切vip是否可选，在Linux，rac环境下才可选
    canSwitchVip(primaryHost) {
      return primaryHost.osName === 'Linux' && primaryHost.isRacMark === 0
    },
    // 切IP是否可用：设备最近操作为切换IP或解除连接时不可用(切换中... 解除连接中...), 切换后实例角色不一致时不可用
    switchIpDisable(switchLink) {
      const onGoing = (switchLink.latestSwitch) && (switchLink.latestSwitch.state === 1 && [2, 3].includes(switchLink.latestSwitch.type))
      const hasSelectLink = switchLink.databaseLinks.filter(databaseLink => switchLink.linkIds.includes(databaseLink.id))
      const notSelectLink = switchLink.databaseLinks.filter(databaseLink => switchLink.linkIds.indexOf(databaseLink.id) === -1)
      // 切换后生产库实例角色
      const hasSelectedPrimaryRole = hasSelectLink.map(link => link.viceDatabase.role)
                                                  .concat(notSelectLink.map(link => link.primaryDatabase.role))
      // 切换后易备库实例角色
      const hasSelectedViceRole = hasSelectLink.map(link => link.primaryDatabase.role)
                                               .concat(notSelectLink.map(link => link.viceDatabase.role))
      // 判断切换后的主备角色是否一致
      const hasSelectedEqual = new Set(hasSelectedPrimaryRole).size === 1 && new Set(hasSelectedViceRole).size === 1
      // 是否已选实例
      const primaryRoles = hasSelectLink.map(v => v.primaryDatabase.role);
      // 判断切换后角色是否一致, 是否已选实例
      const sureSwitch = hasSelectedEqual || primaryRoles.length === 0;
      // 若角色不一致，则不可切IP
      if(!sureSwitch) {
        switchLink.flag = this.flag;
      }
      return onGoing || !sureSwitch
    },
    // 切换实例是否可用：实例的最近一次操作不是切换实例
    switchDatabaseDisable(state) {
      return state === 1
    },
    clearSelect(hostLink) {
      hostLink.flag=this.flag;
    },
    selectLabelType(primaryHost, item) {
      if(item.value === 1) {
        if(primaryHost.osName === 'Windows') {
          return '临时IP'
        } else if(primaryHost.osName === 'Linux') {
          if(primaryHost.isRacMark) {
            return '服务IP'
          } else {
            return 'scanIP'
          }
        } else {
          return ''
        }
      } else {
        return item.label
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    },
    dialogTitle() {
      return "添加计划("+`${this.databaseType}`+")"
    },
    dbType() {
      if (this.databaseType === 'oracle') {
        return 1;
      } else if (this.databaseType === 'sqlserver') {
        return 2;
      }
    },
    // 获取当前时间，yyyy-mm-dd hh-mm-ss
    createTime () {
      return new Date().toLocaleDateString().replace(/\//g, '-') + ' ' + new Date().toTimeString().substr(0, 8)
    },
    confirmBtnDisiable() {
      return !this.password || !this.name
    },
    switchIds() {
      if(this.multipleSelection.length===0) {
        return []
      } else {
        return this.multipleSelection.map(item => {
          let switchItem = {
            hostLinkId: item.id,
            flag: item.flag,
            linkIds: item.linkIds,
          }
          if(item.flag === 3) { // 单切时需在原结构中加入切换目标及原IP
            switchItem.originViceIp = this.singleSwitchOriginIp(item);
            switchItem.targetViceIp = this.singleSwitchTargetIp(item);
          }
          return switchItem;
        })
      }
    }
  },
  components: {
    IIcon
  }
}
</script>
<style lang="scss" module>
@import '../../style/color.scss';
.switchModalName {
  display: inline-block;
  width: 8em;
  margin-left: 0.5em;
}
.readySwitch {
  vertical-align: -0.3em;
  width: 2em;
  display: inline-block;
}
.switchModalDetail {
  display: inline-block;
  width: 7em;
}
.planForm {
  margin-top: 20px;
}
.ipSelect {
  input {
    text-align: center;
  }
}
.dialogFooter {
  margin-top: -20px;
}
</style>



