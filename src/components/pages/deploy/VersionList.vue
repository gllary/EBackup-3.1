<template>
  <section>
    <el-form inline size="medium" style="overflow: hidden">
      <el-form-item style="float: right">
        <el-button type="primary"
                   @click="createVersion">添加</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="info"
                   @click="scanVersion">扫描</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
          <el-button type="success"
                    @click="toguide('repository')">操作说明</el-button>
      </el-form-item>
    </el-form>
    <div style="position: relative"
         v-if="versions.length > 0">
      <el-form inline
               style="position: absolute; right: 0; top: 3px; z-index: 99"
               size="mini">
        <el-form-item style="float: right">
          <el-button size="small"
                     plain
                     type="info"
                     icon="el-icon-edit"
                     @click="updateVersion">修改</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button size="small"
                     plain
                     type="info"
                     icon="el-icon-upload2"
                     @click="uploadPackages">上传</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button size="small"
                     plain
                     type="info"
                     icon="el-icon-delete"
                     @click="deleteVersion">删除</el-button>
        </el-form-item>
      </el-form>
      <template>
        <el-tabs type="border-card"
                 v-model="activeTabId">
          <el-tab-pane v-for="version in versions"
                      :key="version.id"
                      :name="String(version.id)">
            <span slot="label">
              {{ version.versionCode }}
              <el-popover placement="right"
                          :content="version.versionMsg"
                          :open-delay="300"
                          trigger="hover">
                <i class="el-icon-info transitionScale" slot="reference"></i>
              </el-popover>
            </span>
            <el-table :data="version.packages">
              <el-table-column prop="packageName"
                              label="代理包名"
                              align="center"
                              min-width="160"
                              tooltip-effect="light"
                              show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-popover trigger="hover"
                              placement="top">
                    <span>
                      {{ scope.row.updateMsg }}
                    </span>
                    <div slot="reference" style="cursor: pointer">
                      <i class="el-icon-info"></i>
                      <span>{{ scope.row.packageName }}</span>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="hostType"
                              label="设备类型"
                              align="center"
                              width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.hostType | hostTypeFilter }}</span>
                </template>
              </el-table-column>
              <el-table-column label="路径"
                                align="center"
                                min-width="180"
                                effect="light"
                                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ version.packagePath }}{{ version.versionCode }}\{{ scope.row.packageName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="osType"
                              label="操作系统"
                              width="120"
                              align="center"></el-table-column>
              <el-table-column prop="upTime"
                              label="上传时间"
                              width="180"
                              align="center">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{ scope.row.upTime }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="isWrapper"
                              label="wrapper部署"
                              width="120"
                              align="center">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.isWrapper | wrapperTagFilter"
                          size="mini">
                    {{ scope.row.isWrapper | yesOrNoFilter }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作"
                              align="center"
                              width="120">
                <template slot-scope="scope">
                  <el-button type="primary"
                            icon="el-icon-download"
                            circle
                            size="mini"
                            :class="$style.miniCricleIconBtn"
                            @click="downLoadPackage(scope)"></el-button>
                  <el-button type="danger"
                            icon="el-icon-delete"
                            circle
                            size="mini"
                            :class="$style.miniCricleIconBtn"
                            @click="deletePackage(scope)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
    <operate-version-modal :visible.sync="operateVersionModalVisible"
                           :select-data="operateVersionData"
                           :btn-loading="btnLoading"
                           :operate-type="operateVersionType"
                           @confirm="operateVersionConfirm"></operate-version-modal>
    <upload-packages-modal :visible.sync="uploadPackagesModalVisible"
                           :btn-loading="btnLoading"
                           :select-data="operateVersionData"
                           @confirm="uploadPackagesConfirm"></upload-packages-modal>
  </section>
</template>

<script>
import {
  fetchVersionTypes,
  createVersion,
  updateVersion,
  deleteVersion,
  scanVersion,
  deletePackage,
  uploadPackages
} from '@/api/deploy';
import { validatePassword } from '@/api/user';
import { yesOrNoMapping, useTypeMapping } from '@/utils/constant';
import OperateVersionModal from '@/components/pages/deploy/OperateVersionModal';
import UploadPackagesModal from '@/components/pages/deploy/UploadPackagesModal';
const operateVerionMethod = {
  create: createVersion,
  update: updateVersion
};
export default {
  name: 'VersionList',
  components: {
    OperateVersionModal,
    UploadPackagesModal
  },
  data() {
    return {
      versionType: {},
      operateVersionModalVisible: false,
      uploadPackagesModalVisible: false,
      operateVersionType: 'create',
      activeTabId: '-1',
      btnLoading: false
    };
  },
  created() {
    this.fetchData();
  },
  filters: {
    yesOrNoFilter(type) {
      return yesOrNoMapping[type];
    },
    wrapperTagFilter(type) {
      if(type === 1) {
        return 'primary';
      }
      return 'info';
    },
    hostTypeFilter(type) {
      return useTypeMapping[type];
    }
  },
  computed: {
    versions() {
      return this.versionType.versions ? this.versionType.versions : [];
    },
    saveIp() {
      return this.versionType.saveIp ? this.versionType.saveIp : '';
    },
    operateVersionData() {
      if(this.versions.length) {
        return this.versions.find(version => version.id === Number(this.activeTabId));
      }
      return {};
    }
  },
  methods: {
    toguide(id){
      let select = id;
      localStorage.setItem('id',select);
      this.$router.push({ name: 'deploymentManage', query: { aId:'repository' }})
    },
    fetchData() {
      fetchVersionTypes()
        .then(res => {
          const { data } = res.data;
          this.versionType = data;
          if(this.versions.findIndex(version => String(version.id) === this.activeTabId) < 0) {
            this.activeTabId = this.versions[0] ? String(this.versions[0].id) : '-1';
          }
        })
    },
    createVersion() {
      this.operateVersionModalVisible = true;
      this.operateVersionType = 'create';
    },
    updateVersion() {
      this.operateVersionModalVisible = true;
      this.operateVersionType = 'update';
    },
    scanVersion() {
      this.$confirm('即将扫描版本库，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.scanVersionConfirm();
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    operateVersionConfirm(requestData) {
      this.btnLoading = true;
      operateVerionMethod[this.operateVersionType](requestData)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.fetchData();
          this.operateVersionModalVisible = false;
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    deleteVersionConfirm() {
      const opt = {
        type: 'info',
        message: `正在删除版本${this.operateVersionData.versionCode}及其代理包中，请稍后`,
        duration: 0
      }
      const { close } = this.$message(opt);
      deleteVersion(this.operateVersionData.id)
        .then(res => {
          const { message } = res.data;
          opt.type = 'success';
          opt.message = message;
          setTimeout(close, 1000);
          this.fetchData();
        })
        .catch(error => {
          opt.type = 'error';
          opt.message = error;
          setTimeout(close, 1000);
        });
    },
    scanVersionConfirm() {
      scanVersion()
        .then(res => {
          const { data, message } = res.data;
          this.versionType = data;
          this.$message.success(message);
          if(this.versions.findIndex(version => String(version.id) === this.activeTabId) < 0) {
            this.activeTabId = this.versions[0] ? String(this.versions[0].id) : '-1';
          }
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    deleteVersion() {
      this.$prompt('此操作即将删除该版本及其所有部署包，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入用户密码',
        inputType: 'password',
        inputValidator: value => !value ? '密码不能为空！' : true
      })
        .then(({ value: pass }) => {
          validatePassword(pass)
            .then(() => {
              this.deleteVersionConfirm();
            })
            .catch(error => {
              this.$message.error(error);
            })
        })
        .catch(() => {
          this.$message.info('已取消操作！');
        })
    },
    uploadPackages() {
      this.uploadPackagesModalVisible = true;
    },
    uploadPackagesConfirm(packages) {
      this.btnLoading = true;
      uploadPackages(this.operateVersionData.id, packages)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.fetchData();
          this.uploadPackagesModalVisible = false;
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    deletePackage({ row }) {
      this.$prompt('此操作即将删除该部署包，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入用户密码',
        inputType: 'password',
        inputValidator: value => !value ? '密码不能为空！' : true
      })
        .then(({ value: pass }) => {
          validatePassword(pass)
            .then(() => {
              this.deletePackageConfirm(row);
            })
            .catch(error => {
              this.$message.error(error);
            })
        })
        .catch(() => {
          this.$message.info('已取消操作！');
        })
    },
    downLoadPackage({ row }) {
      window.open(`http://${this.saveIp}:8089/api/v1/package-types/${row.id}/download`, '_self')
    },
    deletePackageConfirm(pack) {
      const opt = {
        type: 'info',
        message: `正在删除代理包${pack.packageName}中，请稍后`,
        duration: 0
      }
      const { close } = this.$message(opt);
      deletePackage(pack.id)
        .then(res => {
          const { message } = res.data;
          opt.type = 'success';
          opt.message = message;
          setTimeout(close, 1000);
          this.fetchData();
        })
        .catch(error => {
          opt.type = 'error';
          opt.message = error;
          setTimeout(close, 1000);
        });
    }
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>
<style scoped>
.transitionScale:hover {
  transform: scale(1.2);
  transition: all 0.3s ease;
}
</style>
