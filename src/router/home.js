import BackupPlans from '@/components/pages/BackupPlans';
import BackupDetail from '@/components/pages/BackupDetail';
import RestorePlans from '@/components/pages/RestorePlans';
import RestoreDetail from '@/components/pages/RestoreDetail';
import Layout from '@/components/Layout';

const homeRouter = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'backupPlans',
        name: 'backupPlans',
        component: BackupPlans,
        meta: {
          activeName: 'dashboard',
          roles: [],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '备份计划',
              path: '',
            }
          ],
        },
      },
      {
        path: 'backupDetail',
        name: 'backupDetail',
        component: BackupDetail,
        meta: {
          roles: [],
          activeName: 'dashboard',
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '备份计划',
              path: '/backupPlans',
            },
            {
              name: '备份计划详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'restorePlans',
        name: 'restorePlans',
        component: RestorePlans,
        meta: {
          activeName: 'dashboard',
          roles: [],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '恢复计划',
              path: '',
            }
          ],
        },
      },
      {
        path: 'restoreDetail',
        name: 'restoreDetail',
        component: RestoreDetail,
        meta: {
          roles: [],
          activeName: 'dashboard',
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '恢复计划',
              path: '/restorePlans',
            },
            {
              name: '恢复计划详情',
              path: '',
            },
          ],
        },
      },
    ],
  }
];

export default homeRouter;
