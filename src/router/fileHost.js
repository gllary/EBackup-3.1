import Layout from '@/components/Layout';
// import FileHostList from '@/components/pages/fileHost/FileHostList';
// import FileHostDetail from '@/components/pages/fileHost/FileHostDetail';
import FileHostList from '@/components/pages/file/FileHostList';
import FileHostDetail from '@/components/pages/file/FileHostDetail';

const router = [
  {
    path: '/filehost',
    component: Layout,
    meta: {
      title: '文件系统',
      icon: 'file',
      roles: ['file admin'],
    },
    children: [
      {
        path: '',
        name: 'fileHostList',
        component: FileHostList,
        meta: {
          title: '服务器列表',
          activeName: 'fileHost',
          roles: ['file admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '文件服务器列表',
              path: '/filehost',
            },
          ],
        },
      },
      {
        path: ':id',
        component: FileHostDetail,
        props: true,
        name: 'filehostDetail',
        meta: {
          activeName: 'fileHost',
          roles: ['file admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '文件服务器列表',
              path: '/filehost',
            },
            {
              name: '服务器详情',
              path: '',
            },
          ],
        },
      },
    ],
  }
];

export default router;
