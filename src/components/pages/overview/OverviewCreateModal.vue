<template>
  <section>
    <el-dialog
      title="添加数据"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      @close="modalClose">
      <el-form :model="formData"
          label-width="110px"
          ref="formData"
          size="small">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="formData.position"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入职时间" prop="entrytime">
              <el-date-picker type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            v-model="formData.entrytime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统计时间" prop="counttime">
              <el-date-picker type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            v-model="formData.counttime"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="销售金额" prop="salesamount">
          <el-input-number v-model="formData.salesamount" :step="1"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirm" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
export default {
  name: 'OverviewCreateModal',
  data() {
    const baseFormData = {
      name: '',
      position: '',
      entrytime: '',
      counttime: '',
      salesamount: 0,
      hostIp: '',
      serviceIp: '',
    };
    return {
      formData: Object.assign({}, baseFormData),
      originFormData: Object.assign({}, baseFormData),
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    btnLoading: {
      type: Boolean,
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
  },
  methods: {
    confirm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$emit('confirm', this.formData);
        } else {
          return false;
        }
      });
    },
    handleClose(done) {
      if (!isEqual(this.formData, this.originFormData)) {
        this.$confirm('有未保存的修改，是否退出？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      } else {
        this.dialogVisible = false;
      }
    },
    modalClose() {
      this.formData = { ...this.originFormData };
      this.$refs.formData.clearValidate();
    },
  },
}
</script>
