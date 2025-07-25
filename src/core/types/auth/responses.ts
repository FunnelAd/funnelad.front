import { User, UserRole, ClientSubRole } from './user';

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  storeName: string;
  phoneNumber: string;
  countryCode: string;
  role: UserRole;
  clientSubRole?: ClientSubRole;
}
