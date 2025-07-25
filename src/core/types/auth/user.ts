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
  CLIENT = 'CLIENT',
  FUNNELAD = 'FUNNELAD'
}

export enum ClientSubRole {
  ADMIN = 'ADMIN',
  AUXILIARY = 'AUXILIARY'
}
