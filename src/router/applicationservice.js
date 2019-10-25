import Layout from '@/components/Layout';
import ApplicationList from '@/components/pages/application/ApplicationList';
import TakeOver from '@/components/pages/application/TakeOver';
import ApplicationLinkDetail from '@/components/pages/application/ApplicationLinkDetail';

export default [
  {
    path: '/as',
    component: Layout,
    meta: {
      title: '应用服务',
      icon: 'applicationService',
      roles: ['application admin']
    },
    children: [
      {
        path: 'application',
        name: 'applicationList',
        component: ApplicationList,
        meta: {
          title: '应用服务器',
          activeName: 'application',
          roles: ['application admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '应用服务器列表',
              path: '',
            },
          ],
        }
      },
      {
        path: 'application/takeover',
        name: 'applicationTakeOver',
        component: TakeOver,
        meta: {
          roles: ['application admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '应用服务器列表',
              path: '/as/application',
            },
            {
              name: '一键接管',
              path: 'takeover'
            }
          ],
        }
      },
      {
        path: 'application/takeover/:id',
        name: 'applicationLinkDetail',
        props: true,
        component: ApplicationLinkDetail,
        meta: {
          roles: ['application admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '应用服务器列表',
              path: '/as/application',
            },
            {
              name: '一键接管',
              path: '/as/application/takeover',
            },
            {
              name: '连接详情',
              path: '',
            },
          ],
        },
      },
    ]
  }
];
