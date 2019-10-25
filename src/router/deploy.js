import Layout from '@/components/Layout';
import DeployManager from '@/components/pages/deploy/DeployManager';
import VersionList from '@/components/pages/deploy/VersionList';

const router = [
  {
    path: '/deploy',
    component: Layout,
    meta: {
      title: '自动化部署',
      icon: 'deploy',
      roles: [],
    },
    children: [
      {
        path: 'deployManager',
        name: 'deployManager',
        component: DeployManager,
        meta: {
          title: '部署管理',
          activeName: 'deployManager',
          roles: [],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '版本管理',
              path: '/deploy/deployManager',
            },
          ],
        }
      },
      {
        path: 'versionList',
        name: 'versionList',
        component: VersionList,
        meta: {
          title: '版本库',
          activeName: 'versionList',
          roles: [],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '版本库',
              path: '/deploy/versionList',
            },
          ],
        }
      }
    ]
  }
];

export default router;
