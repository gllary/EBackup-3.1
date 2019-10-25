import isEqual from 'lodash/isEqual';
import { validateLength } from '../../utils/common';
import { databaseTypeMapping } from '../../utils/constant';

const genModalMixin = type => {
  if (!['database', 'filehost', 'host', 'vm', 'vmManageCollect'].includes(type)) {
    throw new Error('参数错误！');
  }
  const databaseModalMixin = {
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      type: {
        type: String,
        required: true,
        validator(value) {
          return [
            'oracle',
            'sqlserver',
            'mysql',
            'insql',
            'db2',
            'sybase',
            'cache',
            'informix',
            'postgresql',
            'filehost',
            'host',
            'vm',
            'vmManageCollect'
          ].includes(value);
        },
      },
      btnLoading: {
        type: Boolean,
        // required: true,
      },
    },
    data() {
      const dbTypePort = {
        sqlserver: 1433,
        oracle: 1521,
        mysql: 3306
      };
      const databaseBaseFormData = {
        id: -1,
        hostId: '',
        instanceName: '',
        loginName: '',
        password: '',
        application: '',
        dbVersion: '',
        dbPort: dbTypePort[this.type], // sqlserver-1433, oracle-1521, mysql-3306
        host: {},
      };
      const fileHostBaseFormData = {
        id: -1,
        // name: '',
        hostIp: '',
        loginName: '',
        password: '',
        hostName: '',
        osName: '',
        application: '',
      };
      const hostBaseFormData = {
        id: -1,
        name: '',
        hostIp: '',
        serviceIp: '',
        osName: '',
        loginName: '',
        password: '',
        hostType: 1,
        databaseType: 1,
        windowsType: 2,
        oracleVersion: '',
        storagePath: 'C',
        sharingPath: '',
        isRacMark: 1,
        vip: '',
        tempVip: '',
        storeType: 1
      };
      const virtualFormData = {
        id: -1,
        vmName: '',
        host: {},
      };
      const vmManageCollectFormData = {
        vmManageHostIp: '',
        vmManageHostLogin: '',
        vmManageHostPass: '',
        vmHostServerIp: '',
        vmHostServerUser: '',
        vmHostServerPass: '',
        vmHostServerType: 2
      };
      const baseData = {
        oracle: databaseBaseFormData,
        sqlserver: databaseBaseFormData,
        mysql: databaseBaseFormData,
        db2: databaseBaseFormData,
        sybase: databaseBaseFormData,
        cache: databaseBaseFormData,
        informix: databaseBaseFormData,
        postgresql: databaseBaseFormData,
        insql: databaseBaseFormData,
        filehost: fileHostBaseFormData,
        host: hostBaseFormData,
        vm: virtualFormData,
        vmManageCollect: vmManageCollectFormData
      };
      const loginType = {
        oracle: 'oracle数据库',
        sqlserver: 'sql server数据库',
        mysql: 'mysql数据库',
        db2: 'db2数据库',
        sybase: 'sybase数据库',
        cache: 'cache数据库',
        informix: 'informix数据库',
        postgresql: 'postgresql数据库',
        insql: 'insql数据库',
        filehost: '服务器',
        host: '设备'
      };
      const ipFormat = [
        {
          pattern: '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$',
          message: 'IP地址不正确',
          trigger: 'blur',
        }
      ];
      const baseRules = {
        loginName: [{
          required: true,
          message: `请输入${loginType[this.type]}登录账号`,
          trigger: 'blur',
        },
        {
          validator: validateLength(64),
          trigger: 'blur'
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ],
        password: [{
          required: true,
          message: `请输入${loginType[this.type]}登录密码`,
          trigger: 'blur',
        },
        {
          validator: validateLength(40),
          trigger: 'blur'
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ],
        hostIp: [{
          required: true,
          message: '请输入主机IP',
          trigger: 'blur'
        },
        {
          pattern: '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$',
          message: 'IP地址不正确',
          trigger: 'blur',
        }],
      };
      const hostRules = { // 设备管理输入校验
        hostIp: baseRules.hostIp,
        serviceIp: ipFormat,
        vip: ipFormat,
        tempVip: ipFormat,
        hostType: [{
          required: true,
          message: '请选择设备类型',
          trigger: 'blur'
        }],
        osName: [{
          required: true,
          message: '请选择操作系统',
          trigger: 'blur'
        }],
        oracleVersion: [{
          required: true,
          message: '请选择Oracle版本',
          trigger: 'blur'
        }],
        storagePath: [{
          required: true,
          message: '请选择存储盘符',
          trigger: 'change',
        }],
        loginName: baseRules.loginName,
        password: baseRules.password
      };
      const rules = { // 数据库、虚拟机
        name: [{
          validator: validateLength(50),
          trigger: 'blur'
        }],
        dbVersion: [{
          validator: validateLength(80),
          trigger: 'blur'
        }],
        dbPort: [{
          required: true,
          message: '请输入端口号',
          trigger: 'blur'
        },
        {
          pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
          message: '请输入0-65535之间的数字',
          trigger: 'blur'
        }],
        hostId: [{
          required: true,
          message: '请选择设备',
          trigger: 'change'
        }],
        databaseType: [{
          required: true,
          message: '请选择数据库类型',
          trigger: 'blur'
        }],
        instanceName: [{
          required: true,
          message: `请输入${
            this.type === 'oracle' ? '实例名' : '数据库名'
          }`,
          trigger: 'blur',
        },
        {
          validator: validateLength(40),
          trigger: 'blur',
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ],
        application: [
          {
            validator: validateLength(30),
            trigger: 'blur'
          }
        ],
        loginName: baseRules.loginName,
        password: baseRules.password,
        hostIp: baseRules.hostIp,
      };
      // 文件服务器备份必填 0530反馈
      const fileHostRules = {
        osName: [{
          required: true,
          message: '请选择操作系统',
          trigger: 'blur'
        }],
        hostName: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        },
        {
          validator: validateLength(20),
          trigger: 'blur'
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        }],
        application: [{
          validator: validateLength(20),
          trigger: 'blur'
        }],
        hostIp: baseRules.hostIp,
        loginName: baseRules.loginName,
        password: baseRules.password
      };
      return {
        originFormData: Object.assign({}, baseData[this.type]), // 原始值
        formData: Object.assign({}, baseData[this.type]),
        // trigger增加change更方便 但是再次打开modal会显示出验证结果
        // 猜测是因为初始化时，触发了change事件
        rules,
        baseRules,
        hostRules, // 设备校验规则
        fileHostRules,
        hiddenPassword: true,
        collapseName: '', // 折叠面板名称 目前就一个
        confirmBtnLoading: false, // 确认按钮加载动画
        isLoading: false,
        words: [],
      };
    },
    computed: {
      modalVisible: {
        get() {
          return this.visible;
        },
        set(value) {
          if (!value) {
            this.$emit('update:visible', value);
          }
        },
      },
      // 区分不同数据库都提示信息
      databaseOrInstance() {
        return this.type === 'oracle' ? '实例名' : '数据库名';
      },
      availableHosts() {
        return this.$store.getters[`${this.type}Hosts`].filter(
          h => h.hostType === 1
        );
      },
      databaseUseType() {
        return Object.keys(databaseTypeMapping).map(index =>
          ({ value: Number(index), text: databaseTypeMapping[index] })
        );
      }
    },
    mounted() {
      for (let i = 67; i < 91; i++) { // C-Z盘 盘符
        const word = {};
        word.value = String.fromCharCode(i);
        this.words.push(word);
      }
    },
    methods: {
      // 点击取消按钮触发
      cancelBtnClick() {
        this.hasModifiedBeforeClose(() => {
          this.$emit('update:visible', false); // 关闭modal
        });
      },
      // 退出之前，判断是否有未保存的修改
      beforeModalClose(done) {
        this.hasModifiedBeforeClose(done);
      },
      // 关闭之前 验证是否有修改
      hasModifiedBeforeClose(fn) {
        if (isEqual(this.formData, this.originFormData)) {
          fn();
        } else {
          this.$confirm('有未保存的修改，是否退出？', {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          })
            .then(() => {
              fn();
            })
            .catch(() => {});
        }
      },
    },
  };
  return databaseModalMixin;
};

// eslint-disable-next-line
export { genModalMixin };
