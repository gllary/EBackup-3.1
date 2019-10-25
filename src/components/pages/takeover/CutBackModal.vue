<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="cancelBtn"
               @open="dialogOpen">
      <el-row v-if="Object.keys(cutBackMsg).length">
        <el-col :span="6">
          <i-icon name="warning"
                  :class="$style.switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px;overflow: auto;">
            <h4>即将执行以下操作，请检查。</h4>
            <h4>
              <span :class="$style.ebackupEnvColor">
                  <i-icon name="ebackup-env"
                          style="vertical-align: -0.3em;"></i-icon>
                  {{ '易备环境' }}
                </span>
                <span :class="$style.switchModalName">
                  {{ cutBackMsg.viceHost.name }}
              </span>
              与
              <span :class="$style.productionEnvColor">
                <i-icon name="production-env"
                        style="vertical-align: -0.3em;"></i-icon>
                {{ '生产环境' }}
              </span>
              <span :class="$style.switchModalName">
                {{ cutBackMsg.primaryHost.name }}
              </span>
            </h4>
            <template v-if="multiply">
              <h4>的以下数据库连接可进行回切初始化，请选择。</h4>
              <el-checkbox :indeterminate="isIndeterminate"
                          v-model="checkAll"
                          @change="checkAllChange">全选</el-checkbox>
              <el-checkbox-group v-model="switchIds"
                                @change="checkedLinksChange">
                <el-row v-for="link in cutBackMsg.databaseLinks"
                        :key="link.id">
                  <el-checkbox :label="link.id">
                    {{ link.viceDatabase.name }} => {{ link.primaryDatabase.name }}
                  </el-checkbox>
                </el-row>
              </el-checkbox-group>
            </template>
            <template v-else>
              <h4>的以下数据库连接即将进行回切初始化。</h4>
              <p v-for="link in cutBackMsg.databaseLinks"
                 :key="link.id">
                <span>{{ link.viceDatabase.name }}</span> => <span>{{ link.primaryDatabase.name }}</span>
              </p>
            </template>
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
import { validatePassword } from '@/api/user';
export default {
  name: 'CutBackModal',
  props: {
    cutBackMsg: {
      type: Object,
      default: function() {
        return {}
      }
    },
    visible: {
      type: Boolean
    },
    btnLoading: {
      type: Boolean
    },
    multiply: {
      type: Boolean
    }
  },
  components: {
    IIcon
  },
  data() {
    return {
      password: '',
      checkAll: false,
      isIndeterminate: false,
      switchIds: []
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
      },
    },
    allIds() {
      return this.cutBackMsg.databaseLinks.map(link => link.id);
    },
    confirmBtnDisable() {
      if(this.multiply) {
        return !this.switchIds.length || !this.password;
      } else {
        return !this.password;
      }
    }
  },
  methods: {
    checkAllChange(val) {
      this.switchIds = val ? this.allIds : [];
      this.isIndeterminate = false;
    },
    checkedLinksChange(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.allIds.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allIds.length;
    },
    confirmBtn() {
      validatePassword(this.password)
        .then(() => {
          const ids = this.multiply ? this.switchIds : this.cutBackMsg.databaseLinks.map(link => link.id);
          this.$emit('confirm', ids);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    cancelBtn() {
      this.checkAll = false;
      this.isIndeterminate = false;
      this.switchIds = [];
      this.modalVisible = false;
    },
    dialogOpen() {
      this.password = '';
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