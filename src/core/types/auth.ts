export enum UserRole {
  FUNNELAD = "FUNNELAD",
  CLIENT = "CLIENT",
}

export enum ClientSubRole {
  ADMIN = "ADMIN",
  AUXILIARY = "AUXILIARY",
}

export type Permission =
  | "view_conversations"
  | "manage_conversations"
  | "view_contacts"
  | "manage_contacts"
  | "view_reports"
  | "manage_settings"
  | "manage_users";

export interface User {
  id: string;
  auth0Id: string;
  name: string;
  email: string;
  role: UserRole;
  clientSubRole?: ClientSubRole;
  storeId?: string;
  storeName?: string;
  permissions: Permission[];
}

export interface Company {
  nit: string;
  name: string;
  email: string;
  storeId?: string;
  storeName?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  data: AuthResponse;
  user: User | null;
  email: string;
  access_token: string;
  expires_in: number;
  company: Company | null;
}

export interface RolePermissions {
  [UserRole.FUNNELAD]: Permission[];
  [UserRole.CLIENT]: {
    [ClientSubRole.ADMIN]: Permission[];
    [ClientSubRole.AUXILIARY]: Permission[];
  };
}

export const RolePermissions: RolePermissions = {
  [UserRole.FUNNELAD]: [
    "view_conversations",
    "manage_conversations",
    "view_contacts",
    "manage_contacts",
    "view_reports",
    "manage_settings",
    "manage_users",
  ],
  [UserRole.CLIENT]: {
    [ClientSubRole.ADMIN]: [
      "view_conversations",
      "manage_conversations",
      "view_contacts",
      "manage_contacts",
      "view_reports",
      "manage_settings",
    ],
    [ClientSubRole.AUXILIARY]: [
      "view_conversations",
      "view_contacts",
      "view_reports",
    ],
  },
};

export function hasPermission(user: User, permission: Permission): boolean {
  if (user.role === UserRole.FUNNELAD) {
    return RolePermissions[UserRole.FUNNELAD].includes(permission);
  }

  if (user.role === UserRole.CLIENT && user.clientSubRole) {
    return RolePermissions[UserRole.CLIENT][user.clientSubRole].includes(
      permission
    );
  }

  return false;
}
