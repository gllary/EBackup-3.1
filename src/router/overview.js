import OverView from '@/components/pages/overview/OverView';
import BackupRecoverView from '@/components/pages/overview/BackupRecoverView';
import TakeOverView from '@/components/pages/overview/TakeOverView';
import Layout from '@/components/Layout';

const overviewRouter = [
  {
    path: '/demonstrate',
    component: Layout,
    meta: {
      title: '演示',
      icon: 'demonstrate',
      roles: ['view admin'],
    },
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: OverView,
        meta: {
          title: '总览',
          roles: ['view admin'],
        },
      },
      {
        path: 'backuprecoverview',
        name: 'backuprecoverview',
        component: BackupRecoverView,
        meta: {
          title: '备份恢复',
          roles: ['view admin'],
        },
      },
      {
        path: 'takeoverview',
        name: 'takeoverview',
        component: TakeOverView,
        meta: {
          title: '一键接管',
          roles: ['view admin'],
        },
      },
    ]
  },
];

export default overviewRouter;
