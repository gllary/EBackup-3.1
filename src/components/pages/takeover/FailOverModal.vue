<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="cancelBtn"
               @open="modalOpen">
      <el-row v-if="Object.keys(failOverMsg).length">
        <el-col :span="6">
          <i-icon name="warning"
                  :class="$style.switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px;overflow: auto;">
            <h4>即将执行以下操作，请检查。</h4>
            <p>
              实例<span :class="$style.dbName">{{ failOverMsg.primaryDatabase.name }}</span>与实例
              <span :class="$style.dbName">{{ failOverMsg.viceDatabase.name }}</span>连接之间
            </p>
            <p>
              即将<span :class="$style.errorColor">{{failOverMsg.failOverState===1?'关闭故障转移':'开启故障转移'}}</span>
            </p>
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
  name: 'FailOverModal',
  props: {
    failOverMsg: {
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
    cancelBtn() {
      this.modalVisible = false;
    },
    modalOpen() {
      this.password = '';
    },
    confirmBtn() {
      validatePassword(this.password)
        .then(() => {
          this.$emit('confirm', this.failOverMsg);
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
.switchDBName {
  display: inline-block;
}
.dbName {
  composes: switchDBName;
  padding: 0 0.6em;
  border-radius: 0.4em;
  color: #1b80c4;
  background-color: lighten(#1b80c4, 45%);
  text-align: center;
}
</style>

