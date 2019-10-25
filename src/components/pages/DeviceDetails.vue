<template>
    <div>
        <el-row style="text-align:right;margin-bottom:10px;">
            <el-button type="primary" @click="buttonClickHandler" :disabled="disabled"
                    >{{isSelect ? '添加备份计划' : '添加主机'}}</el-button>
        </el-row>
        <el-tabs tab-position="left" style="height: 100%;" v-model="tabName">
            <el-tab-pane v-for="(item, index) in tabsData"  :key="index" :label="item.serverName" :name="`host${index}`" >
                <mutil-table :tableData="item.vmList" :refTable="item.serverName" :selectData.sync="currentSelect"></mutil-table>
                <!-- <el-table :data="item.vmList" @select="selectDbChangeFn"  
                        :ref="item.serverIp"   @select-all="((selection) => selectAll(selection, item.vmList))">
                    <el-table-column   
                        type="selection"
                        align="left"
                        width="55">
                    </el-table-column>
                    <el-table-column label="名称"
                                align="left"
                                min-width="200">
                        <template slot-scope="scope">
                            <router-link :to="`/vm/virtual/${scope.row.id}`"
                                        class="routerLink">{{scope.row.vmName}}</router-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="vmPath"
                                    label="路径"
                                    align="left"
                                    min-width="200">
                    </el-table-column>
                    <el-table-column prop="vmHostName"
                       label="所属主机"
                       min-width="150"
                       align="left"></el-table-column>
                </el-table> -->
            </el-tab-pane>
            
            <el-tab-pane label="已选虚拟机" name="select">
                <el-table :data="selectData" ref="selectTable" @select="selectChangeHandler" @select-all="selectAllHandler">
                    <el-table-column 
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column label="名称"
                                min-width="200">
                        <template slot-scope="scope">
                            <router-link :to="scope.row.type === 1 ? `/vm/virtual/${scope.row.id}` : `/vm/hwVirtual/${scope.row.id}`"
                                        class="routerLink">{{scope.row.vmName}}</router-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="vmPath"
                                    label="路径"
                                    min-width="200">
                    </el-table-column>
                    <el-table-column prop="vmHostName"
                       label="所属主机"
                       min-width="150"
                       align="center"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <backup-plan-modal type="vm"
                     :visible.sync="backupPlanCreateModalVisible"
                     :btn-loading="btnLoading"
                     @confirm="addBackupPlan"></backup-plan-modal>
        <server-modal :btn-loading="btnLoading"  type="device"
            @confirm="submitServerFn"
            :visible.sync="serverModalVisible">
        </server-modal>
    </div>
    
</template>
<script>
import {fetchDetailsById, addServer} from '@/api/host'
import {
  createMultipleVirtualBackupPlan
} from '@/api/virtuals';
import BackupPlanModal from '@/components/pages/virtual/BackupPlanModal';
import ServerModal from '@/components/modal/ServerModal';
import MutilTable from '@/components/modal/MutilTable';
export default {
    components: {
        BackupPlanModal,
        ServerModal,
        MutilTable
    },
    data(){
        return {
            tabsData: [],
            currentSelect: [],
            isSelect: false,
            host: '',
            id: this.$route.params.id,
            btnLoading: false,
            backupPlanCreateModalVisible: false,
            serverModalVisible: false,
        }
    },
    computed: {
        tabName: {
            get(){
                return this.tabsData.length ? 'host0' : 'select'
            },
            set(val){
                if(val === 'select'){
                    this.isSelect = true
                }else{
                    this.isSelect = false
                }
            }
        },
        disabled(){
            return this.isSelect && this.selectData.length === 0
        },
        selectData(){
            let data = this.currentSelect;
            this.$nextTick( () => {
                data.forEach( item => {
                    this.$refs.selectTable.toggleRowSelection(item, true);
                })
            });
            return data;
        }
    },
    mounted(){
        this.fetchData();
    },
    methods: {
        fetchData(){
            fetchDetailsById(this.id).then( res => {
                const{ data } = res.data;
                const {serverList} = data;
                this.tabsData = serverList;
                this.host = data;
            }).catch( error => {

            })
        },
        // selectChangeHandler(selection){
        //     console.log(selection)
        //     let arr = [].concat(this.selectData);
        //     selection.forEach( e => {
        //         let flag = true;
        //         for(let i=0; i<this.selectData.length;i++){
        //             if(i.id === e.id){
        //                 flag = false;
        //                 break;
        //             }
        //         }
        //         if(flag){
        //             arr.push(e);
        //         }

        //     });
        //     console.log(arr)
        //     this.selectData = arr;
        //     console.log(this.selectData)
        // },
        // selectDbChangeFn(selectData, row){
        //     if(selectData.includes(row)){
        //         this.currentSelect.push(row);
        //     }else{
        //         //需要优化，匹配到即跳出循环
        //         this.currentSelect = this.currentSelect.filter( e => {
        //             if(e.id === row.id){
        //                 return false;
        //             }
        //             return true;
        //         });
        //     }
        // },
        selectAllHandler(data){
            this.currentSelect = data;
        },
        // selectAll(selection,list){
        //     if(selection.length === 0){
        //         this.currentSelect = this.currentSelect.filter( e => {
        //             let flag = true;
        //             list.forEach( i => {
        //                 if(i.id === e.id){
        //                     flag = false;
        //                 }
        //             })
        //             return flag;
        //         })
        //     }else{
        //         let data = [];
        //         list.forEach( e => {
        //             let flag = true;
        //             this.currentSelect.forEach( i => {
        //                 if(i.id === e.id){
        //                     flag = false;
        //                 }
        //             })
        //             flag && data.push(e);
        //         });
        //         this.currentSelect.push(...data)
        //     }
        // },
        selectChangeHandler(selectData,row){
            if(selectData.includes(row)){
                this.currentSelect.push(row);
            }else{
                //需要优化，匹配到即跳出循环
                this.currentSelect = this.currentSelect.filter( e => {
                    if(e.id === row.id){
                        return false;
                    }
                    return true;
                });
                //
                console.log(this.$refs,row)
                // this.$refs[row.][0].toggleRowSelection(row,false)
            }
        },
        addBackupPlan(data) {
            console.log(data);
            let plan = Object.assign({}, data);
            let vmIds = this.selectData.map( e => {
                return e.id;
            });
            plan.vmList = vmIds;
            console.log(plan);
            this.btnLoading = true;
            createMultipleVirtualBackupPlan(plan)
                .then(res => {
                const { message } = res.data;
                // // 刷新情况下可能会出现两个添加后的计划
                // if (this.backupPlans.findIndex(plan => plan.id === backupPlan.id) === -1) {
                //     this.backupPlans.unshift(backupPlan)
                // }
                this.backupPlanCreateModalVisible = false;
                this.$message.success(message);
                })
                .catch(error => {
                this.$message.error(error);
                return false;
                })
                .then(() => {
                this.btnLoading = false;
                });
        },
        submitServerFn(data){
            let server = Object.assign({},data);
            server.hostId = this.host.id;
            server.hostName = this.host.name;
            console.log(server)
            this.btnLoading = true;
            addServer(server).then( res => {
                const {data, message} = res.data;
                if(this.tabsData.findIndex( e => e.id === data.id) === -1){
                    this.tabsData.unshift(data);
                    let d = Object.assign([], this.tabsData);
                    this.tabsData = [];
                    this.$nextTick( () => {
                        this.tabsData = d;
                    });
                }
                this.serverModalVisible = false;
                this.$message.success(message);
            }).catch( error => {
                this.$message.error(error);
            }).then( () => {
                this.btnLoading = false;
            })
        },
        buttonClickHandler(){
            if(this.isSelect){
                this.backupPlanCreateModalVisible = true;
            }else{
                this.serverModalVisible = true;
            }
        },
        // tabclickHandler(data){
        //     console.log(data)
        //      console.log(data.$attrs.test)
        // }
    }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
<style>

</style>


