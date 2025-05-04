'use client';

import ProtectedRoute from '@/presentation/components/ProtectedRoute';
import UserRoleInfo from '@/presentation/components/UserRoleInfo';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UserRoleInfo />
          {/* Add more dashboard components here */}
        </div>
      </div>
    </ProtectedRoute>
  );
} 