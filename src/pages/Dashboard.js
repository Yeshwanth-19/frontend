import { Navigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import TraderDashboard from './dashboards/TraderDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';

const ROLE_DASHBOARDS = {
  trader: TraderDashboard,
  admin: AdminDashboard,
  manager: ManagerDashboard,
};

function Dashboard() {
  const user = getUser();
  const role = user?.role?.toLowerCase();
  const RoleDashboard = ROLE_DASHBOARDS[role];

  if (!user || !RoleDashboard) {
    return <Navigate to="/login" replace />;
  }

  return <RoleDashboard user={user} />;
}

export default Dashboard;
