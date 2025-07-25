'use client';


import UserRoleInfo from '@/presentation/components/UserRoleInfo';

export default function SettingsPage() {
  return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Configuración</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UserRoleInfo />
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de la tienda</h3>
            <p className="text-sm text-gray-500">
              Esta sección solo es visible para usuarios con permisos de administración.
            </p>
          </div>
        </div>
      </div>
  );
} 