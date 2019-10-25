import Guide from '@/components/Guide';
import DataBaseTakeOver from '@/components/pages/manual/DataBaseTakeOver';
import FileSystemDeletion from '@/components/pages/manual/filesystem/FileSystemDeletion';
import AddDataBase from '@/components/pages/manual/databaseprotection/AddDataBase';
import AddManagement from '@/components/pages/manual/virtual/AddManagement';
import AddApplication from '@/components/pages/manual/applicationprotection/AddApplication';
import InspectionTask from '@/components/pages/manual/inspection/InspectionTask';
import EquipmentManage from '@/components/pages/manual/systemmanager/EquipmentManage';
import DeploymentManage from '@/components/pages/manual/autodeployment/DeploymentManage';

const router = [
  {
    path: '/guide',
    name: 'guide',
    component: Guide,
    children: [
      {
        path: '/dataDaseTakeOver',
        name: 'dataDaseTakeOver',
        component: DataBaseTakeOver,
      },
      {
        path: '/fileSystemDeletion',
        name: 'fileSystemDeletion',
        component: FileSystemDeletion,
      },
      {
        path: '/addDataBase',
        name: 'addDataBase',
        component: AddDataBase,
      },
      {
        path: '/addManagement',
        name: 'addManagement',
        component: AddManagement,
      },
      {
        path: '/addApplication',
        name: 'addApplication',
        component: AddApplication,
      },
      {
        path: '/inspectionTask',
        name: 'inspectionTask',
        component: InspectionTask,
      },
      {
        path: '/equipmentManage',
        name: 'equipmentManage',
        component: EquipmentManage,
      },
      {
        path: '/deploymentManage',
        name: 'deploymentManage',
        component: DeploymentManage,
      },
    ],
  },
];
export default router;
