<template>
    <div>
        <el-row style="margin-bottom:10px;">
            <el-col style="text-align:right">
                <el-button type="primary" @click="addPlan" size="small">添加备份计划</el-button>
                <el-button type="info" @click="stopPlan" :loading="buttonFlag" size="small">一键停止</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table
                :data="tableData"
                :row-key="rowKeyFn"
                :expand-row-keys="expandRowKeys"
                :default-sort="{ prop: 'startTime', order: 'descending' }"
                style="width: 100%;">
                <el-table-column type="expand" align="center" width="55">
                    <template slot-scope="props">
                        <virtual-backup-table :id="props.row.id" :tableData="props.row.backupResult"></virtual-backup-table>
                    </template>
                </el-table-column>
                <el-table-column
                label="计划名称"
                align="center"
                :sortable="true"
                prop="name">
                </el-table-column>
                <el-table-column
                label="备份策略"
                align="center"
                :formatter="backupStrategy"
                prop="config.backupStrategy">
                </el-table-column>
                <el-table-column
                label="时间策略"
                align="center"
                :formatter="timeStrateg"
                prop="config.timeStrategy">
                </el-table-column>
                <el-table-column
                label="备份开始时间"
                align="center"
                :sortable="true"
                prop="startTime">
                </el-table-column>
                <el-table-column  label="状态"
                    align="center"
                    prop="status">
                    <template slot-scope="scope">
                        <i v-if="fmtStatus(scope) === 0"
                            class="el-icon-time"
                            :class="$style.waitingColor"></i>
                        <i v-else-if="fmtStatus(scope) === 1"
                            class="el-icon-loading"
                            :class="$style.loadingColor"></i>
                        <i v-else-if="fmtStatus(scope) === 2"
                            class="el-icon-success"
                            :class="$style.successColor"></i>
                        <i v-else-if="fmtStatus(scope) === 3"
                            class="el-icon-warning"
                            :class="$style.errorColor"></i>
                    </template>
                </el-table-column>
                <el-table-column label="操作"
                                width="150"
                                header-align="center"
                                align="center">
                    <template slot-scope="scope">
                        <el-tooltip 
                            content="查看"
                            placement="top"
                            effect="light">
                            <el-button type="primary"
                                        icon="el-icon-view"
                                        circle
                                        size="mini"
                                        :class="$style.miniCricleIconBtn"
                                        @click="view(scope)"></el-button>
                        </el-tooltip>
                        <el-tooltip 
                            content="删除"
                            placement="top"
                            effect="light">
                            <el-button type="danger"
                                        icon="el-icon-delete"
                                        circle
                                        size="mini"
                                        :class="$style.miniCricleIconBtn"
                                        @click="deletePlan(scope)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <backup-plan-update-modal type="vm"
                                  :disable="true"
                                  :visible.sync="backupPlanModalVisible"
                                  :backup-plan="selectedBackupPlan"
                                  @cancel="selectedBackupPlan = {}"></backup-plan-update-modal>
        
        <select-device-modal @confirm="selectedhandler"  :selected="{ }"
            :visible.sync="deviceModalVisible"></select-device-modal>
        
    </div>
</template>

<script>
import {fetchVirtualBackupPlanList, deletePlan, stopAllBackupPlan} from '@/api/virtuals';
import VirtualBackupTable from '@/components/modal/VirtualBackupTable';
import BackupPlanUpdateModal from '@/components/modal/BackupPlanUpdateModal';
import SelectDeviceModal from '@/components/modal/SelectDeviceModal'
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
} from '@/utils/constant';
export default {
    components: {
        VirtualBackupTable,
        BackupPlanUpdateModal,
        SelectDeviceModal
    },
    data(){
        return {
            tableData: [],
            backupPlanModalVisible: false,
            selectedBackupPlan: {},
            buttonFlag: false,
            deviceModalVisible: false,
            intervalObj: null,
            expandRowKeys: []
        }
    },
    mounted(){
        this.fetchAll();
        this.setTimer();
    },
    destroyed(){
        clearInterval(this.intervalObj);
    },
    methods: {
        fetchAll(){
            fetchVirtualBackupPlanList().then( res => {
                const {data} = res.data;
                this.tableData = data;
            }).catch( error => {
                this.$message.error(error);
            })
        },
        setTimer(){
            this.intervalObj = setInterval(() => {
                this.fetchAll();
            }, 10000);
        },
        rowKeyFn(row){
            return row.id;
        },
        backupStrategy(row, column, cellValue, index) {
            return backupStrategyMapping[cellValue];
        },
        timeStrateg(row, column, cellValue, index) {
            return timeStrategyMapping[cellValue];
        },
        addPlan(){
            this.$router.push({name: 'collectManager'});
        },
        deletePlan(scope){
            this.$confirm(
                '请确认是否删除？',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                deletePlan(scope.row.id).then( res => {
                    this.$message.success( res.data.message);
                    this.fetchAll();
                }).catch( error => {
                    this.$message.error( error );
                });
            }).catch( () => {});
        },
        view(scope){
            this.selectedBackupPlan = scope.row;
            this.backupPlanModalVisible = true;
        },
        stopPlan(){
            this.deviceModalVisible = true;
        },
        selectedhandler(data){
            this.deviceModalVisible = false;
            if(data.id){
                this.buttonFlag = true;
                stopAllBackupPlan(data.id).then( res => {
                    const {message} = res.data;
                    this.$message.success( message );
                    this.fetchAll();
                }).catch( error => {
                    this.$message.error( error );
                }).then( () => {
                    this.buttonFlag = false
                })
            }
        },
        // sortChangeFn({ column, prop, order }){
        //     console.log(this.defaultSort)
        //     if(JSON.stringify(this.defaultSort) === JSON.stringify({prop, order})){
        //         return;
        //     }
        //     this.defaultSort = {prop, order};
        // },
        fmtStatus(scope){
            const { backupResult } = scope.row;
            const len = backupResult.length;
            let status = 0, wait = 0, running = 0, success = 0, error = 0;
            backupResult.forEach(e => {
                if(e.state === 0){
                    wait++;
                }else if(e.state === 1){
                    running++;
                }else if(e.state === 2){
                    success++;
                }else if(e.state === 3){
                    error++;
                }
            });
            if(error !== 0){
                status = 3;
            }else if(wait === len && wait !== 0){
                status = 0;
            }else if(success === len){
                status = 2;
            }else{
                status = 1;
            }
            return status;
        }
    }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
@import '../../style/color.scss';
</style>
<style>

</style>


