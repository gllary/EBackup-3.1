<template>
    <el-dialog
        title="请选择设备"
        :visible.sync="innerVisible"
        @close="modalClosed"
        append-to-body>
        <el-table :data="hostsInVuex"
                  style="width: 100%">
            <el-table-column  width="50" style="text-align: center">
                <template slot-scope="scope" >
                    <el-radio class="radio"
                              v-model="radioValue"
                              :label="scope.row.id"
                              :disabled="([1, 3].includes(vmType) && scope.row.osName === 'Linux') || (vmType === 2 && scope.row.osName === 'Windows')"
                              @change.native="getCurrentRow(scope.$index,scope.row)" >&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="设备名"
                             min-width="150"
                             align="center">
            </el-table-column>
            <el-table-column prop="hostIp"
                            label="设备IP"
                            min-width="130"
                            align="center"></el-table-column>
            <el-table-column prop="serviceIp"
                            label="操作IP"
                            min-width="130"
                            align="center"></el-table-column>
            <el-table-column prop="hostType"
                            label="设备类型"
                            :formatter="judgeHost"
                            min-width="80"
                            align="center"></el-table-column>
            <el-table-column prop="databaseType"
                            label="用途类型"
                            :formatter="judgeDatabase"
                            min-width="80"
                            align="center"></el-table-column>
            <el-table-column prop="osName"
                            label="操作系统"
                            min-width="90"
                            align="center"></el-table-column>
            <el-table-column prop="loginName"
                            label="登录账号"
                            min-width="80"
                            align="center"></el-table-column>
        
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="comfireFn" :disabled="disabled">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { hostTypeMapping, databaseTypeMapping } from '../../utils/constant';
export default {
    props: {
        visible: {
            type: Boolean
        },
        selected: {
            type: Object
        },
        vmType: {
            type: Number,
            default: -1
        }
    },
    data(){
        return {
            currentSelect: this.selected,
            radioValue: this.selected.hostId
        }
    },
    watch: {
        visible(val){
            if(val){
                this.radioValue = this.selected.hostId
            }
        }
    },
    computed: {
        // 从vuex中获取hosts列表
        hostsInVuex() {
            return this.$store.state.host.hosts.filter( e => e.databaseType === 4);
        },
        innerVisible: {
            get() {
                return this.visible;
            },
            set(value) {
                if (!value) {
                    this.$emit('update:visible', value);
                }
            },
        },
        disabled(){
            return this.currentSelect ? false: true
        }
    },
    methods: {
        judgeHost(data) {
            return hostTypeMapping[data.hostType];
        },
        judgeDatabase(data) {
            return databaseTypeMapping[data.databaseType];
        },
        getCurrentRow(index, row){
            this.currentSelect = row;
        },
        comfireFn(){
            this.$emit('confirm', this.currentSelect);
        },
        modalClosed(){
            this.radioValue = null;
        }
    }
}
</script>

