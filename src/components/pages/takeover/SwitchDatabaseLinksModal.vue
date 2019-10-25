<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="cancelBtn"
               @open="dialogOpen">
      <el-row>
        <el-col :span="6">
          <i-icon name="warning"
                  :class="$style.switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px;overflow: auto;">
            <h4>即将执行以下操作，请检查。</h4>
            <div v-if="databaseLinksReadyToSwitch.length"
                 v-for="link in databaseLinksReadyToSwitch"
                 :key="link.id">
              <!-- 是否是单切实例 -->
              <p v-if="!singleSwitchDatabases">
                <span :class="$style.switchModalName">{{ link.primaryDatabase.name }}</span>
                <span :class="$style.switchModalDetail">{{ link.primaryDatabase.instanceName}}</span>
                <el-tag size="mini">角色变更</el-tag>
                <span>{{ link.primaryDatabase.role | databaseRoleFilter}}</span>
                <i class="el-icon-caret-right"></i>
                <span>{{ link.viceDatabase.role | databaseRoleFilter }}</span>
              </p>
              <p>
                <span :class="$style.switchModalName">{{ link.viceDatabase.name }}</span>
                <span :class="$style.switchModalDetail">{{ link.viceDatabase.instanceName}}</span>
                <el-tag size="mini">角色变更</el-tag>
                <span>{{ link.viceDatabase.role | databaseRoleFilter}}</span>
                <i class="el-icon-caret-right"></i>
                <span>{{ link.primaryDatabase.role | databaseRoleFilter}}</span>
              </p>
            </div>
          </div>
          <el-input type="password"
                    v-model="password"
                    placeholder="请输入用户密码以执行此操作"></el-input>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="cancelBtn">取消</el-button>
        <el-button type="primary"
                   :disabled="confirmBtnDisable"
                   :loading="btnLoading"
                   @click="confirmBtn">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import takeoverMixin from '@/components/mixins/takeoverMixins';
import { validatePassword } from '@/api/user';
export default {
  name: 'SwitchDatabaseLinksModal',
  mixins: [takeoverMixin],
  props: {
    databaseLinksReadyToSwitch: {
      type: Array,
      default: function() {
        return []
      }
    },
    singleSwitchDatabases: {
      type: Boolean
    },
    visible: {
      type: Boolean
    },
    btnLoading: {
      type: Boolean
    }
  },
  components: {
    IIcon
  },
  data() {
    return {
      password: ''
    }
  },
  computed: {
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
    confirmBtnDisable() {
      return !this.password;
    }
  },
  methods: {
    dialogOpen() {
      this.password = '';
    },
    cancelBtn() {
      this.modalVisible = false;
    },
    confirmBtn() {
      validatePassword(this.password)
        .then(() => {
          this.$emit('confirm');
        })
        .catch(error => {
          this.$message.error(error);
        });
    }
  }
}
</script>
<style lang="scss" module>
@import '@/style/color.scss';
.switchModalIcon {
  width: 9em;
  height: 9em;
  margin: 25% 25%;
}
.switchModalName {
  display: inline-block;
  width: 8em;
  margin-left: 0.5em;
}
.productionEnvColor {
  color: #31a17b;
}
.ebackupEnvColor {
  color: #c22b76;
}
</style>

