import Layout from '@/components/Layout';
import VirtualList from '@/components/pages/virtual/VirtualList';
import VirtualDetail from '@/components/pages/virtual/VirtualDetail';
import VirtualTakeOver from '@/components/pages/virtual/takeover/TakeOver';
import VirtualLinkDetail from '@/components/pages/virtual/takeover/VirtualLinkDetail';
import BackupPlanList from '@/components/pages/virtual/BackupPlanList';
import ServerManager from '@/components/pages/virtual/ServerManager';

const virtualRouter = [
  {
    path: '/virtual',
    component: Layout,
    meta: {
      title: '虚拟机',
      icon: 'vm',
      roles: ['vm admin'],
    },
    children: [
      {
        path: 'vmware/takeover',
        name: 'vmwareTakeOver',
        component: VirtualTakeOver,
        meta: {
          roles: ['vm admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'VMware主机管理',
              path: '/virtual/vmwares/collectManager',
            },
            {
              name: 'VMware一键接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'hyperV/takeover',
        name: 'hyperVTakeOver',
        component: VirtualTakeOver,
        meta: {
          roles: ['vm admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Hyper-V主机管理',
              path: '/virtual/hyperVs/collectManager',
            },
            {
              name: 'Hyper-V一键接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'vmware/takeover/:id',
        name: 'vmwareLinkDetail',
        props: true,
        component: VirtualLinkDetail,
        meta: {
          roles: ['vm admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '虚拟机主机管理',
              path: '/virtual/vmwares/collectManager',
            },
            {
              name: 'VMware一键接管',
              path: '/virtual/vmware/takeover',
            },
            {
              name: '连接详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'hyperV/takeover/:id',
        name: 'hyperVLinkDetail',
        props: true,
        component: VirtualLinkDetail,
        meta: {
          roles: ['vm admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '虚拟机主机管理',
              path: '/virtual/hyperVs/collectManager',
            },
            {
              name: 'Hyper-V一键接管',
              path: '/virtual/hyperV/takeover',
            },
            {
              name: '连接详情',
              path: '',
            },
          ],
        },
      },
      {
        path: '',
        component: {
          render(c) {
            return c('router-view');
          }
        },
        meta: {
          title: 'VMware',
          roles: ['vm admin']
        },
        children: [
          {
            path: 'vmwares/collectManager',
            name: 'vmwareCollectManager',
            component: ServerManager,
            meta: {
              title: '虚拟机主机管理',
              activeName: 'vmwareHost',
              roles: ['vm admin'],
            },
          },
          {
            path: 'vmware',
            name: 'vmwareList',
            component: VirtualList,
            meta: {
              title: 'VMware列表',
              activeName: 'vmware',
              roles: ['vm admin'],
              breadcrumb: [
                {
                  name: '首页',
                  path: '/',
                },
                {
                  name: '虚拟机列表',
                  path: '',
                },
              ],
            },
          },
          {
            path: 'vmwares/backup',
            name: 'vmwareBackup',
            component: BackupPlanList,
            meta: {
              title: '备份计划',
              activeName: 'vmwareBackup',
              roles: ['vm admin'],
            },
          },
          {
            path: 'vmware/:id',
            props: true,
            component: VirtualDetail,
            name: 'vmwareDetail',
            meta: {
              activeName: 'vmware',
              roles: ['vm admin'],
              breadcrumb: [
                {
                  name: '首页',
                  path: '/',
                },
                {
                  name: '虚拟机列表',
                  path: '/virtual/vmware',
                },
                {
                  name: '虚拟机详情',
                  path: '',
                },
              ],
            },
          },
        ]
      },
      {
        path: '',
        component: {
          render(c) {
            return c('router-view');
          }
        },
        meta: {
          title: '华为虚拟机',
          activeName: 'fusionSphere',
          roles: ['vm admin']
        },
        children: [
          {
            path: 'fusionSpheres/collectManager',
            name: 'fusionSphereCollectManager',
            component: ServerManager,
            meta: {
              title: '虚拟机主机管理',
              activeName: 'fusionSphereHost',
              roles: ['vm admin']
            }
          },
          {
            path: 'fusionSphere',
            name: 'fusionSphereList',
            component: VirtualList,
            meta: {
              title: '华为虚拟机列表',
              activeName: 'fusionSphere',
              roles: ['vm admin'],
              breadcrumb: [
                {
                  name: '首页',
                  path: '/',
                },
                {
                  name: '虚拟机列表',
                  path: '',
                },
              ],
            },
          },
          {
            path: 'fusionSpheres/backup',
            name: 'fusionSphereBackup',
            component: BackupPlanList,
            meta: {
              title: '备份计划',
              activeName: 'fusionSphereBackup',
              roles: ['vm admin'],
            },
          },
          {
            path: 'fusionSphere/:id',
            props: true,
            component: VirtualDetail,
            name: 'fusionSphereDetail',
            meta: {
              activeName: 'fusionSphere',
              roles: ['vm admin'],
              breadcrumb: [
                {
                  name: '首页',
                  path: '/',
                },
                {
                  name: '虚拟机列表',
                  path: '/virtual/fusionSphere',
                },
                {
                  name: '虚拟机详情',
                  path: '',
                },
              ],
            },
          },
        ]
      },
      {
        path: '',
        component: {
          render(c) {
            return c('router-view');
          }
        },
        meta: {
          title: 'Hyper-V',
          roles: ['vm admin']
        },
        children: [
          {
            path: 'hyperVs/collectManager',
            name: 'hyperVCollectManager',
            component: ServerManager,
            meta: {
              title: '虚拟机主机管理',
              activeName: 'hyperVHost',
              roles: ['vm admin'],
            },
          },
          {
            path: 'hyperV',
            name: 'hyperVList',
            component: VirtualList,
            meta: {
              title: 'Hyper-V列表',
              activeName: 'hyperV',
              roles: ['vm admin'],
              breadcrumb: [
                {
                  name: '首页',
                  path: '/',
                },
                {
                  name: '虚拟机列表',
                  path: '',
                },
              ],
            },
          },
          {
            path: 'hyperVs/backup',
            name: 'hyperVBackup',
            component: BackupPlanList,
            meta: {
              title: '备份计划',
              activeName: 'hyperVBackup',
              roles: ['vm admin'],
            },
          },
          {
            path: 'hyperV/:id',
            props: true,
            component: VirtualDetail,
            name: 'hyperVDetail',
            meta: {
              activeName: 'hyperV',
              roles: ['vm admin'],
              breadcrumb: [
                {
                  name: '首页',
                  path: '/',
                },
                {
                  name: '虚拟机列表',
                  path: '/virtual/hyperV',
                },
                {
                  name: '虚拟机详情',
                  path: '',
                },
              ],
            },
          },
        ]
      },
    ],
  }
];

export default virtualRouter;
