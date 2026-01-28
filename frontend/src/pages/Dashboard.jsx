import React from 'react';
import { useAuth } from '../context/AuthContext';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import PrincipalDashboard from './dashboards/PrincipalDashboard';
import HODDashboard from './dashboards/HODDashboard';
import StaffDashboard from './dashboards/StaffDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import LabAssistantDashboard from './dashboards/LabAssistantDashboard';
import AccountantDashboard from './dashboards/AccountantDashboard';
import LibrarianDashboard from './dashboards/LibrarianDashboard';
import ITAdminDashboard from './dashboards/ITAdminDashboard';

export default function Dashboard() {
  const { roles } = useAuth();
  const primaryRole = roles[0];

  if (!primaryRole) {
    return <div className="text-sm text-slate-600">No role assigned.</div>;
  }

  switch (primaryRole) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'PRINCIPAL':
      return <PrincipalDashboard />;
    case 'HOD':
      return <HODDashboard />;
    case 'STAFF':
      return <StaffDashboard />;
    case 'STUDENT':
      return <StudentDashboard />;
    case 'LAB_ASSISTANT':
      return <LabAssistantDashboard />;
    case 'ACCOUNTANT':
      return <AccountantDashboard />;
    case 'LIBRARIAN':
      return <LibrarianDashboard />;
    case 'IT_ADMIN':
      return <ITAdminDashboard />;
    default:
      return <div className="text-sm text-slate-600">Unsupported role: {primaryRole}</div>;
  }
}

