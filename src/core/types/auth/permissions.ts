export enum Permission {
  CREATE_ASSISTANT = 'create:assistant',
  READ_ASSISTANT = 'read:assistant',
  UPDATE_ASSISTANT = 'update:assistant',
  DELETE_ASSISTANT = 'delete:assistant',
  
  CREATE_TEMPLATE = 'create:template',
  READ_TEMPLATE = 'read:template',
  UPDATE_TEMPLATE = 'update:template',
  DELETE_TEMPLATE = 'delete:template',
  
  CREATE_TRIGGER = 'create:trigger',
  READ_TRIGGER = 'read:trigger',
  UPDATE_TRIGGER = 'update:trigger',
  DELETE_TRIGGER = 'delete:trigger',
  
  MANAGE_USERS = 'manage:users',
  VIEW_STATS = 'view:stats',
}

// Esta función determina si un usuario tiene un permiso específico basado en su rol
export function hasPermission(permission: Permission, userRole: string, clientSubRole?: string): boolean {
  // Por ahora, retornamos true para permitir todo
  // TODO: Implementar lógica real de permisos basada en roles
  console.log(permission, userRole, clientSubRole )
  return true;
}
