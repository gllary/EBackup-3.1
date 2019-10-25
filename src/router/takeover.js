import Layout from '@/components/Layout';
import DatabaseTakeOver from '@/components/pages/takeover/TakeOver';
import VirtualTakeOver from '@/components/pages/virtual/takeover/TakeOver';
import SwitchList from '@/components/pages/SwitchList';
import SwitchDetail from '@/components/pages/SwitchDetail';
import AppTakeOver from '@/components/pages/application/TakeOver';
import MysqlTakeOver from '@/components/pages/takeover/mysql/TakeOver';

const takeoverRouter = [
  {
    path: '/to',
    component: Layout,
    meta: {
      title: '一键接管',
      icon: 'takeover',
      roles: ['oracle dba', 'sql server dba', 'application admin', 'mysql dba', 'insql dba', 'vm admin'],
    },
    children: [
      {
        path: 'oracle/takeover',
        name: 'oracleTakeOverView',
        component: DatabaseTakeOver,
        meta: {
          title: '数据库',
          activeName: 'overview',
          roles: ['oracle dba', 'sql server dba', 'mysql dba', 'insql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Oracle接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sqlserver/takeover',
        name: 'sqlserverTakeOverView',
        component: DatabaseTakeOver,
        meta: {
          activeName: 'overview',
          roles: ['sql server dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'SQLServer接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'mysql/takeover',
        name: 'mysqlTakeOverView',
        component: MysqlTakeOver,
        meta: {
          activeName: 'overview',
          roles: ['mysql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'MySql接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'insql/takeover',
        name: 'insqlTakeOverView',
        component: DatabaseTakeOver,
        meta: {
          activeName: 'overview',
          roles: ['insql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'InSql接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'vmware/takeover',
        name: 'vmwareTakeOverView',
        component: VirtualTakeOver,
        meta: {
          title: '虚拟机',
          activeName: 'virtualOverView',
          roles: ['vm admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'VMware接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'hyperV/takeover',
        name: 'hyperVTakeOverView',
        component: VirtualTakeOver,
        meta: {
          activeName: 'virtualOverView',
          roles: ['vm admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Hyper-V接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'app/takeover',
        name: 'appTakeOverView',
        component: AppTakeOver,
        meta: {
          activeName: 'appOverview',
          roles: ['application admin'],
          title: '应用服务器',
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '应用服务器接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'oracle/switchlist',
        name: 'oracleSwitchList',
        component: SwitchList,
        meta: {
          title: '灾备演练',
          activeName: 'drill',
          roles: ['oracle dba', 'sql server dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '批量切换计划',
              path: '',
            },
          ]
        }
      },
      {
        path: 'oracle/switchlist/:id',
        name: 'oracleSwitchDetail',
        component: SwitchDetail,
        meta: {
          activeName: 'drill',
          roles: ['oracle dba', 'sql server dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '批量切换计划',
              path: '/to/oracle/switchlist',
            },
            {
              name: '切换详情',
              path: ''
            }
          ]
        }
      }
    ],
  },
];

export default takeoverRouter;
