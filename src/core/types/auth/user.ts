export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  clientSubRole?: ClientSubRole;
  storeId?: string;
  storeName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  CLIENT = 'client',
  FUNNELAD = 'funnelad'
}

export enum ClientSubRole {
  ADMIN = 'admin',
  AUXILIARY = 'auxiliary'
}
