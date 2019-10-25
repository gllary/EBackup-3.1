import Layout from '@/components/Layout';
import InspectionTask from '@/components/pages/inspection/InspectionTask';
import InspectionTemplate from '@/components/pages/inspection/InspectionTemplate';
import InspectionConfig from '@/components/pages/inspection/InspectionConfig';

const router = [
  {
    path: '/inspect',
    component: Layout,
    meta: {
      title: '智能巡检',
      isActive: true,
      icon: 'inspection',
      roles: []
    },
    children: [
      {
        path: 'task',
        name: 'inspectionTask',
        component: InspectionTask,
        meta: {
          title: '巡检任务',
          activeName: 'inspectionTask',
          roles: [],
          isActive: true,
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '巡检任务',
              path: '/inspect/task',
            },
          ],
        }
      },
      {
        path: 'template',
        name: 'inspectionTemplate',
        component: InspectionTemplate,
        meta: {
          title: '模板',
          activeName: 'inspectionTemplate',
          roles: [],
          isActive: true,
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '模板',
              path: '/inspect/template',
            },
          ],
        }
      },
      {
        path: 'config',
        name: 'inspectionConfig',
        component: InspectionConfig,
        meta: {
          title: '参数配置',
          activeName: 'inspectionConfig',
          roles: [],
          isActive: true,
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '参数配置',
              path: '/inspect/config',
            },
          ],
        }
      }
    ]
  }
];

export default router;
