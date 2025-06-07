import { api } from "@/core/api";
import type { AuthResponse } from "@/core/types/auth";
import type { RegisterData } from "@/core/types/auth/responses";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {

    // console.log('Login attempt with email:', email);
    // console.log('Login attempt with password:', password);
    const response = await api.post(
      "https://funnelad-api.onrender.com/api/users/login",
      { email, password }
    );
    console.log("Login response:", response);

    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post("/api/users/register", data);
    return response.data;
  },

  async verifyToken(): Promise<AuthResponse> {
    const response = await api.get("/auth/verify");
    return response.data;
  },
};
