import { ClientSubRole, User, UserRole } from "./user";

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  storeName: string;
  phoneNumber: string;
  countryCode: string;
  role: UserRole;
  clientSubRole?: ClientSubRole;
}
