import Layout from '@/components/Layout';
import TakeOver from '@/components/pages/takeover/TakeOver';
import OracleList from '@/components/pages/oracle/OracleList';
import OracleDetail from '@/components/pages/oracle/OracleDetail';
import SqlServerList from '@/components/pages/sqlserver/SqlServerList';
import SqlServerDetail from '@/components/pages/sqlserver/SqlServerDetail';
import MySqlList from '@/components/pages/mysql/MySqlList';
import MySqlDetail from '@/components/pages/mysql/MySqlDetail';
import DB2List from '@/components/pages/db2/DB2List';
import DB2Detail from '@/components/pages/db2/DB2Details';
import DamengList from '@/components/pages/dm/DamengList';
import DamengDetails from '@/components/pages/dm/DamengDetails';
import SybaseList from '@/components/pages/sybase/SybaseList';
import SybaseDetails from '@/components/pages/sybase/SybaseDetails';
import CacheList from '@/components/pages/cache/CacheList';
import CacheDetails from '@/components/pages/cache/CacheDetails';
import InSqlList from '@/components/pages/insql/InSqlList';
import InSqlDetail from '@/components/pages/insql/InSqlDetail';
import InformixList from '@/components/pages/informix/InformixList';
import InformixDetail from '@/components/pages/informix/InformixDetail';
import PostgreSQLList from '@/components/pages/postgresql/PostgreSQLList';
import PostgreSQLDetail from '@/components/pages/postgresql/PostgreSQLDetail';
import DatabaseLinkDetail from '@/components/pages/takeover/DatabaseLinkDetail';
import MysqlTakeOver from '@/components/pages/takeover/mysql/TakeOver';

const router = [
  {
    path: '/db',
    component: Layout,
    meta: {
      title: '数据库',
      icon: 'database',
      roles: ['oracle dba', 'sql server dba', 'mysql dba',
        'db2 dba', 'dm dba', 'sybase dba', 'cache dba', 'insql dba', 'informix dba', 'postgresql dba'],
    },
    children: [
      {
        path: 'oracle/takeover',
        name: 'oracleTakeOver',
        component: TakeOver,
        meta: {
          roles: ['oracle dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Oracle列表',
              path: '/db/oracle',
            },
            {
              name: 'Oracle一键接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'oracle/takeover/:id',
        name: 'oracleLinkDetail',
        props: true,
        component: DatabaseLinkDetail,
        meta: {
          roles: ['oracle dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Oracle列表',
              path: '/db/oracle',
            },
            {
              name: 'Oracle一键接管',
              path: '/db/oracle/takeover',
            },
            {
              name: '连接详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sqlserver/takeover',
        name: 'sqlserverTakeOver',
        component: TakeOver,
        meta: {
          roles: ['sql server dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'SQLServer列表',
              path: '/db/sqlserver',
            },
            {
              name: 'SQLServer一键接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'insql/takeover',
        name: 'insqlTakeOver',
        component: TakeOver,
        meta: {
          roles: ['insql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'InSql列表',
              path: '/db/insql',
            },
            {
              name: 'InSql一键接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'mysql/takeover',
        name: 'mysqlTakeOver',
        component: MysqlTakeOver,
        meta: {
          roles: ['mysql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'MySql列表',
              path: '/db/mysql',
            },
            {
              name: 'MySql一键接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sqlserver/takeover/:id',
        name: 'sqlserverLinkDetail',
        props: true,
        component: DatabaseLinkDetail,
        meta: {
          roles: ['sql server dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'SQLServer列表',
              path: '/db/sqlserver',
            },
            {
              name: 'SQLServer一键接管',
              path: '/db/sqlserver/takeover',
            },
            {
              name: '连接详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'insql/takeover/:id',
        name: 'insqlLinkDetail',
        props: true,
        component: DatabaseLinkDetail,
        meta: {
          roles: ['insql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'InSql列表',
              path: '/db/insql',
            },
            {
              name: 'InSql一键接管',
              path: '/db/insql/takeover',
            },
            {
              name: '连接详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'mysql/takeover/:id',
        name: 'mysqlLinkDetail',
        props: true,
        component: DatabaseLinkDetail,
        meta: {
          roles: ['mysql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'MySql列表',
              path: '/db/mysql',
            },
            {
              name: 'MySql一键接管',
              path: '/db/mysql/takeover',
            },
            {
              name: '连接详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'oracle',
        name: 'oracleList',
        component: OracleList,
        meta: {
          title: 'Oracle',
          activeName: 'oracle',
          roles: ['oracle dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Oracle列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sqlserver',
        name: 'sqlserverList',
        component: SqlServerList,
        meta: {
          title: 'SQL Server',
          activeName: 'sqlserver',
          roles: ['sql server dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'SQLServer列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'mysql',
        name: 'mysqlList',
        component: MySqlList,
        meta: {
          title: 'MySql',
          activeName: 'mysql',
          roles: ['mysql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'MySql列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'db2',
        name: 'db2List',
        component: DB2List,
        meta: {
          title: 'DB2',
          activeName: 'db2',
          roles: ['db2 dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'DB2列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'dm',
        name: 'DamengList',
        component: DamengList,
        meta: {
          title: '达梦',
          activeName: 'dm',
          roles: ['dm dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '达梦数据库列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sybase',
        name: 'sybaseList',
        component: SybaseList,
        meta: {
          title: 'Sybase',
          activeName: 'sybase',
          roles: ['sybase dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Sybase列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'cache',
        name: 'cacheList',
        component: CacheList,
        meta: {
          title: 'Cache',
          activeName: 'cache',
          roles: ['cache dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Cache列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'insql',
        name: 'insqlList',
        component: InSqlList,
        meta: {
          title: 'InSql',
          activeName: 'insql',
          roles: ['insql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'InSql列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'informix',
        name: 'informixList',
        component: InformixList,
        meta: {
          title: 'Informix',
          activeName: 'informix',
          roles: ['informix dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Informix列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'postgresql',
        name: 'postgresqlList',
        component: PostgreSQLList,
        meta: {
          title: 'PostgreSQL',
          activeName: 'postgresql',
          roles: ['postgresql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'PostgreSQL列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'dm/:id',
        props: true,
        component: DamengDetails,
        name: 'damengDetail',
        meta: {
          activeName: 'dameng',
          roles: ['dm dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '达梦数据库列表',
              path: '/db/dm',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'oracle/:id',
        props: true,
        component: OracleDetail,
        name: 'oracleDetail',
        meta: {
          activeName: 'oracle',
          roles: ['oracle dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Oracle列表',
              path: '/db/oracle',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sqlserver/:id',
        props: true,
        component: SqlServerDetail,
        name: 'sqlserverDetail',
        meta: {
          activeName: 'sqlserver',
          role: 'sql server dba',
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'SQLServer列表',
              path: '/db/sqlserver',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'mysql/:id',
        props: true,
        component: MySqlDetail,
        name: 'mysqlDetail',
        meta: {
          activeName: 'mysql',
          roles: ['mysql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'MySql列表',
              path: '/db/mysql',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'db2/:id',
        props: true,
        component: DB2Detail,
        name: 'db2Detail',
        meta: {
          activeName: 'db2',
          roles: ['db2 dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'DB2列表',
              path: '/db/db2',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sybase/:id',
        props: true,
        component: SybaseDetails,
        name: 'sybaseDetail',
        meta: {
          activeName: 'sybase',
          roles: ['sybase dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Sybase列表',
              path: '/db/sybase',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'cache/:id',
        props: true,
        component: CacheDetails,
        name: 'cacheDetail',
        meta: {
          activeName: 'cache',
          roles: ['cache dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Cache列表',
              path: '/db/cache',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'insql/:id',
        props: true,
        component: InSqlDetail,
        name: 'insqlDetail',
        meta: {
          activeName: 'insql',
          roles: ['insql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'InSql列表',
              path: '/db/insql',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'informix/:id',
        props: true,
        component: InformixDetail,
        name: 'informixDetail',
        meta: {
          activeName: 'informix',
          roles: ['informix dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Informix列表',
              path: '/db/informix',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'postgresql/:id',
        props: true,
        component: PostgreSQLDetail,
        name: 'postgresqlDetail',
        meta: {
          activeName: 'postgresql',
          roles: ['postgresql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'PostgreSQL列表',
              path: '/db/postgresql',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
    ],
  }
];

export default router;
